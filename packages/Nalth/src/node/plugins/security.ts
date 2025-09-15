import { createHash } from 'node:crypto'
import type { Plugin } from '../plugin'
import type { SecurityConfig } from '../security.config'
import { auditCode, defaultSecurityConfig } from '../security.config'
import colors from 'picocolors'

export interface SecurityPluginOptions extends Partial<SecurityConfig> {}

/**
 * Nalth Security Plugin - Provides SRI, security auditing, and secure build features
 */
export function securityPlugin(options: SecurityPluginOptions = {}): Plugin {
  const config = { ...defaultSecurityConfig, ...options }
  const sriHashes = new Map<string, string>()
  const securityViolations: Array<{ file: string; violations: string[] }> = []

  return {
    name: 'nalth:security',
    configResolved(resolvedConfig) {
      if (resolvedConfig.command === 'build' && config.audit.enabled) {
        resolvedConfig.logger.info(colors.cyan('🛡️  Nalth Security: Enabled security auditing'))
      }
    },

    transform(code, id) {
      // Security audit during transform
      if (config.audit.enabled) {
        const { violations, safe } = auditCode(code, config.audit.unsafePatterns)
        
        if (!safe) {
          securityViolations.push({ file: id, violations })
          
          const message = `Security violations found in ${id}:\n${violations.map(v => `  - ${v}`).join('\n')}`
          
          if (config.audit.failOnViolations) {
            this.error(message)
          } else {
            this.warn(message)
          }
        }
      }

      return null
    },

    generateBundle(options, bundle) {
      if (!config.sri.enabled) return

      // Generate SRI hashes for all assets
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' || chunk.type === 'asset') {
          const content = chunk.type === 'chunk' ? chunk.code : chunk.source
          const contentStr = typeof content === 'string' ? content : content.toString()
          
          for (const algorithm of config.sri.algorithms) {
            const hash = createHash(algorithm).update(contentStr, 'utf8').digest('base64')
            const integrity = `${algorithm}-${hash}`
            sriHashes.set(fileName, integrity)
          }
        }
      }
    },

    transformIndexHtml: {
      order: 'post',
      handler(html: string, _context: any) {
        if (!config.sri.enabled) return html

        // Add SRI attributes to script and link tags
        let transformedHtml = html

        // Add SRI to script tags
        transformedHtml = transformedHtml.replace(
          /<script([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/g,
          (match, before, src, after) => {
            const fileName = src.split('/').pop()
            const integrity = sriHashes.get(fileName)
            if (integrity) {
              return `<script${before} src="${src}"${after} integrity="${integrity}" crossorigin="anonymous">`
            }
            return match
          }
        )

        // Add SRI to link tags (CSS)
        transformedHtml = transformedHtml.replace(
          /<link([^>]*)\shref=["']([^"']+)["']([^>]*)\srel=["']stylesheet["']([^>]*)>/g,
          (match, before, href, middle, after) => {
            const fileName = href.split('/').pop()
            const integrity = sriHashes.get(fileName)
            if (integrity) {
              return `<link${before} href="${href}"${middle} rel="stylesheet"${after} integrity="${integrity}" crossorigin="anonymous">`
            }
            return match
          }
        )

        return transformedHtml
      }
    },

    buildEnd() {
      // Report security audit results
      if (config.audit.enabled && securityViolations.length > 0) {
        this.warn(colors.yellow(`🛡️  Security Audit Summary: ${securityViolations.length} files with violations`))
        
        if (this.meta.watchMode) {
          // In watch mode, just warn
          securityViolations.forEach(({ file, violations }) => {
            this.warn(`${file}: ${violations.length} violations`)
          })
        }
      }

      // Report SRI generation
      if (config.sri.enabled && sriHashes.size > 0) {
        this.meta.framework && console.log(colors.green(`🛡️  Generated SRI hashes for ${sriHashes.size} assets`))
      }
    },

  }
}

/**
 * Security middleware plugin for development server
 */
export function securityMiddlewarePlugin(options: SecurityPluginOptions = {}): Plugin {
  const config = { ...defaultSecurityConfig, ...options }

  return {
    name: 'nalth:security-middleware',
    configureServer(server) {
      // Add security middleware early in the stack
      server.middlewares.use((req, res, next) => {
        // Set security headers
        if (config.headers.hsts && req.headers['x-forwarded-proto'] === 'https') {
          const { maxAge, includeSubDomains, preload } = config.headers.hsts
          let hstsValue = `max-age=${maxAge}`
          if (includeSubDomains) hstsValue += '; includeSubDomains'
          if (preload) hstsValue += '; preload'
          res.setHeader('Strict-Transport-Security', hstsValue)
        }

        if (config.headers.frameOptions) {
          res.setHeader('X-Frame-Options', config.headers.frameOptions)
        }

        if (config.headers.contentTypeOptions) {
          res.setHeader('X-Content-Type-Options', 'nosniff')
        }

        if (config.headers.referrerPolicy) {
          res.setHeader('Referrer-Policy', config.headers.referrerPolicy)
        }

        if (config.headers.permissionsPolicy) {
          const policies = Object.entries(config.headers.permissionsPolicy)
            .map(([directive, allowlist]) => {
              const allowlistStr = allowlist.length > 0 ? `(${allowlist.join(' ')})` : '()'
              return `${directive}=${allowlistStr}`
            })
            .join(', ')
          res.setHeader('Permissions-Policy', policies)
        }

        // Set CSP header
        if (config.csp.enabled) {
          const cspDirectives = Object.entries(config.csp.directives)
            .map(([directive, values]) => {
              const valueStr = Array.isArray(values) ? values.join(' ') : values
              return `${directive} ${valueStr}`
            })
            .join('; ')

          const headerName = config.csp.reportOnly 
            ? 'Content-Security-Policy-Report-Only' 
            : 'Content-Security-Policy'
          
          res.setHeader(headerName, cspDirectives)
        }

        next()
      })
    }
  }
}
