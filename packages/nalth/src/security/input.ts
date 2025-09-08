import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import chalk from 'chalk'
import { SecureInput, SecureInputOptions, nalthCrypto } from './encryption.js'

export interface SecureFieldConfig {
  name: string
  type: 'password' | 'email' | 'text' | 'number' | 'phone' | 'url'
  required?: boolean
  encrypt?: boolean
  hash?: boolean
  options?: SecureInputOptions
}

export interface FormSecurityConfig {
  fields: SecureFieldConfig[]
  csrfProtection?: boolean
  rateLimitPerField?: number
  sanitizeAll?: boolean
  logViolations?: boolean
}

/**
 * Secure input middleware for Nalth applications
 */
export class NalthInputSecurity {
  /**
   * Create validation middleware for secure forms
   */
  static createSecureForm(config: FormSecurityConfig): ValidationChain[] {
    const validations: ValidationChain[] = []

    config.fields.forEach(field => {
      let validation = body(field.name)

      // Required validation
      if (field.required) {
        validation = validation.notEmpty().withMessage(`${field.name} is required`)
      }

      // Type-specific validation
      switch (field.type) {
        case 'email':
          validation = validation.isEmail().withMessage('Invalid email format')
          break
        case 'password':
          validation = validation
            .isLength({ min: 8, max: 128 })
            .withMessage('Password must be 8-128 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must contain uppercase, lowercase, number and special character')
          break
        case 'phone':
          validation = validation
            .matches(/^\+?[\d\s\-\(\)]+$/)
            .withMessage('Invalid phone number format')
          break
        case 'url':
          validation = validation.isURL().withMessage('Invalid URL format')
          break
        case 'number':
          validation = validation.isNumeric().withMessage('Must be a number')
          break
      }

      // Custom options
      if (field.options) {
        if (field.options.maxLength) {
          validation = validation.isLength({ max: field.options.maxLength })
            .withMessage(`${field.name} exceeds maximum length`)
        }
        if (field.options.minLength) {
          validation = validation.isLength({ min: field.options.minLength })
            .withMessage(`${field.name} below minimum length`)
        }
        if (field.options.pattern) {
          validation = validation.matches(field.options.pattern)
            .withMessage(`${field.name} format is invalid`)
        }
      }

      // Sanitization
      validation = validation.customSanitizer((value: string) => {
        if (typeof value !== 'string') return value
        
        const fieldType = field.type === 'phone' || field.type === 'url' ? 'text' : field.type
        const secureOptions = field.options || SecureInput.createSecureField(fieldType)
        const result = SecureInput.validateInput(value, secureOptions)
        
        if (!result.isValid && config.logViolations) {
          console.log(chalk.yellow(`⚠ Input validation failed for ${field.name}:`))
          result.errors.forEach(error => console.log(chalk.red(`  - ${error}`)))
        }
        
        return result.sanitized
      })

      validations.push(validation)
    })

    return validations
  }

  /**
   * Middleware to handle validation results and process secure fields
   */
  static processSecureForm(config: FormSecurityConfig) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Check validation results
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        })
      }

      // Process secure fields (encryption/hashing)
      for (const field of config.fields) {
        const value = req.body[field.name]
        if (!value) continue

        try {
          if (field.hash && field.type === 'password') {
            // Hash passwords
            req.body[field.name] = await nalthCrypto.hashPassword(value)
            console.log(chalk.green(`🔒 Password hashed for ${field.name}`))
          } else if (field.encrypt) {
            // Encrypt sensitive data
            const encrypted = nalthCrypto.encrypt(value)
            req.body[field.name] = encrypted
            console.log(chalk.green(`🔐 Data encrypted for ${field.name}`))
          }
        } catch (error) {
          console.error(chalk.red(`✗ Security processing failed for ${field.name}:`), error)
          return res.status(500).json({
            success: false,
            message: 'Security processing failed'
          })
        }
      }

      next()
    }
  }

  /**
   * Create middleware for password verification
   */
  static verifyPassword(passwordField: string = 'password', hashField: string = 'passwordHash') {
    return async (req: Request, res: Response, next: NextFunction) => {
      const password = req.body[passwordField]
      const hash = req.body[hashField] || (req as any).user?.[hashField]

      if (!password || !hash) {
        return res.status(400).json({
          success: false,
          message: 'Password and hash required for verification'
        })
      }

      try {
        const isValid = await nalthCrypto.verifyPassword(password, hash)
        req.passwordVerified = isValid

        if (!isValid) {
          console.log(chalk.yellow('⚠ Password verification failed'))
          return res.status(401).json({
            success: false,
            message: 'Invalid password',
            error: 'Invalid password'
          })
        }

        console.log(chalk.green('✓ Password verified successfully'))
        next()
      } catch (error) {
        console.error(chalk.red('✗ Password verification error:'), error)
        return res.status(500).json({
          success: false,
          message: 'Password verification failed',
          error: 'Internal Server Error'
        })
      }
    }
  }

  /**
   * Decrypt encrypted field data
   */
  static decryptField(fieldName: string, outputField?: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const encryptedData = req.body[fieldName]
      if (!encryptedData) return next()

      try {
        const decrypted = nalthCrypto.decrypt(encryptedData)
        req.body[outputField || fieldName] = decrypted
        console.log(chalk.green(`🔓 Data decrypted for ${fieldName}`))
        next()
      } catch (error) {
        console.error(chalk.red(`✗ Decryption failed for ${fieldName}:`), error)
        return res.status(500).json({
          success: false,
          message: 'Data decryption failed'
        })
      }
    }
  }

  /**
   * Generate secure API key middleware
   */
  static generateApiKey() {
    return (req: Request, _res: Response, next: NextFunction) => {
      req.apiKey = nalthCrypto.generateApiKey()
      next()
    }
  }

  /**
   * Validate API key middleware
   */
  static validateApiKey(headerName: string = 'x-api-key') {
    return (req: Request, res: Response, next: NextFunction) => {
      const apiKey = req.headers[headerName] as string
      
      if (!apiKey) {
        return res.status(401).json({
          success: false,
          message: 'API key required'
        })
      }

      // Basic API key format validation
      if (!apiKey.startsWith('nalth_') || apiKey.length < 32) {
        return res.status(401).json({
          success: false,
          message: 'Invalid API key format'
        })
      }

      req.apiKey = apiKey
      next()
    }
  }

  /**
   * Create CSRF token
   */
  static generateCSRFToken() {
    return (req: Request, _res: Response, next: NextFunction) => {
      req.csrfToken = nalthCrypto.generateSecureToken(32)
      next()
    }
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(tokenField: string = 'csrfToken') {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.body[tokenField] || req.headers['x-csrf-token']
      const sessionToken = (req as any).session?.csrfToken

      if (!token || !sessionToken || token !== sessionToken) {
        return res.status(403).json({
          success: false,
          message: 'Invalid CSRF token'
        })
      }

      next()
    }
  }
}

// Extend Express Request interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      passwordVerified?: boolean
      apiKey?: string
      csrfToken?: string
      securityViolations?: string[]
    }
  }
}
