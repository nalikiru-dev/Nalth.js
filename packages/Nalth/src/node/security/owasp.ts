import { createHash, randomBytes } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export interface OWASPSecurityConfig {
  csp: {
    enabled: boolean
    nonce: boolean
    strictDynamic: boolean
    reportUri?: string
  }
  xss: {
    enabled: boolean
    sanitizeInputs: boolean
    validateOutputs: boolean
  }
  csrf: {
    enabled: boolean
    tokenLength: number
    sameSite: 'strict' | 'lax' | 'none'
  }
  headers: {
    hsts: boolean
    frameOptions: 'DENY' | 'SAMEORIGIN'
    contentTypeOptions: boolean
    referrerPolicy: string
    permissionsPolicy: string[]
  }
  dependencies: {
    auditOnInstall: boolean
    blockVulnerable: boolean
    allowedLicenses: string[]
  }
}

export class OWASPSecurity {
  private config: OWASPSecurityConfig
  private nonces: Map<string, string> = new Map()

  constructor(config: OWASPSecurityConfig) {
    this.config = config
  }

  // A01:2021 – Broken Access Control
  generateCSRFToken(): string {
    const token = randomBytes(this.config.csrf.tokenLength).toString('hex')
    return token
  }

  // A02:2021 – Cryptographic Failures
  generateSecureNonce(): string {
    const nonce = randomBytes(16).toString('base64')
    return nonce
  }

  // A03:2021 – Injection (XSS Prevention)
  sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // A04:2021 – Insecure Design (CSP Generation)
  generateCSP(options: { nonce?: string; allowInline?: boolean }): string {
    const { nonce, allowInline = false } = options
    
    let csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "font-src 'self' https: data:",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https:",
      "object-src 'none'",
      "script-src-attr 'none'",
      "style-src 'self' https: 'unsafe-inline'",
      "upgrade-insecure-requests"
    ]

    if (nonce) {
      csp.push(`script-src 'self' 'nonce-${nonce}'`)
    } else if (allowInline) {
      csp.push("script-src 'self' 'unsafe-inline'")
    } else {
      csp.push("script-src 'self'")
    }

    if (this.config.csp.strictDynamic && nonce) {
      csp = csp.map(directive => 
        directive.startsWith('script-src') 
          ? `${directive} 'strict-dynamic'`
          : directive
      )
    }

    return csp.join('; ')
  }

  // A05:2021 – Security Misconfiguration (Security Headers)
  generateSecurityHeaders(nonce?: string): Record<string, string> {
    const headers: Record<string, string> = {}

    if (this.config.headers.hsts) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    }

    headers['X-Frame-Options'] = this.config.headers.frameOptions
    
    if (this.config.headers.contentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff'
    }

    headers['Referrer-Policy'] = this.config.headers.referrerPolicy
    headers['X-XSS-Protection'] = '1; mode=block'
    
    if (this.config.headers.permissionsPolicy.length > 0) {
      headers['Permissions-Policy'] = this.config.headers.permissionsPolicy.join(', ')
    }

    if (this.config.csp.enabled) {
      headers['Content-Security-Policy'] = this.generateCSP({ nonce })
    }

    return headers
  }

  // A06:2021 – Vulnerable and Outdated Components
  async auditDependencies(packageJsonPath: string): Promise<{
    vulnerabilities: Array<{
      package: string
      severity: 'low' | 'moderate' | 'high' | 'critical'
      description: string
      recommendation: string
    }>
    blocked: string[]
  }> {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
    
    const vulnerabilities = []
    const blocked = []

    // Known vulnerable patterns (simplified for demo)
    const vulnerablePatterns = [
      { pattern: /^lodash@[0-3]\./, severity: 'high' as const, desc: 'Prototype pollution vulnerability' },
      { pattern: /^express@[0-3]\./, severity: 'critical' as const, desc: 'Multiple security vulnerabilities' },
      { pattern: /^jquery@[0-2]\./, severity: 'high' as const, desc: 'XSS vulnerabilities' }
    ]

    for (const [pkg, version] of Object.entries(dependencies)) {
      const fullPkg = `${pkg}@${version}`
      
      for (const vuln of vulnerablePatterns) {
        if (vuln.pattern.test(fullPkg)) {
          vulnerabilities.push({
            package: fullPkg,
            severity: vuln.severity,
            description: vuln.desc,
            recommendation: `Update to latest version of ${pkg}`
          })
          
          if (this.config.dependencies.blockVulnerable && vuln.severity === 'critical') {
            blocked.push(fullPkg)
          }
        }
      }
    }

    return { vulnerabilities, blocked }
  }

  // A07:2021 – Identification and Authentication Failures
  generateSecureSessionConfig() {
    return {
      name: 'sessionId',
      secret: randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: this.config.csrf.sameSite
      }
    }
  }

  // A08:2021 – Software and Data Integrity Failures (SRI)
  generateSRIHash(content: string): string {
    const hash = createHash('sha384').update(content).digest('base64')
    return `sha384-${hash}`
  }

  // A09:2021 – Security Logging and Monitoring Failures
  createSecurityLogger() {
    return {
      logSecurityEvent: (event: string, details: any, severity: 'info' | 'warn' | 'error' | 'critical') => {
        const timestamp = new Date().toISOString()
        const logEntry = {
          timestamp,
          event,
          severity,
          details,
          userAgent: details.userAgent || 'unknown',
          ip: details.ip || 'unknown'
        }
        
        console.log(`[SECURITY-${severity.toUpperCase()}]`, JSON.stringify(logEntry))
        
        // In production, send to security monitoring service
        if (severity === 'critical') {
          this.alertSecurityTeam(logEntry)
        }
      }
    }
  }

  // A10:2021 – Server-Side Request Forgery (SSRF)
  validateURL(url: string, allowedDomains: string[] = []): boolean {
    try {
      const parsed = new URL(url)
      
      // Block private IP ranges
      const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^127\./,
        /^169\.254\./,
        /^::1$/,
        /^fc00:/,
        /^fe80:/
      ]
      
      for (const range of privateRanges) {
        if (range.test(parsed.hostname)) {
          return false
        }
      }
      
      // Check allowed domains if specified
      if (allowedDomains.length > 0) {
        return allowedDomains.some(domain => 
          parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
        )
      }
      
      return true
    } catch {
      return false
    }
  }

  private alertSecurityTeam(logEntry: any) {
    // Placeholder for security team alerting
    console.error('🚨 CRITICAL SECURITY EVENT:', logEntry)
  }
}

export const defaultOWASPConfig: OWASPSecurityConfig = {
  csp: {
    enabled: true,
    nonce: true,
    strictDynamic: true,
    reportUri: '/api/csp-report'
  },
  xss: {
    enabled: true,
    sanitizeInputs: true,
    validateOutputs: true
  },
  csrf: {
    enabled: true,
    tokenLength: 32,
    sameSite: 'strict'
  },
  headers: {
    hsts: true,
    frameOptions: 'DENY',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()'
    ]
  },
  dependencies: {
    auditOnInstall: true,
    blockVulnerable: true,
    allowedLicenses: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC']
  }
}
