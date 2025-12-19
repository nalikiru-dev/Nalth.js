export { NalthServer } from './server/index.js'
export { generateSecureCertificate, validateCertificate } from './security/certificate.js'
export {
  createSecurityMiddleware,
  httpsRedirectMiddleware,
  additionalSecurityHeaders
} from './security/middleware.js'
export {
  NalthCrypto,
  SecureInput,
  nalthCrypto
} from './security/encryption.js'
export {
  NalthInputSecurity
} from './security/input.js'
// New Security Exports
export { sql, joinSql } from './security/sql.js'
export { safeFetch } from './security/ssrf.js'
export { OWASPSecurity, defaultOWASPConfig } from './node/security/owasp.js'

export type {
  CertificateOptions,
  CertificateResult
} from './security/certificate.js'
export type {
  SecurityConfig
} from './security/middleware.js'
export type {
  NalthServerConfig
} from './server/index.js'
export type {
  EncryptionConfig,
  EncryptedData,
  SecureInputOptions
} from './security/encryption.js'
export type {
  SecureFieldConfig,
  FormSecurityConfig
} from './security/input.js'
export type { SqlQuery } from './security/sql.js'
export type { SafeFetchOptions } from './security/ssrf.js'
export type { OWASPSecurityConfig } from './node/security/owasp.js'

// Plugins
export { nalthSRI } from './node/plugins/sri.js'
export type { SRIPluginOptions } from './node/plugins/sri.js'
export { nalthSecretScanner } from './node/plugins/secrets.js'
export type { SecretScannerOptions } from './node/plugins/secrets.js'

// Client Security (re-export for convenience)
export {
  escapeHtml,
  escapeAttribute,
  sanitizeUrl,
  createSafeElement,
  safeSetHtml,
  safeParseJson,
  setupCSPReporter,
  generateNonce
} from './client/security.js'
export type { SanitizeOptions } from './client/security.js'
