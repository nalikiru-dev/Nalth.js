import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
// execSync import removed as it's unused
import { join } from 'node:path'
import forge from 'node-forge'
import chalk from 'chalk'

export interface CertificateOptions {
  certDir: string
  domain?: string
  validDays?: number
  keySize?: number
}

export interface CertificateResult {
  cert: string
  key: string
  certPath: string
  keyPath: string
}

/**
 * Generate a proper self-signed certificate for HTTPS development
 * Fixes the ERR_SSL_KEY_USAGE_INCOMPATIBLE error by using correct key usage
 */
export function generateSecureCertificate(options: CertificateOptions): CertificateResult {
  const {
    certDir,
    domain = 'localhost',
    validDays = 365,
    keySize = 2048
  } = options

  if (!existsSync(certDir)) {
    mkdirSync(certDir, { recursive: true })
  }

  const certPath = join(certDir, 'nalth-dev.crt')
  const keyPath = join(certDir, 'nalth-dev.key')

  // Check if valid certificates already exist
  if (existsSync(certPath) && existsSync(keyPath)) {
    try {
      const cert = readFileSync(certPath, 'utf8')
      const key = readFileSync(keyPath, 'utf8')
      
      // Validate certificate is still valid
      const forgeCert = forge.pki.certificateFromPem(cert)
      const now = new Date()
      
      if (forgeCert.validity.notAfter > now) {
        console.log(chalk.green('✓ Using existing valid development certificates'))
        return { cert, key, certPath, keyPath }
      }
    } catch (_error) {
      console.log(chalk.yellow('⚠ Existing certificates are invalid, regenerating...'))
    }
  }

  console.log(chalk.blue('🔐 Generating secure self-signed certificate...'))

  try {
    // Generate key pair using node-forge for better control
    const keys = forge.pki.rsa.generateKeyPair(keySize)
    
    // Create certificate
    const cert = forge.pki.createCertificate()
    cert.publicKey = keys.publicKey
    cert.serialNumber = '01'
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + validDays)

    // Set subject and issuer
    const attrs = [
      { name: 'countryName', value: 'US' },
      { name: 'stateOrProvinceName', value: 'Development' },
      { name: 'localityName', value: 'Local' },
      { name: 'organizationName', value: 'Nalth Development' },
      { name: 'organizationalUnitName', value: 'Security Team' },
      { name: 'commonName', value: domain }
    ]
    
    cert.setSubject(attrs)
    cert.setIssuer(attrs)

    // Set extensions with proper key usage for server authentication
    cert.setExtensions([
      {
        name: 'basicConstraints',
        cA: false,
        critical: true
      },
      {
        name: 'keyUsage',
        keyCertSign: false,
        digitalSignature: true,
        nonRepudiation: false,
        keyEncipherment: true,
        dataEncipherment: false,
        keyAgreement: false,
        critical: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: false,
        codeSigning: false,
        emailProtection: false,
        timeStamping: false,
        critical: true
      },
      {
        name: 'subjectAltName',
        altNames: [
          { type: 2, value: 'localhost' },
          { type: 2, value: '*.localhost' },
          { type: 7, ip: '127.0.0.1' },
          { type: 7, ip: '::1' }
        ]
      }
    ])

    // Sign certificate
    cert.sign(keys.privateKey, forge.md.sha256.create())

    // Convert to PEM format
    const certPem = forge.pki.certificateToPem(cert)
    const keyPem = forge.pki.privateKeyToPem(keys.privateKey)

    // Write to files
    writeFileSync(certPath, certPem)
    writeFileSync(keyPath, keyPem)

    console.log(chalk.green('✓ Secure certificate generated successfully'))
    console.log(chalk.dim(`  Certificate: ${certPath}`))
    console.log(chalk.dim(`  Private Key: ${keyPath}`))
    console.log(chalk.dim(`  Valid until: ${cert.validity.notAfter.toISOString()}`))

    return {
      cert: certPem,
      key: keyPem,
      certPath,
      keyPath
    }
  } catch (_error) {
    console.error(chalk.red('✗ Failed to generate certificate:'), _error)
    throw new Error('Certificate generation failed')
  }
}

/**
 * Validate certificate for proper server authentication usage
 */
export function validateCertificate(certPem: string): boolean {
  try {
    const cert = forge.pki.certificateFromPem(certPem)
    
    // Check if certificate is still valid
    const now = new Date()
    if (cert.validity.notAfter <= now) {
      return false
    }

    // Check for proper extensions
    const extensions = cert.extensions || []
    
    // Check for server authentication in extended key usage
    const extKeyUsage = extensions.find(ext => ext.name === 'extKeyUsage')
    if (!extKeyUsage || !extKeyUsage.serverAuth) {
      return false
    }

    // Check for proper key usage
    const keyUsage = extensions.find(ext => ext.name === 'keyUsage')
    if (!keyUsage || !keyUsage.digitalSignature || !keyUsage.keyEncipherment) {
      return false
    }

    return true
  } catch (_error) {
    return false
  }
}
