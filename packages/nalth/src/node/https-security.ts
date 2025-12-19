import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ServerOptions as HttpsServerOptions } from 'node:https'
import colors from 'picocolors'
import type { Logger } from './logger'

export interface NalthHttpsConfig extends HttpsServerOptions {
  /** Auto-generate self-signed certificates for development */
  autoGenerate?: boolean
  /** Certificate storage directory */
  certDir?: string
}

/**
 * Generate self-signed certificate for development HTTPS
 */
export function generateSelfSignedCert(certDir: string, logger: Logger): { cert: string; key: string } {
  try {
    if (!existsSync(certDir)) {
      mkdirSync(certDir, { recursive: true })
    }

    const certPath = join(certDir, 'nalth-dev.crt')
    const keyPath = join(certDir, 'nalth-dev.key')

    // Check if certificates already exist
    if (existsSync(certPath) && existsSync(keyPath)) {
      logger.info(colors.green('Using existing development certificates'))
      return {
        cert: readFileSync(certPath, 'utf8'),
        key: readFileSync(keyPath, 'utf8')
      }
    }

    logger.info(colors.yellow('Generating self-signed certificate for HTTPS development...'))

    let generated = false
    try {
      // Prefer generating via selfsigned (pure JS) to avoid OpenSSL dependency
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const selfsigned = require('selfsigned')
      const pems = selfsigned.generate(
        [
          { name: 'commonName', value: 'localhost' },
          { name: 'organizationName', value: 'Nalth' },
        ],
        {
          days: 365,
          keySize: 2048,
          extensions: [
            { name: 'basicConstraints', cA: false },
            { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
            { name: 'extKeyUsage', serverAuth: true },
            {
              name: 'subjectAltName',
              altNames: [
                { type: 2, value: 'localhost' },
                { type: 7, ip: '127.0.0.1' },
                { type: 7, ip: '::1' },
              ],
            },
          ],
        },
      )
      writeFileSync(certPath, pems.cert)
      writeFileSync(keyPath, pems.private)
      generated = true
    } catch {}

    if (!generated) {
      // Fallback to OpenSSL if available
      execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: 'pipe' })
      const configPath = join(certDir, 'openssl.conf')
      const opensslConfig = `[req]
Distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = Dev
L = Dev
O = Nalth
OU = Dev
CN = localhost

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
basicConstraints = CA:FALSE
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
IP.1 = 127.0.0.1
IP.2 = ::1`
      writeFileSync(configPath, opensslConfig)
      execSync(
        `openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days 365 -config "${configPath}" -extensions v3_req`,
        { stdio: 'pipe' }
      )
    }

    logger.info(colors.green('✓ Self-signed certificate generated successfully'))
    logger.info(colors.dim(`  Certificate: ${certPath}`))
    logger.info(colors.dim(`  Private Key: ${keyPath}`))

    return {
      cert: readFileSync(certPath, 'utf8'),
      key: readFileSync(keyPath, 'utf8')
    }
  } catch (_error) {
    logger.warn(colors.yellow('Failed to generate self-signed certificate, falling back to HTTP'))
    logger.warn(colors.dim('Make sure OpenSSL is installed for HTTPS development'))
    throw _error
  }
}

/**
 * Resolve HTTPS configuration with security defaults
 */
export async function resolveNalthHttpsConfig(
  https: NalthHttpsConfig | boolean | undefined,
  cacheDir: string,
  logger: Logger
): Promise<HttpsServerOptions | undefined> {
  // If explicitly disabled, return undefined
  if (https === false) {
    return undefined
  }

  // Default HTTPS configuration for Nalth
  const defaultConfig: NalthHttpsConfig = {
    autoGenerate: true,
    certDir: join(cacheDir, 'certs'),
    // Security-focused TLS options
    secureProtocol: 'TLSv1_2_method',
    ciphers: [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-SHA256',
      'ECDHE-RSA-AES256-SHA384',
      'DHE-RSA-AES128-GCM-SHA256',
      'DHE-RSA-AES256-GCM-SHA384',
      'DHE-RSA-AES128-SHA256',
      'DHE-RSA-AES256-SHA256'
    ].join(':'),
    honorCipherOrder: true,
    secureOptions: (function() {
      const constants = require('node:constants');
      return constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1;
    })()
  }

  let config: NalthHttpsConfig

  if (https === true || https === undefined) {
    // Use default secure configuration
    config = defaultConfig
  } else {
    // Merge user config with defaults
    config = { ...defaultConfig, ...https }
  }

  // Auto-generate certificates if needed
  if (config.autoGenerate && !config.cert && !config.key) {
    try {
      const { cert, key } = generateSelfSignedCert(config.certDir!, logger)
      config.cert = cert
      config.key = key
    } catch (_error) {
      // Fall back to HTTP if certificate generation fails
      logger.warn(colors.yellow('HTTPS disabled due to certificate generation failure'))
      return undefined
    }
  }

  // Remove Nalth-specific options before returning
  const { autoGenerate, certDir, ...httpsOptions } = config
  return httpsOptions
}
