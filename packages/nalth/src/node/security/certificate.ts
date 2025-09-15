import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import forge from 'node-forge'

const execAsync = promisify(exec)

export interface CertificateOptions {
  domain?: string
  certDir?: string
  keySize?: number
  validityDays?: number
}

export interface CertificateResult {
  cert: string
  key: string
  certPath?: string
  keyPath?: string
}

export async function generateSecureCertificate(
  options: CertificateOptions = {}
): Promise<CertificateResult> {
  const {
    domain = 'localhost',
    certDir = join(process.cwd(), '.nalth', 'certs'),
    keySize = 2048,
    validityDays = 365
  } = options

  // Ensure certificate directory exists
  if (!existsSync(certDir)) {
    mkdirSync(certDir, { recursive: true })
  }

  const certPath = join(certDir, `${domain}.crt`)
  const keyPath = join(certDir, `${domain}.key`)

  // Check if certificate already exists and is valid
  if (existsSync(certPath) && existsSync(keyPath)) {
    try {
      const cert = readFileSync(certPath, 'utf-8')
      const key = readFileSync(keyPath, 'utf-8')
      
      if (validateCertificate(cert)) {
        return { cert, key, certPath, keyPath }
      }
    } catch (error) {
      // Certificate exists but is invalid, regenerate
    }
  }

  // Generate new certificate using node-forge
  const { cert, key } = await generateCertificateWithForge({
    domain,
    keySize,
    validityDays
  })

  // Save certificate and key to files
  try {
    const certStream = createWriteStream(certPath)
    certStream.write(cert)
    certStream.end()

    const keyStream = createWriteStream(keyPath)
    keyStream.write(key)
    keyStream.end()
  } catch (error) {
    console.warn('Failed to save certificate files:', error)
  }

  return { cert, key, certPath, keyPath }
}

async function generateCertificateWithForge(options: {
  domain: string
  keySize: number
  validityDays: number
}): Promise<{ cert: string; key: string }> {
  const { domain, keySize, validityDays } = options

  // Generate key pair
  const keys = forge.pki.rsa.generateKeyPair(keySize)
  
  // Create certificate
  const cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = '01'
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + validityDays)

  // Set subject and issuer (self-signed)
  const attrs = [
    { name: 'countryName', value: 'US' },
    { name: 'organizationName', value: 'Nalth Development' },
    { name: 'organizationalUnitName', value: 'Security Team' },
    { name: 'commonName', value: domain }
  ]
  cert.setSubject(attrs)
  cert.setIssuer(attrs)

  // Add extensions for proper SSL usage
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: false
    },
    {
      name: 'keyUsage',
      keyCertSign: false,
      digitalSignature: true,
      nonRepudiation: false,
      keyEncipherment: true,
      dataEncipherment: false
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: false,
      codeSigning: false,
      emailProtection: false,
      timeStamping: false
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2, // DNS
          value: domain
        },
        {
          type: 2, // DNS
          value: 'localhost'
        },
        {
          type: 7, // IP
          ip: '127.0.0.1'
        },
        {
          type: 7, // IP
          ip: '::1'
        }
      ]
    }
  ])

  // Self-sign certificate
  cert.sign(keys.privateKey, forge.md.sha256.create())

  // Convert to PEM format
  const certPem = forge.pki.certificateToPem(cert)
  const keyPem = forge.pki.privateKeyToPem(keys.privateKey)

  return {
    cert: certPem,
    key: keyPem
  }
}

export function validateCertificate(certPem: string): boolean {
  try {
    const cert = forge.pki.certificateFromPem(certPem)
    const now = new Date()
    
    // Check if certificate is still valid
    if (now < cert.validity.notBefore || now > cert.validity.notAfter) {
      return false
    }

    // Check if certificate has proper key usage for server authentication
    const keyUsage = cert.getExtension('keyUsage')
    const extKeyUsage = cert.getExtension('extKeyUsage')
    
    if (!keyUsage || !(keyUsage as any).digitalSignature || !(keyUsage as any).keyEncipherment) {
      return false
    }

    if (!extKeyUsage || !(extKeyUsage as any).serverAuth) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

export async function getCertificateInfo(certPem: string): Promise<{
  subject: string
  issuer: string
  validFrom: Date
  validTo: Date
  serialNumber: string
  fingerprint: string
}> {
  const cert = forge.pki.certificateFromPem(certPem)
  
  return {
    subject: cert.subject.getField('CN')?.value || 'Unknown',
    issuer: cert.issuer.getField('CN')?.value || 'Unknown',
    validFrom: cert.validity.notBefore,
    validTo: cert.validity.notAfter,
    serialNumber: cert.serialNumber,
    fingerprint: forge.md.sha256.create()
      .update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes())
      .digest()
      .toHex()
      .match(/.{2}/g)!
      .join(':')
      .toUpperCase()
  }
}

export function isCertificateExpiringSoon(certPem: string, daysThreshold = 30): boolean {
  try {
    const cert = forge.pki.certificateFromPem(certPem)
    const now = new Date()
    const expiryDate = cert.validity.notAfter
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    return daysUntilExpiry <= daysThreshold
  } catch (error) {
    return true // Assume expiring if we can't parse
  }
}
