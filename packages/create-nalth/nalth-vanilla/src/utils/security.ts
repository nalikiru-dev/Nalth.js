/**
 * Security utilities for Nalth Vanilla TypeScript template
 */

export class SafeHTMLRenderer {
  private allowedTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'button', 'section', 'header', 'footer', 'code', 'br']
  private allowedAttributes = ['class', 'id', 'href', 'src', 'alt', 'target', 'rel', 'style']

  sanitize(html: string): string {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
  }

  escapeHTML(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  isValidURL(url: string): boolean {
    try {
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }
}

export class SecurityLogger {
  private static instance: SecurityLogger
  private events: Array<{
    timestamp: Date
    level: 'info' | 'warn' | 'error'
    message: string
    data?: any
  }> = []

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger()
    }
    return SecurityLogger.instance
  }

  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const event = {
      timestamp: new Date(),
      level,
      message,
      data
    }
    
    this.events.push(event)
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events.shift()
    }

    // Also log to console with appropriate level
    console[level](`[Nalth Security] ${message}`, data || '')
  }

  getEvents() {
    return [...this.events]
  }

  clearEvents() {
    this.events = []
  }
}

export class CSPValidator {
  private violations: Array<{
    directive: string
    violatedDirective: string
    blockedURI: string
    timestamp: Date
  }> = []

  constructor() {
    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (e) => {
      this.handleViolation(e as SecurityPolicyViolationEvent)
    })
  }

  private handleViolation(event: SecurityPolicyViolationEvent) {
    const violation = {
      directive: event.effectiveDirective,
      violatedDirective: event.violatedDirective,
      blockedURI: event.blockedURI,
      timestamp: new Date()
    }

    this.violations.push(violation)
    SecurityLogger.getInstance().log('warn', 'CSP Violation detected', violation)
  }

  getViolations() {
    return [...this.violations]
  }

  getViolationCount(): number {
    return this.violations.length
  }
}

export function generateSecureId(): string {
  return crypto.randomUUID()
}

export function secureEventHandler<T extends Event>(
  handler: (event: T) => void,
  options: { preventDefault?: boolean; stopPropagation?: boolean } = {}
) {
  return (event: T) => {
    if (options.preventDefault) {
      event.preventDefault()
    }
    if (options.stopPropagation) {
      event.stopPropagation()
    }
    
    try {
      handler(event)
    } catch (error) {
      SecurityLogger.getInstance().log('error', 'Event handler error', error)
    }
  }
}