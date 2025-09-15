import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'dep-types/connect'

export interface SecurityConfig {
  /** Enable HTTPS by default */
  https: {
    enabled: boolean
    cert?: string
    key?: string
    /** Auto-generate self-signed certificates for development */
    autoGenerate?: boolean
  }
  /** Content Security Policy configuration */
  csp: {
    enabled: boolean
    directives: Record<string, string | string[]>
    reportOnly?: boolean
    reportUri?: string
  }
  /** Security headers configuration */
  headers: {
    /** Strict Transport Security */
    hsts?: {
      maxAge: number
      includeSubDomains?: boolean
      preload?: boolean
    }
    /** X-Frame-Options */
    frameOptions?: 'DENY' | 'SAMEORIGIN' | string
    /** X-Content-Type-Options */
    contentTypeOptions?: boolean
    /** Referrer-Policy */
    referrerPolicy?: string
    /** Permissions-Policy */
    permissionsPolicy?: Record<string, string[]>
  }
  /** Subresource Integrity */
  sri: {
    enabled: boolean
    /** Hash algorithms to use */
    algorithms: ('sha256' | 'sha384' | 'sha512')[]
    /** Include inline scripts/styles */
    includeInline?: boolean
  }
  /** Security auditing */
  audit: {
    enabled: boolean
    /** Patterns to flag as potentially unsafe */
    unsafePatterns: string[]
    /** Fail build on security violations */
    failOnViolations?: boolean
  }
}

export const defaultSecurityConfig: SecurityConfig = {
  https: {
    enabled: true,
    autoGenerate: true
  },
  csp: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'https:'],
      'connect-src': ["'self'", 'ws:', 'wss:'],
      'media-src': ["'self'"],
      'object-src': ["'none'"],
      'child-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'manifest-src': ["'self'"]
    }
  },
  headers: {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    frameOptions: 'DENY',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
      usb: [],
      magnetometer: [],
      gyroscope: [],
      accelerometer: []
    }
  },
  sri: {
    enabled: true,
    algorithms: ['sha384'],
    includeInline: false
  },
  audit: {
    enabled: true,
    unsafePatterns: [
      'eval\\(',
      'Function\\(',
      'setTimeout\\([\'"`]',
      'setInterval\\([\'"`]',
      'innerHTML\\s*=',
      'outerHTML\\s*=',
      'document\\.write\\(',
      'document\\.writeln\\(',
      'execScript\\(',
      '\\.postMessage\\(',
      'window\\.open\\(',
      'location\\.href\\s*=',
      'location\\.replace\\(',
      'location\\.assign\\('
    ],
    failOnViolations: false
  }
}

/**
 * Create security middleware for Connect/Express
 */
export function createSecurityMiddleware(config: Partial<SecurityConfig> = {}): Connect.NextHandleFunction {
  const securityConfig = { ...defaultSecurityConfig, ...config }

  return (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
    // Set security headers
    if (securityConfig.headers.hsts && req.headers['x-forwarded-proto'] === 'https') {
      const { maxAge, includeSubDomains, preload } = securityConfig.headers.hsts
      let hstsValue = `max-age=${maxAge}`
      if (includeSubDomains) hstsValue += '; includeSubDomains'
      if (preload) hstsValue += '; preload'
      res.setHeader('Strict-Transport-Security', hstsValue)
    }

    if (securityConfig.headers.frameOptions) {
      res.setHeader('X-Frame-Options', securityConfig.headers.frameOptions)
    }

    if (securityConfig.headers.contentTypeOptions) {
      res.setHeader('X-Content-Type-Options', 'nosniff')
    }

    if (securityConfig.headers.referrerPolicy) {
      res.setHeader('Referrer-Policy', securityConfig.headers.referrerPolicy)
    }

    if (securityConfig.headers.permissionsPolicy) {
      const policies = Object.entries(securityConfig.headers.permissionsPolicy)
        .map(([directive, allowlist]) => {
          const allowlistStr = allowlist.length > 0 ? `(${allowlist.join(' ')})` : '()'
          return `${directive}=${allowlistStr}`
        })
        .join(', ')
      res.setHeader('Permissions-Policy', policies)
    }

    // Set CSP header
    if (securityConfig.csp.enabled) {
      const cspDirectives = Object.entries(securityConfig.csp.directives)
        .map(([directive, values]) => {
          const valueStr = Array.isArray(values) ? values.join(' ') : values
          return `${directive} ${valueStr}`
        })
        .join('; ')

      const headerName = securityConfig.csp.reportOnly 
        ? 'Content-Security-Policy-Report-Only' 
        : 'Content-Security-Policy'
      
      res.setHeader(headerName, cspDirectives)
    }

    next()
  }
}

/**
 * Generate SRI hash for content
 */
export function generateSRIHash(content: string, algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha384'): string {
  const crypto = require('node:crypto')
  const hash = crypto.createHash(algorithm).update(content, 'utf8').digest('base64')
  return `${algorithm}-${hash}`
}

/**
 * Audit code for security violations
 */
export function auditCode(code: string, patterns: string[]): { violations: string[], safe: boolean } {
  const violations: string[] = []
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern, 'gi')
    const matches = regex.exec(code)
    if (matches) {
      violations.push(...matches)
    }
  }

  return {
    violations: [...new Set(violations)], 
    safe: violations.length === 0
  }
}
