import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import chalk from 'chalk'

export interface SecurityConfig {
  csp?: {
    enabled: boolean
    directives?: Record<string, string[]>
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
  }
}

const defaultSecurityConfig: SecurityConfig = {
  csp: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'ws:', 'wss:'],
      'font-src': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'none'"]
    }
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
    logViolations: true
  }
}

/**
 * Create security middleware stack for Nalth applications
 */
export function createSecurityMiddleware(config: Partial<SecurityConfig> = {}): any[] {
  const finalConfig = { ...defaultSecurityConfig, ...config }
  const middlewares: any[] = []

  // Basic security headers with Helmet
  middlewares.push(helmet({
    contentSecurityPolicy: finalConfig.csp?.enabled ? {
      directives: finalConfig.csp.directives
    } : false,
    hsts: finalConfig.hsts ? {
      maxAge: finalConfig.hsts.maxAge,
      includeSubDomains: finalConfig.hsts.includeSubDomains,
      preload: finalConfig.hsts.preload
    } : false,
    crossOriginEmbedderPolicy: false // Allow for development
  }))

  // Rate limiting
  if (finalConfig.rateLimit) {
    middlewares.push(rateLimit({
      windowMs: finalConfig.rateLimit.windowMs,
      max: finalConfig.rateLimit.max,
      message: finalConfig.rateLimit.message,
      standardHeaders: true,
      legacyHeaders: false
    }))
  }

  // Security audit middleware
  if (finalConfig.audit?.enabled) {
    middlewares.push(securityAuditMiddleware(finalConfig.audit.logViolations))
  }

  return middlewares
}

/**
 * Security audit middleware to detect potential vulnerabilities
 */
function securityAuditMiddleware(logViolations: boolean = true): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction) => {
    const violations: string[] = []

    // Check for suspicious patterns in request
    const suspiciousPatterns = [
      /script.*src.*javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\.write/i,
      /innerHTML\s*=/i,
      /<script/i,
      /javascript:/i
    ]

    const checkContent = (content: string, source: string) => {
      suspiciousPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          violations.push(`Suspicious pattern detected in ${source}: ${pattern}`)
        }
      })
    }

    // Check URL parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        checkContent(value, `query parameter '${key}'`)
      }
    })

    // Check request body
    if (req.body && typeof req.body === 'object') {
      Object.entries(req.body).forEach(([key, value]) => {
        if (typeof value === 'string') {
          checkContent(value, `body parameter '${key}'`)
        }
      })
    }

    // Check headers for suspicious content
    Object.entries(req.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        checkContent(value, `header '${key}'`)
      }
    })

    if (violations.length > 0 && logViolations) {
      console.log(chalk.yellow('⚠ Security violations detected:'))
      violations.forEach(violation => {
        console.log(chalk.red(`  - ${violation}`))
      })
    }

    // Add violations to request for potential blocking
    req.securityViolations = violations

    next()
  }
}

/**
 * HTTPS redirect middleware
 */
export function httpsRedirectMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.header('x-forwarded-proto') !== 'https' && req.secure !== true) {
    return res.redirect(301, `https://${req.header('host')}${req.url}`)
  }
  next()
}

/**
 * Security headers middleware for additional protection
 */
export function additionalSecurityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
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
