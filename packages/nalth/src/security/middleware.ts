import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import chalk from 'chalk'
import crypto from 'crypto'

export interface SecurityConfig {
  csp?: {
    enabled: boolean
    directives?: Record<string, string[]>
    reportOnly?: boolean
  }
  rateLimit?: {
    windowMs: number
    max: number
    message?: string
  }
  hsts?: {
    maxAge: number
    includeSubDomains: boolean
    preload: boolean
  }
  audit?: {
    enabled: boolean
    logViolations: boolean
    format?: 'json' | 'text'
  }
  csrf?: {
    enabled: boolean
    cookieName?: string
  }
  hpp?: {
    enabled: boolean
    whitelist?: string[]
  }
}

const defaultSecurityConfig: SecurityConfig = {
  csp: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"], // TODO: Move to nonce-based in future
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'ws:', 'wss:'],
      'font-src': ["'self'", 'https:', 'data:'],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    },
    reportOnly: false
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  audit: {
    enabled: true,
    logViolations: true,
    format: 'json'
  },
  csrf: {
    enabled: true,
    cookieName: 'XSRF-TOKEN'
  },
  hpp: {
    enabled: true
  }
}

/**
 * Create enterprise-grade security middleware stack for Nalth applications
 */
export function createSecurityMiddleware(config: Partial<SecurityConfig> = {}): any[] {
  const finalConfig = { ...defaultSecurityConfig, ...config }
  const middlewares: any[] = []

  // 1. Basic Security Headers (Helmet)
  middlewares.push(helmet({
    contentSecurityPolicy: finalConfig.csp?.enabled ? {
      directives: finalConfig.csp.directives,
      reportOnly: finalConfig.csp.reportOnly
    } : false,
    hsts: finalConfig.hsts ? {
      maxAge: finalConfig.hsts.maxAge,
      includeSubDomains: finalConfig.hsts.includeSubDomains,
      preload: finalConfig.hsts.preload
    } : false,
    crossOriginEmbedderPolicy: false, // Allow for development flexibility
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }))

  // 2. Rate Limiting
  if (finalConfig.rateLimit) {
    middlewares.push(rateLimit({
      windowMs: finalConfig.rateLimit.windowMs,
      max: finalConfig.rateLimit.max,
      message: finalConfig.rateLimit.message,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => req.ip || 'unknown' // Ensure IP availability
    }))
  }

  // 3. HTTP Parameter Pollution (HPP) Protection
  if (finalConfig.hpp?.enabled) {
    middlewares.push(hppMiddleware(finalConfig.hpp.whitelist))
  }

  // 4. CSRF Protection (Double Submit Cookie Pattern)
  if (finalConfig.csrf?.enabled) {
    middlewares.push(csrfMiddleware(finalConfig.csrf.cookieName))
  }

  // 5. Security Audit & Monitoring
  if (finalConfig.audit?.enabled) {
    middlewares.push(securityAuditMiddleware(finalConfig.audit.logViolations, finalConfig.audit.format))
  }

  return middlewares
}

/**
 * HTTP Parameter Pollution Middleware
 * Prevents multiple parameters with the same name to avoid pollution attacks
 */
function hppMiddleware(whitelist: string[] = []) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.query) {
      for (const key in req.query) {
        if (Array.isArray(req.query[key]) && !whitelist.includes(key)) {
          // Take the last value (standard Express behavior usually takes first or array, we enforce last for safety)
          req.query[key] = (req.query[key] as any[]).pop()
        }
      }
    }
    next()
  }
}

/**
 * CSRF Protection Middleware (Double Submit Cookie)
 */
function csrfMiddleware(cookieName: string = 'XSRF-TOKEN') {
  return (req: Request, res: Response, next: NextFunction) => {
    // Generate token if not present
    if (!req.cookies?.[cookieName]) {
      const token = crypto.randomBytes(32).toString('hex')
      res.cookie(cookieName, token, {
        httpOnly: false, // Accessible to JS for including in headers
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
    }

    // Verify token on state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const headerToken = req.headers['x-xsrf-token'] || req.headers['x-csrf-token']
      const cookieToken = req.cookies?.[cookieName]

      if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        return res.status(403).json({
          error: 'CSRF Token Validation Failed',
          code: 'CSRF_ERROR'
        })
      }
    }
    next()
  }
}

/**
 * Enterprise Security Audit Middleware
 * Detects and logs potential security anomalies
 */
function securityAuditMiddleware(logViolations: boolean = true, format: 'json' | 'text' = 'json'): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction) => {
    const violations: Array<{ type: string, source: string, detail: string }> = []

    // Targeted Pattern Matching (Avoid generic "AI slop" regexes)
    const checks = [
      { pattern: /<script\b[^>]*>([\s\S]*?)<\/script>/gim, type: 'XSS', desc: 'Script tag detected' },
      { pattern: /javascript:/gim, type: 'XSS', desc: 'JavaScript pseudo-protocol detected' },
      { pattern: /on\w+\s*=/gim, type: 'XSS', desc: 'Event handler injection detected' },
      { pattern: /(\%27)|(\')|(--)|(\%23)|(#)/i, type: 'SQLi', desc: 'Potential SQL Injection characters' }, // Basic SQLi check
      { pattern: /\.\.\//g, type: 'PathTraversal', desc: 'Directory traversal attempt' }
    ]

    const scan = (content: string, source: string) => {
      if (!content) return
      checks.forEach(check => {
        if (check.pattern.test(content)) {
          violations.push({
            type: check.type,
            source,
            detail: check.desc
          })
        }
      })
    }

    // Scan Query Params
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') scan(value, `query:${key}`)
    })

    // Scan Body (if parsed)
    if (req.body && typeof req.body === 'object') {
      const scanObj = (obj: any, prefix: string) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'string') scan(value, `${prefix}.${key}`)
          else if (typeof value === 'object' && value !== null) scanObj(value, `${prefix}.${key}`)
        })
      }
      scanObj(req.body, 'body')
    }

    if (violations.length > 0) {
      req.securityViolations = violations.map(v => `${v.type}: ${v.detail} in ${v.source}`)

      if (logViolations) {
        if (format === 'json') {
          console.warn(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'WARN',
            event: 'SECURITY_VIOLATION',
            ip: req.ip,
            method: req.method,
            path: req.path,
            violations
          }))
        } else {
          console.warn(chalk.yellow('⚠ Security Alert:'))
          violations.forEach(v => console.warn(chalk.red(`  [${v.type}] ${v.detail} (${v.source})`)))
        }
      }
    }

    next()
  }
}

/**
 * HTTPS redirect middleware
 */
export function httpsRedirectMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.header('x-forwarded-proto') !== 'https' && req.secure !== true && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.header('host')}${req.url}`)
  }
  next()
}

/**
 * Additional Security Headers
 */
export function additionalSecurityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  next()
}

// Extend Express Request interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      securityViolations?: string[]
    }
  }
}
