/**
 * Nalth Client Security Module
 * 
 * Client-side security utilities for XSS prevention, input sanitization,
 * and secure DOM manipulation.
 */

// Note: DOMPurify should be imported by the user's app, we provide the wrapper
// This allows for tree-shaking if not used

export interface SanitizeOptions {
    /** Allow specific HTML tags */
    ALLOWED_TAGS?: string[]
    /** Allow specific attributes */
    ALLOWED_ATTR?: string[]
    /** Allow data URIs */
    ALLOW_DATA_ATTR?: boolean
    /** Keep content from removed elements */
    KEEP_CONTENT?: boolean
    /** Return DOM node instead of string */
    RETURN_DOM?: boolean
    /** Allow self-closing tags */
    ALLOW_SELF_CLOSE_IN_ATTR?: boolean
}

/**
 * Escape HTML entities to prevent XSS
 * Safe for use in text content
 */
export function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

/**
 * Escape string for use in HTML attributes
 */
export function escapeAttribute(unsafe: string): string {
    return escapeHtml(unsafe)
        .replace(/\//g, '&#x2F;')
        .replace(/`/g, '&#x60;')
        .replace(/=/g, '&#x3D;')
}

/**
 * Sanitize URL to prevent javascript: and data: attacks
 */
export function sanitizeUrl(url: string): string {
    const trimmed = url.trim().toLowerCase()

    // Block dangerous protocols
    if (
        trimmed.startsWith('javascript:') ||
        trimmed.startsWith('vbscript:') ||
        trimmed.startsWith('data:text/html')
    ) {
        return 'about:blank'
    }

    return url
}

/**
 * Create a safe HTML element with escaped content
 */
export function createSafeElement(
    tagName: string,
    textContent: string,
    attributes?: Record<string, string>
): HTMLElement {
    const el = document.createElement(tagName)
    el.textContent = textContent // textContent is XSS-safe

    if (attributes) {
        const safeAttrs = ['id', 'class', 'title', 'aria-label', 'data-*', 'role']
        for (const [key, value] of Object.entries(attributes)) {
            // Only allow safe attributes
            if (safeAttrs.some(safe => key === safe || (safe.endsWith('*') && key.startsWith(safe.slice(0, -1))))) {
                el.setAttribute(key, escapeAttribute(value))
            }
        }
    }

    return el
}

/**
 * Safely set innerHTML using DOMPurify (if available)
 * Falls back to textContent if DOMPurify is not loaded
 */
export function safeSetHtml(
    element: HTMLElement,
    html: string,
    options?: SanitizeOptions
): void {
    // Check if DOMPurify is available globally
    const DOMPurify = (globalThis as any).DOMPurify

    if (DOMPurify && typeof DOMPurify.sanitize === 'function') {
        element.innerHTML = DOMPurify.sanitize(html, options)
    } else {
        // Fallback: strip all HTML and use textContent
        console.warn('[Nalth Security] DOMPurify not loaded, falling back to text-only rendering')
        const temp = document.createElement('div')
        temp.innerHTML = html
        element.textContent = temp.textContent || ''
    }
}

/**
 * Validate and sanitize JSON input
 * Prevents prototype pollution
 */
export function safeParseJson<T = unknown>(json: string): T | null {
    try {
        const parsed = JSON.parse(json)

        // Prevent prototype pollution
        if (typeof parsed === 'object' && parsed !== null) {
            const dangerous = ['__proto__', 'constructor', 'prototype']
            const hasDangerous = (obj: any): boolean => {
                if (typeof obj !== 'object' || obj === null) return false
                for (const key of Object.keys(obj)) {
                    if (dangerous.includes(key)) return true
                    if (hasDangerous(obj[key])) return true
                }
                return false
            }

            if (hasDangerous(parsed)) {
                console.error('[Nalth Security] Potential prototype pollution detected in JSON')
                return null
            }
        }

        return parsed as T
    } catch {
        return null
    }
}

/**
 * Content Security Policy violation reporter
 */
export function setupCSPReporter(endpoint?: string): void {
    document.addEventListener('securitypolicyviolation', (e) => {
        const violation = {
            blockedUri: e.blockedURI,
            directive: e.violatedDirective,
            policy: e.originalPolicy,
            sourceFile: e.sourceFile,
            lineNumber: e.lineNumber,
            timestamp: new Date().toISOString()
        }

        console.warn('[Nalth CSP Violation]', violation)

        if (endpoint) {
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(violation)
            }).catch(() => {
                // Silently fail - don't break the app for reporting
            })
        }
    })
}

/**
 * Nonce generator for inline scripts (use with CSP)
 */
export function generateNonce(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
}
