import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Secure HTML sanitization for user content
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Secure URL validation
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Generate secure random IDs
export function generateSecureId(): string {
  return crypto.randomUUID()
}

// Secure event handler wrapper
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
      console.error('Event handler error:', error)
      // Log security event if needed
    }
  }
}
