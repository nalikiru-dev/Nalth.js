# 📚 API Reference

**Complete NALTH API Documentation**

This reference provides comprehensive documentation for all NALTH APIs, configuration options, and interfaces. NALTH maintains 100% compatibility with Vite.js APIs while adding powerful security features.

---

## 🎯 Quick Reference

### Core APIs
- [**Configuration API**](./config.md) - `defineConfig()`, security options, and build configuration
- [**Security API**](./security.md) - Security features, CSP, HTTPS, and vulnerability scanning
- [**Plugin API**](./plugins.md) - Plugin development, hooks, and security middleware
- [**Build API**](./build.md) - Build process, optimization, and asset security

### Command Line Interface
- [**CLI Reference**](../reference/cli.md) - All NALTH CLI commands and options
- [**Environment Variables**](../reference/env-variables.md) - Configuration via environment variables

---

## 🔧 Configuration API

### `defineConfig()`

**Primary configuration function for NALTH projects**

```typescript
import { defineConfig } from 'nalth'

export default defineConfig(options: UserConfig): UserConfig
```

#### Parameters

- **`options`** (`UserConfig`): Configuration object with Vite compatibility + security features

#### Returns

- `UserConfig`: Processed configuration object

#### Example

```typescript
import { defineConfig } from 'nalth'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Standard Vite configuration
  plugins: [react()],
  server: {
    port: 3000
  },
  
  // NALTH security configuration  
  security: {
    https: {
      enabled: true,
      autoGenerate: true
    },
    csp: {
      mode: 'auto',
      reportUri: '/csp-violations'
    },
    audit: {
      enabled: true,
      level: 'strict'
    }
  }
})
```

---

## 🔒 Security Configuration

### `SecurityConfig`

**Complete security configuration interface**

```typescript
interface SecurityConfig {
  https?: HttpsConfig
  csp?: CSPConfig  
  headers?: SecurityHeadersConfig
  sri?: SRIConfig
  audit?: SecurityAuditConfig
  alerts?: SecurityAlertsConfig
  policies?: SecurityPoliciesConfig
  monitoring?: SecurityMonitoringConfig
}
```

### HTTPS Configuration

```typescript
interface HttpsConfig {
  enabled: boolean                    // Enable HTTPS (default: true)
  autoGenerate: boolean               // Auto-generate dev certificates
  force: boolean                      // Redirect HTTP to HTTPS
  certDir?: string                    // Certificate directory
  cert?: string                       // Certificate file path
  key?: string                        // Private key file path
  hsts?: {                           // HTTP Strict Transport Security
    maxAge: number                    // HSTS max age in seconds
    includeSubdomains: boolean        // Include subdomains
    preload: boolean                  // HSTS preload list
  }
}
```

**Example:**
```typescript
export default defineConfig({
  security: {
    https: {
      enabled: true,
      autoGenerate: true,
      force: true,
      certDir: './.nalth/certs',
      hsts: {
        maxAge: 31536000,           // 1 year
        includeSubdomains: true,
        preload: true
      }
    }
  }
})
```

### Content Security Policy (CSP)

```typescript
interface CSPConfig {
  mode: 'auto' | 'strict' | 'custom'  // CSP generation mode
  reportUri?: string                   // Violation reporting endpoint
  reportOnly?: boolean                 // Report-only mode for testing
  nonce?: boolean                      // Enable nonce for inline scripts
  directives?: CSPDirectives           // Custom CSP directives
  excludeUrls?: string[]              // URLs to exclude from CSP
}

interface CSPDirectives {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'connect-src'?: string[]
  'font-src'?: string[]
  'object-src'?: string[]
  'media-src'?: string[]
  'frame-src'?: string[]
  'sandbox'?: string[]
  'report-uri'?: string[]
  'child-src'?: string[]
  'form-action'?: string[]
  'frame-ancestors'?: string[]
  'plugin-types'?: string[]
  'base-uri'?: string[]
  'worker-src'?: string[]
}
```

**Example:**
```typescript
export default defineConfig({
  security: {
    csp: {
      mode: 'auto',
      reportUri: '/api/csp-violations',
      nonce: true,
      directives: {
        'script-src': ["'self'", "'nonce-{NONCE}'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", "data:", "https:"],
        'connect-src': ["'self'", "wss://localhost:*"]
      }
    }
  }
})
```

### Security Headers

```typescript
interface SecurityHeadersConfig {
  hsts?: boolean | HSSTConfig          // HTTP Strict Transport Security
  frameOptions?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM' | false
  contentTypeOptions?: boolean         // X-Content-Type-Options: nosniff
  xssProtection?: boolean | XSSProtectionConfig
  referrerPolicy?: ReferrerPolicyValue
  permissionsPolicy?: PermissionsPolicyConfig
  crossOriginEmbedderPolicy?: 'unsafe-none' | 'require-corp'
  crossOriginOpenerPolicy?: 'unsafe-none' | 'same-origin-allow-popups' | 'same-origin'
  crossOriginResourcePolicy?: 'same-site' | 'same-origin' | 'cross-origin'
}

interface XSSProtectionConfig {
  enabled: boolean
  mode?: 'block'
  report?: string
}

interface PermissionsPolicyConfig {
  camera?: string[]
  microphone?: string[]
  geolocation?: string[]
  payment?: string[]
  usb?: string[]
  // ... more permissions
}
```

**Example:**
```typescript
export default defineConfig({
  security: {
    headers: {
      hsts: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      },
      frameOptions: 'DENY',
      contentTypeOptions: true,
      xssProtection: {
        enabled: true,
        mode: 'block'
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: ['self']
      }
    }
  }
})
```

---

## 🔍 Security Audit API

### `SecurityAuditConfig`

```typescript
interface SecurityAuditConfig {
  enabled: boolean                     // Enable vulnerability scanning
  level: 'low' | 'moderate' | 'high' | 'strict'
  sources: AuditSource[]              // Vulnerability data sources
  autoFix: boolean                    // Auto-fix vulnerabilities
  reportFormat: 'json' | 'html' | 'sarif'
  schedule?: string                   // Cron schedule for automatic audits
  excludePatterns?: string[]          // Patterns to exclude
  includeDevDependencies?: boolean    // Include dev dependencies
}

type AuditSource = 'npm' | 'snyk' | 'ossindex' | 'nalth'
```

### Audit Methods

```typescript
// Programmatic security audit
import { audit } from 'nalth/security'

// Run security audit
const result = await audit({
  level: 'strict',
  sources: ['npm', 'snyk'],
  format: 'json'
})

interface AuditResult {
  summary: {
    total: number
    critical: number
    high: number
    moderate: number
    low: number
  }
  vulnerabilities: Vulnerability[]
  packages: PackageInfo[]
  timestamp: Date
}

interface Vulnerability {
  id: string
  title: string
  severity: 'critical' | 'high' | 'moderate' | 'low'
  package: string
  version: string
  patched?: string
  description: string
  references: string[]
  cwe?: string[]
  cvss?: {
    score: number
    vector: string
  }
}
```

---

## 🛡️ Security Monitoring API

### Real-time Security Metrics

```typescript
import { SecurityMonitor } from 'nalth/security'

const monitor = new SecurityMonitor({
  enabled: true,
  interval: 5000,  // 5 seconds
  dashboard: true
})

// Get current security metrics
const metrics = await monitor.getMetrics()

interface SecurityMetrics {
  overallScore: number              // 0-100 security score
  timestamp: Date
  https: {
    enabled: boolean
    certificate: {
      valid: boolean
      expires: Date
      issuer: string
    }
  }
  csp: {
    enabled: boolean
    violations: number
    lastViolation?: Date
  }
  vulnerabilities: {
    critical: number
    high: number
    moderate: number
    low: number
    lastScan: Date
  }
  headers: {
    hsts: boolean
    frameOptions: boolean
    contentTypeOptions: boolean
    xssProtection: boolean
  }
}
```

### Security Events

```typescript
// Subscribe to security events
monitor.on('vulnerability-detected', (event: VulnerabilityEvent) => {
  console.log('New vulnerability:', event.vulnerability)
})

monitor.on('csp-violation', (event: CSPViolationEvent) => {
  console.log('CSP violation:', event.violation)
})

monitor.on('security-score-changed', (event: SecurityScoreEvent) => {
  console.log('Security score:', event.score)
})

interface VulnerabilityEvent {
  type: 'vulnerability-detected'
  vulnerability: Vulnerability
  package: string
  severity: 'critical' | 'high' | 'moderate' | 'low'
  timestamp: Date
}

interface CSPViolationEvent {
  type: 'csp-violation'
  violation: {
    directive: string
    violatedDirective: string
    blockedURI: string
    sourceFile?: string
    lineNumber?: number
  }
  timestamp: Date
}
```

---

## 🔧 Plugin API

### Security Plugin Development

```typescript
import { Plugin } from 'nalth'

export function mySecurityPlugin(options?: PluginOptions): Plugin {
  return {
    name: 'my-security-plugin',
    
    // Security-specific hooks
    configSecurityOptions(config) {
      // Modify security configuration
      return config
    },
    
    generateCSP(directives) {
      // Modify CSP directives
      return directives  
    },
    
    configureServer(server) {
      // Add security middleware
      server.middlewares.use('/api', securityMiddleware())
    },
    
    generateBundle(options, bundle) {
      // Add SRI hashes to assets
      for (const fileName in bundle) {
        const chunk = bundle[fileName]
        if (chunk.type === 'chunk') {
          chunk.code = addSRIHashes(chunk.code)
        }
      }
    }
  }
}
```

### Security Middleware

```typescript
import { SecurityMiddleware } from 'nalth/middleware'

export function customSecurityMiddleware(): SecurityMiddleware {
  return {
    name: 'custom-security',
    priority: 100,
    
    async apply(context) {
      const { request, response } = context
      
      // Add custom security logic
      if (isSuspiciousRequest(request)) {
        response.status = 403
        response.body = 'Access denied'
        return false  // Stop further processing
      }
      
      return true  // Continue to next middleware
    }
  }
}
```

---

## 🏗️ Build API

### Secure Build Configuration

```typescript
interface SecureBuildConfig {
  sri?: boolean                       // Generate SRI hashes
  minify?: boolean                   // Minify for security
  sourcemap?: boolean | 'inline'     // Source maps for debugging
  rollupOptions?: {
    external?: string[]              // External dependencies
    plugins?: Plugin[]               // Additional Rollup plugins
  }
  security?: {
    obfuscate?: boolean             // Code obfuscation
    integrity?: boolean             // Asset integrity verification
    bundleAnalysis?: boolean        // Security bundle analysis
  }
}
```

### Build Hooks

```typescript
export function securityBuildPlugin(): Plugin {
  return {
    name: 'security-build',
    
    buildStart(options) {
      // Security checks before build
      console.log('Starting security build checks...')
    },
    
    generateBundle(options, bundle) {
      // Generate SRI hashes
      for (const fileName in bundle) {
        const chunk = bundle[fileName]
        if (chunk.type === 'asset') {
          chunk.metadata = {
            ...chunk.metadata,
            integrity: generateSRIHash(chunk.source)
          }
        }
      }
    },
    
    writeBundle(options, bundle) {
      // Security analysis after build
      generateSecurityReport(bundle)
    }
  }
}
```

---

## 🛠️ Utility APIs

### Security Utilities

```typescript
import { 
  generateNonce,
  sanitizeHTML,
  validateCSP,
  checkVulnerabilities
} from 'nalth/utils'

// Generate cryptographic nonce
const nonce = generateNonce()  // Returns: string

// Sanitize HTML content
const safeHTML = sanitizeHTML('<script>alert("xss")</script>')
// Returns: '&lt;script&gt;alert("xss")&lt;/script&gt;'

// Validate CSP directives
const isValid = validateCSP({
  'script-src': ["'self'", "'nonce-abc123'"]
})  // Returns: boolean

// Check for vulnerabilities
const vulns = await checkVulnerabilities(['package@1.0.0'])
// Returns: Vulnerability[]
```

### Type Definitions

```typescript
// Complete type definitions
export interface UserConfig extends ViteUserConfig {
  security?: SecurityConfig
}

export interface SecurityConfig {
  https?: HttpsConfig
  csp?: CSPConfig
  headers?: SecurityHeadersConfig
  sri?: SRIConfig
  audit?: SecurityAuditConfig
  alerts?: SecurityAlertsConfig
  monitoring?: SecurityMonitoringConfig
}

// Plugin types
export interface SecurityPlugin extends Plugin {
  configSecurityOptions?: (config: SecurityConfig) => SecurityConfig
  generateCSP?: (directives: CSPDirectives) => CSPDirectives
  securityMiddleware?: () => SecurityMiddleware[]
}

// Middleware types
export interface SecurityMiddleware {
  name: string
  priority: number
  apply: (context: SecurityContext) => Promise<boolean>
}

export interface SecurityContext {
  request: IncomingMessage
  response: ServerResponse
  config: SecurityConfig
  metrics: SecurityMetrics
}
```

---

## 🌐 Environment Variables

### Security Environment Variables

```bash
# HTTPS Configuration
NALTH_HTTPS_ENABLED=true
NALTH_HTTPS_AUTO_GENERATE=true
NALTH_HTTPS_CERT_DIR=./.nalth/certs

# CSP Configuration  
NALTH_CSP_MODE=auto
NALTH_CSP_REPORT_URI=/csp-violations
NALTH_CSP_NONCE=true

# Security Audit
NALTH_AUDIT_ENABLED=true
NALTH_AUDIT_LEVEL=strict
NALTH_AUDIT_AUTO_FIX=false

# Monitoring
NALTH_MONITORING_ENABLED=true
NALTH_MONITORING_DASHBOARD=true
NALTH_MONITORING_INTERVAL=5000

# Production Security
NALTH_SECURITY_HEADERS=true
NALTH_SRI_ENABLED=true
NALTH_SECURITY_REPORTING=true
```

---

## 📖 TypeScript Support

### Full Type Safety

```typescript
// Import with full TypeScript support
import { 
  defineConfig,
  type UserConfig,
  type SecurityConfig,
  type Plugin
} from 'nalth'

// Type-safe configuration
const config: UserConfig = defineConfig({
  security: {
    https: {
      enabled: true,      // ✅ Type-safe
      invalid: 'option'   // ❌ TypeScript error
    }
  }
})

// Plugin development with types
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    configSecurityOptions(config) {
      // ✅ Full IntelliSense support
      config.csp?.directives
      return config
    }
  }
}
```

---

## 🎯 Migration from Vite

### Compatibility Layer

NALTH maintains 100% compatibility with Vite.js:

```typescript
// Existing Vite config works unchanged
import { defineConfig } from 'vite'  // ❌ Old
import { defineConfig } from 'nalth'  // ✅ New - same API

// All Vite plugins work
import react from '@vitejs/plugin-react'
import { defineConfig } from 'nalth'

export default defineConfig({
  plugins: [react()],  // ✅ Works perfectly
  // Add security features
  security: {
    https: true
  }
})
```

---

## 📚 More Resources

### Deep Dive Documentation
- [Configuration Guide](../guide/configuration.md) - Detailed configuration examples
- [Security Features](../security/overview.md) - Complete security feature documentation  
- [Plugin Development](../guide/plugin-development.md) - Build security plugins
- [CLI Reference](../reference/cli.md) - Command line interface documentation

### Code Examples
- [React Security Example](../examples/react-security.md) - React app with security
- [Vue Enterprise Example](../examples/vue-enterprise.md) - Enterprise Vue.js setup
- [Full-Stack Security](../examples/full-stack.md) - Complete security implementation

---

**Need specific API help?** Check the individual API documentation pages or explore our [examples](../examples/overview.md) for practical implementations.

**NALTH API**: Type-safe, secure, and compatible with your existing Vite.js knowledge. 🛡️⚡