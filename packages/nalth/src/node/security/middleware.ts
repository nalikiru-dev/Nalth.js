import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import type { SecurityConfig, SecurityViolation } from '../types'
import { logSecurityViolation } from '../logger'
import colors from 'picocolors'

export function createSecurityMiddleware(config: SecurityConfig): any[] {
  const middlewares: any[] = []

  // Content Security Policy
  if (config.csp?.enabled) {
    middlewares.push(createCSPMiddleware(config.csp))
  }

  // Security Headers
  middlewares.push(helmet({
    contentSecurityPolicy: false, // We handle CSP separately
    hsts: config.headers?.hsts ? {
      maxAge: config.headers.hsts.maxAge || 31536000,
      includeSubDomains: config.headers.hsts.includeSubDomains !== false,
      preload: config.headers.hsts.preload !== false
    } : false,
    frameguard: config.headers?.frameOptions ? {
      action: config.headers.frameOptions as any
    } : { action: 'deny' },
    noSniff: config.headers?.contentTypeOptions !== false,
    referrerPolicy: {
      policy: config.headers?.referrerPolicy as any || 'strict-origin-when-cross-origin'
    }
  }))

  // Permissions Policy
  if (config.headers?.permissionsPolicy) {
    middlewares.push(createPermissionsPolicyMiddleware(config.headers.permissionsPolicy))
  }

  // Rate Limiting (only in production or when explicitly enabled)
  if (process.env.NODE_ENV === 'production' || config.level === 'strict') {
    middlewares.push(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false
    }))
  }

  // XSS Protection
  if (config.xss?.enabled) {
    middlewares.push(createXSSMiddleware(config.xss))
  }

  // CSRF Protection
  if (config.csrf?.enabled) {
    middlewares.push(createCSRFMiddleware(config.csrf))
  }

  // Security Analysis Middleware
  if (config.analysis?.enabled) {
    middlewares.push(createAnalysisMiddleware(config.analysis))
  }

  return middlewares
}

function createCSPMiddleware(cspConfig: NonNullable<SecurityConfig['csp']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!cspConfig.directives) {
      return next()
    }

    const directives = Object.entries(cspConfig.directives)
      .map(([directive, values]) => {
        const valueStr = Array.isArray(values) ? values.join(' ') : values
        return `${directive} ${valueStr}`
      })
      .join('; ')

    const headerName = cspConfig.reportOnly 
      ? 'Content-Security-Policy-Report-Only' 
      : 'Content-Security-Policy'
    
    let cspHeader = directives
    
    if (cspConfig.reportUri) {
      cspHeader += `; report-uri ${cspConfig.reportUri}`
    }

    res.setHeader(headerName, cspHeader)
    next()
  }
}

function createPermissionsPolicyMiddleware(permissionsPolicy: Record<string, string[]>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const policies = Object.entries(permissionsPolicy)
      .map(([directive, allowlist]) => {
        const allowlistStr = allowlist.length > 0 ? `(${allowlist.join(' ')})` : '()'
        return `${directive}=${allowlistStr}`
      })
      .join(', ')
    
    res.setHeader('Permissions-Policy', policies)
    next()
  }
}

function createXSSMiddleware(xssConfig: NonNullable<SecurityConfig['xss']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set XSS protection header
    res.setHeader('X-XSS-Protection', xssConfig.blockMode ? '1; mode=block' : '1')

    if (xssConfig.sanitizeInputs) {
      // Sanitize request inputs
      sanitizeObject(req.query)
      sanitizeObject(req.body)
      
      // Check for XSS patterns
      const violations = detectXSSPatterns(req)
      if (violations.length > 0) {
        violations.forEach(violation => {
          logSecurityViolation('xss', violation.severity, violation.message, {
            url: req.url,
            userAgent: req.headers['user-agent']
          })
        })
        
        if (xssConfig.blockMode) {
          res.status(400).json({
            error: 'Request blocked due to potential XSS attack',
            violations: violations.map(v => v.message)
          })
          return
        }
      }
    }

    next()
  }
}

function createCSRFMiddleware(csrfConfig: NonNullable<SecurityConfig['csrf']>) {
  const crypto = require('node:crypto')
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next()
    }

    const token = req.headers['x-csrf-token'] || 
                  req.body?.[csrfConfig.tokenName!] || 
                  req.query[csrfConfig.tokenName!]

    const sessionToken = req.session?.csrfToken

    if (!token || !sessionToken || token !== sessionToken) {
      logSecurityViolation('csrf', 'high', 'CSRF token validation failed', {
        url: req.url,
        method: req.method,
        userAgent: req.headers['user-agent']
      })
      
      res.status(403).json({
        error: 'CSRF token validation failed'
      })
      return
    }

    next()
  }
}

function createAnalysisMiddleware(analysisConfig: NonNullable<SecurityConfig['analysis']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const violations: SecurityViolation[] = []
    
    // Analyze request for suspicious patterns
    const content = JSON.stringify({
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body
    })

    for (const pattern of analysisConfig.patterns || []) {
      const regex = new RegExp(pattern, 'gi')
      const matches = content.match(regex)
      
      if (matches) {
        violations.push({
          type: 'analysis',
          severity: 'medium',
          message: `Suspicious pattern detected: ${pattern}`,
          rule: pattern,
          timestamp: Date.now()
        })
      }
    }

    if (violations.length > 0) {
      violations.forEach(violation => {
        logSecurityViolation(violation.type, violation.severity, violation.message, {
          url: req.url,
          pattern: violation.rule
        })
      })

      if (analysisConfig.failOnViolations) {
        res.status(400).json({
          error: 'Request blocked due to security analysis violations',
          violations: violations.map(v => v.message)
        })
        return
      }
    }

    // Store violations in request for reporting
    ;(req as any).securityViolations = violations

    next()
  }
}

function sanitizeObject(obj: any): void {
  if (!obj || typeof obj !== 'object') return

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeString(obj[key])
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key])
    }
  }
}

function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

function detectXSSPatterns(req: Request): SecurityViolation[] {
  const violations: SecurityViolation[] = []
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi
  ]

  const content = JSON.stringify({
    url: req.url,
    query: req.query,
    body: req.body,
    headers: req.headers
  })

  for (const pattern of xssPatterns) {
    if (pattern.test(content)) {
      violations.push({
        type: 'xss',
        severity: 'high',
        message: `Potential XSS attack detected: ${pattern.source}`,
        rule: pattern.source,
        timestamp: Date.now()
      })
    }
  }

  return violations
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      securityViolations?: SecurityViolation[]
      session?: {
        csrfToken?: string
        [key: string]: any
      }
    }
  }
}
