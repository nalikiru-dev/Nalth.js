import { sep, posix } from 'node:path'
import { createHash } from 'node:crypto'

/**
 * Normalize path separators to forward slashes
 */
export function normalizePath(id: string): string {
  return id.replace(/\\/g, '/')
}

/**
 * Convert Windows path to POSIX path
 */
export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

/**
 * Check if a path is absolute
 */
export function isAbsolute(p: string): boolean {
  if (process.platform === 'win32') {
    return /^[a-zA-Z]:/.test(p) || p.startsWith('\\\\')
  }
  return p.startsWith('/')
}

/**
 * Join paths with forward slashes
 */
export function joinUrlSegments(...parts: string[]): string {
  return parts
    .map((part, index) => {
      if (index === 0) {
        return part.replace(/\/+$/, '')
      }
      return part.replace(/^\/+/, '').replace(/\/+$/, '')
    })
    .filter(Boolean)
    .join('/')
}

/**
 * Remove leading slash
 */
export function removeLeadingSlash(str: string): string {
  return str.replace(/^\/+/, '')
}

/**
 * Ensure trailing slash
 */
export function ensureTrailingSlash(str: string): string {
  return str.endsWith('/') ? str : str + '/'
}

/**
 * Generate content hash
 */
export function getHash(text: string, length = 8): string {
  return createHash('sha256').update(text).digest('hex').slice(0, length)
}

/**
 * Check if string is a valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string is external URL
 */
export function isExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Check if string is data URL
 */
export function isDataUrl(url: string): boolean {
  return url.startsWith('data:')
}

/**
 * Parse query string
 */
export function parseQuery(search: string): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {}
  const params = new URLSearchParams(search)
  
  for (const [key, value] of params) {
    if (key in query) {
      const existing = query[key]
      if (Array.isArray(existing)) {
        existing.push(value)
      } else {
        query[key] = [existing, value]
      }
    } else {
      query[key] = value
    }
  }
  
  return query
}

/**
 * Stringify query object
 */
export function stringifyQuery(obj: Record<string, any>): string {
  const params = new URLSearchParams()
  
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, String(v)))
    } else if (value != null) {
      params.append(key, String(value))
    }
  }
  
  const str = params.toString()
  return str ? `?${str}` : ''
}

/**
 * Clean URL by removing query and hash
 */
export function cleanUrl(url: string): string {
  return url.replace(/[?#].*$/, '')
}

/**
 * Check if file is in node_modules
 */
export function isInNodeModules(id: string): boolean {
  return id.includes('node_modules')
}

/**
 * Get package name from node_modules path
 */
export function getPackageNameFromPath(path: string): string | null {
  const match = path.match(/node_modules\/([^/]+)/)
  return match ? match[1] : null
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key] as any, source[key] as any)
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Check if value is object
 */
export function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Convert bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

/**
 * Generate random string
 */
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
  return !!(
    process.env.CI ||
    process.env.CONTINUOUS_INTEGRATION ||
    process.env.BUILD_NUMBER ||
    process.env.RUN_ID
  )
}

/**
 * Check if running in development mode
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if running in production mode
 */
export function isProd(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Get environment variable with fallback
 */
export function getEnv(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback
}

/**
 * Parse boolean from environment variable
 */
export function getEnvBool(key: string, fallback = false): boolean {
  const value = process.env[key]
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

/**
 * Parse number from environment variable
 */
export function getEnvNumber(key: string, fallback?: number): number | undefined {
  const value = process.env[key]
  if (value === undefined) return fallback
  const num = Number(value)
  return isNaN(num) ? fallback : num
}

/**
 * Escape HTML entities
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  
  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match])
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  }
  
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (match) => htmlUnescapes[match])
}

/**
 * Strip ANSI color codes
 */
export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

/**
 * Check if two arrays are equal
 */
export function arrayEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}

/**
 * Remove duplicates from array
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val)
  }, [])
}

/**
 * Pick properties from object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Omit properties from object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Check if string matches glob pattern
 */
export function minimatch(str: string, pattern: string): boolean {
  // Simple glob matching - for production use a proper library like minimatch
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.')
  
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(str)
}
