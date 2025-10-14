import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'dep-types/connect'
import type { Plugin } from '../plugin'
import {
  type SecurityConfig,
  createSecurityMiddleware,
} from '../security.config'
// import colors from 'picocolors'

export interface CSPViolationReport {
  'csp-report': {
    'document-uri': string
    referrer: string
    'violated-directive': string
    'effective-directive': string
    'original-policy': string
    disposition: string
    'blocked-uri': string
    'line-number': number
    'column-number': number
    'source-file': string
    'status-code': number
    'script-sample': string
  }
}

export interface CSPNonce {
  script: string
  style: string
}

/**
 * Enhanced CSP Middleware Plugin for Nalth Development Server
 * Provides CSP violation reporting, nonce generation, and real-time security monitoring
 */
export function cspMiddlewarePlugin(
  options: Partial<SecurityConfig> = {},
): Plugin {
  const violations: CSPViolationReport[] = []
  const nonceCache = new Map<string, CSPNonce>()

  return {
    name: 'nalth:csp-middleware',
    configureServer(server) {
      // Add security middleware with enhanced CSP
      server.middlewares.use(
        createEnhancedSecurityMiddleware(options, nonceCache),
      )

      // CSP violation reporting endpoint
      server.middlewares.use(
        '/__nalth/csp-report',
        (req: IncomingMessage, res: ServerResponse) => {
          if (req.method === 'POST') {
            let body = ''

            req.on('data', (chunk) => {
              body += chunk.toString()
            })

            req.on('end', () => {
              try {
                const report: CSPViolationReport = JSON.parse(body)
                violations.push(report)

                // Enhanced violation logging
                const cspReport = report['csp-report']
                // Enhanced violation logging
                // console.warn(colors.red('🚨 CSP Violation Detected:'))
                // console.warn(colors.yellow(`  Directive: ${cspReport['violated-directive']}`))
                // console.warn(colors.yellow(`  Blocked URI: ${cspReport['blocked-uri']}`))
                // console.warn(colors.yellow(`  Source: ${cspReport['source-file']}:${cspReport['line-number']}`))
                // console.warn(colors.yellow(`  Document: ${cspReport['document-uri']}`))

                if (cspReport['script-sample']) {
                  // console.warn(colors.gray(`  Sample: ${cspReport['script-sample']}`))
                }

                // Keep only last 100 violations
                if (violations.length > 100) {
                  violations.splice(0, violations.length - 100)
                }

                res.writeHead(204, { 'Content-Type': 'text/plain' })
                res.end()
              } catch (_error) {
                // console.error('Failed to parse CSP violation report:', _error)
                res.writeHead(400, { 'Content-Type': 'text/plain' })
                res.end('Bad Request')
              }
            })
          } else if (req.method === 'GET') {
            // Return detailed violation statistics
            const stats = {
              total: violations.length,
              recent: violations.slice(-10),
              byDirective: violations.reduce(
                (acc, violation) => {
                  const directive =
                    violation['csp-report']['violated-directive']
                  acc[directive] = (acc[directive] || 0) + 1
                  return acc
                },
                {} as Record<string, number>,
              ),
              byBlockedUri: violations.reduce(
                (acc, violation) => {
                  const uri = violation['csp-report']['blocked-uri']
                  acc[uri] = (acc[uri] || 0) + 1
                  return acc
                },
                {} as Record<string, number>,
              ),
              timeline: violations.map((v) => ({
                timestamp: Date.now(),
                directive: v['csp-report']['violated-directive'],
                uri: v['csp-report']['blocked-uri'],
              })),
            }

            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            })
            res.end(JSON.stringify(stats, null, 2))
          } else {
            res.writeHead(405, { 'Content-Type': 'text/plain' })
            res.end('Method Not Allowed')
          }
        },
      )

      // Enhanced security dashboard endpoint
      server.middlewares.use(
        '/__nalth/security',
        (_req: IncomingMessage, res: ServerResponse) => {
          const securityInfo = {
            timestamp: new Date().toISOString(),
            status: 'active',
            https: {
              enabled: options.https?.enabled || false,
              autoGenerate: options.https?.autoGenerate || false,
            },
            csp: {
              enabled: options.csp?.enabled || false,
              violations: violations.length,
              reportOnly: options.csp?.reportOnly || false,
              directives: Object.keys(options.csp?.directives || {}),
              reportUri: options.csp?.reportUri,
            },
            headers: {
              hsts: !!options.headers?.hsts,
              frameOptions: options.headers?.frameOptions || 'not-set',
              contentTypeOptions: !!options.headers?.contentTypeOptions,
              referrerPolicy: options.headers?.referrerPolicy || 'not-set',
            },
            sri: {
              enabled: options.sri?.enabled || false,
              algorithms: options.sri?.algorithms || [],
            },
            audit: {
              enabled: options.audit?.enabled || false,
              patterns: options.audit?.unsafePatterns?.length || 0,
            },
          }

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          })
          res.end(JSON.stringify(securityInfo, null, 2))
        },
      )

      // Security health check endpoint
      server.middlewares.use(
        '/__nalth/health',
        (_req: IncomingMessage, res: ServerResponse) => {
          const recentViolations = violations.filter(
            (v) => Date.now() - (v as any).timestamp < 60000, // Last minute
          ).length

          const status = {
            status: recentViolations > 10 ? 'warning' : 'healthy',
            security: {
              https: options.https?.enabled ? 'enabled' : 'disabled',
              csp: options.csp?.enabled ? 'active' : 'disabled',
              violations: violations.length,
              recentViolations,
            },
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
          }

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          })
          res.end(JSON.stringify(status))
        },
      )
    },
  }
}

/**
 * Create enhanced security middleware with nonce support
 */
function createEnhancedSecurityMiddleware(
  config: Partial<SecurityConfig> = {},
  nonceCache: Map<string, CSPNonce>,
): Connect.NextHandleFunction {
  return (
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ) => {
    // Generate nonces for this request
    const nonce = generateCSPNonces()
    const requestId = req.headers['x-request-id'] || Math.random().toString(36)
    nonceCache.set(requestId as string, nonce)

    // Apply base security middleware
    const baseMiddleware = createSecurityMiddleware(config)
    baseMiddleware(req, res, () => {
      // Add nonce to CSP if enabled
      if (config.csp?.enabled && !config.csp.reportOnly) {
        const existingCSP = res.getHeader('Content-Security-Policy') as string
        if (existingCSP) {
          const enhancedCSP = enhanceCSPWithNonces(existingCSP, nonce)
          res.setHeader('Content-Security-Policy', enhancedCSP)
        }
      }

      // Add security monitoring headers
      res.setHeader('X-Nalth-Security', 'active')
      res.setHeader('X-CSP-Nonce-Script', nonce.script)
      res.setHeader('X-CSP-Nonce-Style', nonce.style)

      next()
    })
  }
}

/**
 * Generate cryptographically secure nonces for CSP
 */
export function generateCSPNonces(): CSPNonce {
  // Use dynamic import in a sync way - this is acceptable for node built-ins
  const crypto = eval('require')('node:crypto')
  return {
    script: crypto.randomBytes(16).toString('base64'),
    style: crypto.randomBytes(16).toString('base64'),
  }
}

/**
 * Enhance CSP directives with nonces
 */
function enhanceCSPWithNonces(csp: string, nonces: CSPNonce): string {
  let enhancedCSP = csp

  // Add nonce to script-src
  enhancedCSP = enhancedCSP.replace(
    /script-src ([^;]+)/,
    `script-src $1 'nonce-${nonces.script}'`,
  )

  // Add nonce to style-src
  enhancedCSP = enhancedCSP.replace(
    /style-src ([^;]+)/,
    `style-src $1 'nonce-${nonces.style}'`,
  )

  return enhancedCSP
}

/**
 * Create development-friendly CSP configuration with enhanced security
 */
export function createDevCSPConfig(): Partial<SecurityConfig> {
  return {
    csp: {
      enabled: true,
      reportOnly: false, // Set to true for testing
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'", // Required for Vite HMR
          "'unsafe-eval'", // Required for development tools
          'localhost:*',
          '127.0.0.1:*',
          'ws:',
          'wss:',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'", // Required for CSS-in-JS and HMR
          'fonts.googleapis.com',
        ],
        'img-src': ["'self'", 'data:', 'https:', 'blob:'],
        'font-src': ["'self'", 'https:', 'data:', 'fonts.gstatic.com'],
        'connect-src': ["'self'", 'ws:', 'wss:', 'localhost:*', '127.0.0.1:*'],
        'media-src': ["'self'", 'data:', 'blob:'],
        'object-src': ["'none'"],
        'child-src': ["'self'", 'blob:'],
        'worker-src': ["'self'", 'blob:'],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'manifest-src': ["'self'"],
        'upgrade-insecure-requests': [],
      },
      reportUri: '/__nalth/csp-report',
    },
    headers: {
      frameOptions: 'DENY',
      contentTypeOptions: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
    },
  }
}

/**
 * Create production CSP configuration with strict security
 */
export function createProdCSPConfig(): Partial<SecurityConfig> {
  return {
    csp: {
      enabled: true,
      reportOnly: false,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", 'fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'fonts.gstatic.com'],
        'connect-src': ["'self'"],
        'media-src': ["'self'"],
        'object-src': ["'none'"],
        'child-src': ["'none'"],
        'worker-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'manifest-src': ["'self'"],
        'upgrade-insecure-requests': [],
      },
      reportUri: '/api/csp-report',
    },
    headers: {
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameOptions: 'DENY',
      contentTypeOptions: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
    },
  }
}
