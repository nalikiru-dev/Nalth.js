import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import chalk from 'chalk'

export interface EncryptionConfig {
  algorithm?: string
  keyLength?: number
  ivLength?: number
  saltRounds?: number
  pepper?: string
}

export interface EncryptedData {
  data: string
  iv: string
  tag?: string
  salt?: string
}

export interface SecureInputOptions {
  encrypt?: boolean
  hash?: boolean
  sanitize?: boolean
  validate?: boolean
  maxLength?: number
  minLength?: number
  pattern?: RegExp
  allowedChars?: string
  blockedPatterns?: RegExp[]
}

const defaultConfig: Required<EncryptionConfig> = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  saltRounds: 12,
  pepper: process.env.NALTH_PEPPER || 'nalth-default-pepper-change-in-production'
}

/**
 * Advanced encryption utility for Nalth framework
 */
export class NalthCrypto {
  private config: Required<EncryptionConfig>
  private masterKey: Buffer

  constructor(config: Partial<EncryptionConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.masterKey = this.deriveMasterKey()
  }

  private deriveMasterKey(): Buffer {
    const secret = process.env.NALTH_SECRET_KEY || 'nalth-default-secret-change-in-production'
    return crypto.pbkdf2Sync(secret, this.config.pepper, 100000, this.config.keyLength, 'sha512')
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   */
  encrypt(plaintext: string, additionalKey?: string): EncryptedData {
    try {
      const iv = crypto.randomBytes(this.config.ivLength)
      const key = additionalKey ? 
        crypto.pbkdf2Sync(additionalKey, this.masterKey, 10000, this.config.keyLength, 'sha512') :
        this.masterKey

      const cipher = crypto.createCipher(this.config.algorithm, key)

      let encrypted = cipher.update(plaintext, 'utf8', 'hex')
      encrypted += cipher.final('hex')

      return {
        data: encrypted,
        iv: iv.toString('hex')
      }
    } catch (error) {
      console.error(chalk.red('Encryption failed:'), error)
      throw new Error('Encryption failed')
    }
  }

  /**
   * Decrypt data encrypted with encrypt()
   */
  decrypt(encryptedData: EncryptedData, additionalKey?: string): string {
    try {
      const key = additionalKey ? 
        crypto.pbkdf2Sync(additionalKey, this.masterKey, 10000, this.config.keyLength, 'sha512') :
        this.masterKey

      const decipher = crypto.createDecipher(this.config.algorithm, key)

      let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      console.error(chalk.red('Decryption failed:'), error)
      throw new Error('Decryption failed')
    }
  }

  /**
   * Hash passwords using bcrypt with configurable rounds
   */
  async hashPassword(password: string): Promise<string> {
    try {
      // Add pepper to password before hashing
      const pepperedPassword = password + this.config.pepper
      return await bcrypt.hash(pepperedPassword, this.config.saltRounds)
    } catch (error) {
      console.error(chalk.red('Password hashing failed:'), error)
      throw new Error('Password hashing failed')
    }
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      const pepperedPassword = password + this.config.pepper
      return await bcrypt.compare(pepperedPassword, hash)
    } catch (error) {
      console.error(chalk.red('Password verification failed:'), error)
      return false
    }
  }

  /**
   * Generate cryptographically secure random tokens
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Generate secure API keys
   */
  generateApiKey(): string {
    const timestamp = Date.now().toString(36)
    const random = crypto.randomBytes(24).toString('base64url')
    return `nalth_${timestamp}_${random}`
  }

  /**
   * Create HMAC signature for data integrity
   */
  createSignature(data: string, secret?: string): string {
    const key = secret || this.masterKey.toString('hex')
    return crypto.createHmac('sha256', key).update(data).digest('hex')
  }

  /**
   * Verify HMAC signature
   */
  verifySignature(data: string, signature: string, secret?: string): boolean {
    const expectedSignature = this.createSignature(data, secret)
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  }
}

/**
 * Input sanitization and validation utilities
 */
export class SecureInput {
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ]

  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(--|\/\*|\*\/)/g,
    /(\bUNION\b[\s\S]+\bSELECT\b)/gi,
    /(\b(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS)\b)/gi
  ]

  /**
   * Sanitize input to prevent XSS attacks
   */
  static sanitizeXSS(input: string): string {
    let sanitized = input
    
    // Remove dangerous patterns
    this.XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })

    // Encode HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')

    return sanitized
  }

  /**
   * Detect potential SQL injection attempts
   */
  static detectSQLInjection(input: string): boolean {
    return this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input))
  }

  /**
   * Validate and sanitize input based on options
   */
  static validateInput(input: string, options: SecureInputOptions): {
    isValid: boolean
    sanitized: string
    errors: string[]
  } {
    const errors: string[] = []
    let sanitized = input

    // Length validation
    if (options.maxLength && input.length > options.maxLength) {
      errors.push(`Input exceeds maximum length of ${options.maxLength}`)
    }
    if (options.minLength && input.length < options.minLength) {
      errors.push(`Input is below minimum length of ${options.minLength}`)
    }

    // Pattern validation
    if (options.pattern && !options.pattern.test(input)) {
      errors.push('Input does not match required pattern')
    }

    // Allowed characters validation
    if (options.allowedChars) {
      const allowedRegex = new RegExp(`^[${options.allowedChars}]*$`)
      if (!allowedRegex.test(input)) {
        errors.push('Input contains disallowed characters')
      }
    }

    // Blocked patterns validation
    if (options.blockedPatterns) {
      options.blockedPatterns.forEach((pattern, index) => {
        if (pattern.test(input)) {
          errors.push(`Input matches blocked pattern ${index + 1}`)
        }
      })
    }

    // SQL injection detection
    if (this.detectSQLInjection(input)) {
      errors.push('Potential SQL injection detected')
    }

    // Sanitization
    if (options.sanitize) {
      sanitized = this.sanitizeXSS(sanitized)
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    }
  }

  /**
   * Generate secure input field configuration
   */
  static createSecureField(type: 'password' | 'email' | 'text' | 'number', customOptions?: Partial<SecureInputOptions>): SecureInputOptions {
    const baseOptions: SecureInputOptions = {
      sanitize: true,
      validate: true,
      blockedPatterns: [...this.XSS_PATTERNS, ...this.SQL_INJECTION_PATTERNS]
    }

    switch (type) {
      case 'password':
        return {
          ...baseOptions,
          encrypt: true,
          hash: true,
          minLength: 8,
          maxLength: 128,
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          ...customOptions
        }
      
      case 'email':
        return {
          ...baseOptions,
          maxLength: 254,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          ...customOptions
        }
      
      case 'text':
        return {
          ...baseOptions,
          maxLength: 1000,
          allowedChars: 'a-zA-Z0-9\\s\\-_.,!?',
          ...customOptions
        }
      
      case 'number':
        return {
          ...baseOptions,
          pattern: /^\d+(\.\d+)?$/,
          allowedChars: '0-9.',
          ...customOptions
        }
      
      default:
        return { ...baseOptions, ...customOptions }
    }
  }
}

// Export singleton instance
export const nalthCrypto = new NalthCrypto()
