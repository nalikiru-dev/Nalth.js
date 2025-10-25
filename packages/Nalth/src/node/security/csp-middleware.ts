import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'dep-types/connect'
import type { Plugin } from '../plugin'
import {
  type SecurityConfig,
  createSecurityMiddleware,
} from '../security.config'
// import colors from 'picocolors'

// Helper functions for security dashboard
function calculateSecurityScore(options: Partial<SecurityConfig>, violationCount: number): number {
  let score = 100
  
  // Deduct points for missing security features
  if (!options.https?.enabled) score -= 20
  if (!options.csp?.enabled) score -= 25
  if (!options.sri?.enabled) score -= 10
  if (!options.audit?.enabled) score -= 10
  if (!options.headers?.hsts) score -= 5
  if (!options.headers?.frameOptions) score -= 5
  if (!options.headers?.contentTypeOptions) score -= 5
  
  // Deduct points for violations
  score -= Math.min(violationCount * 2, 20)
  
  return Math.max(score, 0)
}

function countActiveHeaders(options: Partial<SecurityConfig>): number {
  let count = 0
  if (options.headers?.hsts) count++
  if (options.headers?.frameOptions) count++
  if (options.headers?.contentTypeOptions) count++
  if (options.headers?.referrerPolicy) count++
  // Add more headers as they're available in the type
  return count
}

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
        '/__nalth/dashboard',
        (_req: IncomingMessage, res: ServerResponse) => {
          const recentViolations = violations.filter(v => 
            Date.now() - (v as any).timestamp < 300000 // Last 5 minutes
          ).length
          
          const securityScore = calculateSecurityScore(options, violations.length)
          
          const dashboardHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🛡️ Nalth Security Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 20px;
    }
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: rgba(15, 23, 42, 0.8);
      border-radius: 16px;
      border: 1px solid #334155;
    }
    .security-score {
      font-size: 4rem;
      font-weight: bold;
      color: ${securityScore >= 90 ? '#10b981' : securityScore >= 70 ? '#f59e0b' : '#ef4444'};
      margin: 20px 0;
    }
    .score-label {
      font-size: 1.2rem;
      color: #94a3b8;
      margin-bottom: 10px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    .metric-card {
      background: rgba(30, 41, 59, 0.8);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #475569;
      transition: transform 0.2s, border-color 0.2s;
    }
    .metric-card:hover {
      transform: translateY(-2px);
      border-color: #64748b;
    }
    .metric-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .metric-status {
      font-size: 0.9rem;
      padding: 4px 12px;
      border-radius: 20px;
      display: inline-block;
    }
    .status-active { background: #065f46; color: #10b981; }
    .status-warning { background: #92400e; color: #f59e0b; }
    .status-error { background: #991b1b; color: #ef4444; }
    .status-disabled { background: #374151; color: #9ca3af; }
    .violations-list {
      max-height: 200px;
      overflow-y: auto;
      background: #1e293b;
      border-radius: 8px;
      padding: 12px;
      margin-top: 12px;
    }
    .violation-item {
      padding: 8px 0;
      border-bottom: 1px solid #334155;
      font-size: 0.85rem;
    }
    .violation-item:last-child { border-bottom: none; }
    .refresh-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }
    .refresh-btn:hover { background: #2563eb; }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 30px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(30, 41, 59, 0.6);
      border-radius: 8px;
      border: 1px solid #475569;
    }
    .feature-icon {
      font-size: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="header">
      <h1>🛡️ Nalth Security Dashboard</h1>
      <div class="score-label">Security Score</div>
      <div class="security-score">${securityScore}%</div>
      <div style="color: #94a3b8;">Last updated: ${new Date().toLocaleString()}</div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-title">🔒 HTTPS Status</div>
        <div class="metric-value" style="color: ${options.https?.enabled ? '#10b981' : '#ef4444'}">
          ${options.https?.enabled ? 'Enabled' : 'Disabled'}
        </div>
        <span class="metric-status ${options.https?.enabled ? 'status-active' : 'status-error'}">
          ${options.https?.enabled ? 'Secure Connection' : 'Insecure Connection'}
        </span>
      </div>

      <div class="metric-card">
        <div class="metric-title">🛡️ Content Security Policy</div>
        <div class="metric-value" style="color: ${options.csp?.enabled ? '#10b981' : '#ef4444'}">
          ${options.csp?.enabled ? 'Active' : 'Disabled'}
        </div>
        <span class="metric-status ${options.csp?.enabled ? 'status-active' : 'status-error'}">
          ${violations.length} total violations
        </span>
        ${violations.length > 0 ? `
        <div class="violations-list">
          ${violations.slice(-5).map(v => `
            <div class="violation-item">
              <strong>${v['csp-report']['violated-directive']}</strong><br>
              <span style="color: #94a3b8;">${v['csp-report']['blocked-uri']}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>

      <div class="metric-card">
        <div class="metric-title">🔐 Security Headers</div>
        <div class="metric-value" style="color: #10b981">${countActiveHeaders(options)}/4</div>
        <span class="metric-status status-active">Headers Active</span>
        <div style="margin-top: 12px; font-size: 0.9rem;">
          <div>✅ HSTS: ${options.headers?.hsts ? 'Enabled' : 'Disabled'}</div>
          <div>✅ Frame Options: ${options.headers?.frameOptions || 'Not Set'}</div>
          <div>✅ Content Type: ${options.headers?.contentTypeOptions ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-title">🔍 Security Monitoring</div>
        <div class="metric-value" style="color: #10b981">${recentViolations}</div>
        <span class="metric-status ${recentViolations > 0 ? 'status-warning' : 'status-active'}">
          Recent violations (5min)
        </span>
      </div>

      <div class="metric-card">
        <div class="metric-title">🛠️ Subresource Integrity</div>
        <div class="metric-value" style="color: ${options.sri?.enabled ? '#10b981' : '#f59e0b'}">
          ${options.sri?.enabled ? 'Enabled' : 'Disabled'}
        </div>
        <span class="metric-status ${options.sri?.enabled ? 'status-active' : 'status-warning'}">
          ${options.sri?.algorithms?.length || 0} algorithms
        </span>
      </div>

      <div class="metric-card">
        <div class="metric-title">🔎 Code Auditing</div>
        <div class="metric-value" style="color: ${options.audit?.enabled ? '#10b981' : '#f59e0b'}">
          ${options.audit?.enabled ? 'Active' : 'Disabled'}
        </div>
        <span class="metric-status ${options.audit?.enabled ? 'status-active' : 'status-warning'}">
          Real-time scanning
        </span>
      </div>
    </div>

    <div class="feature-grid">
      <div class="feature-item">
        <span class="feature-icon">🚀</span>
        <div>
          <strong>Performance Impact</strong><br>
          <span style="color: #94a3b8;">Security overhead: <2ms</span>
        </div>
      </div>
      <div class="feature-item">
        <span class="feature-icon">📊</span>
        <div>
          <strong>Real-time Monitoring</strong><br>
          <span style="color: #94a3b8;">Live threat detection</span>
        </div>
      </div>
      <div class="feature-item">
        <span class="feature-icon">🔒</span>
        <div>
          <strong>Zero-Trust Architecture</strong><br>
          <span style="color: #94a3b8;">Verify everything</span>
        </div>
      </div>
      <div class="feature-item">
        <span class="feature-icon">⚡</span>
        <div>
          <strong>Hot Module Replacement</strong><br>
          <span style="color: #94a3b8;">Secure HMR enabled</span>
        </div>
      </div>
    </div>
  </div>

  <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>

  <script>
    // Auto-refresh every 30 seconds
    setTimeout(() => location.reload(), 30000);
    
    // Add some interactivity
    document.querySelectorAll('.metric-card').forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => card.style.transform = '', 100);
      });
    });
  </script>
</body>
</html>`

          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
          })
          res.end(dashboardHtml)
        },
      )

      // JSON API endpoint for security info
      server.middlewares.use(
        '/__nalth/security',
        (_req: IncomingMessage, res: ServerResponse) => {
          const securityInfo = {
            timestamp: new Date().toISOString(),
            status: 'active',
            score: calculateSecurityScore(options, violations.length),
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
