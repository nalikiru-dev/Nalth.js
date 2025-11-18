# Nalth - Security-First Web Development Framework

Nalth is a security-enhanced fork of Vite.js that provides enterprise-grade security features by default while maintaining full compatibility with the Vite ecosystem.

## 🛡️ Security Features

### 1. HTTPS by Default

- **Auto-generated certificates**: Nalth automatically generates self-signed certificates for development
- **Secure TLS configuration**: Uses modern cipher suites and disables insecure protocols
- **Production-ready**: Easy configuration for production certificates

```javascript
// nalth.config.ts
export default {
  server: {
    https: true, // Enabled by default
    // Or customize:
    https: {
      autoGenerate: true,
      certDir: './certs',
      // Additional TLS options...
    },
  },
}
```

### 2. Content Security Policy (CSP)

- **Strict default policy**: Prevents XSS and injection attacks
- **Development-friendly**: Allows necessary resources for HMR and dev tools
- **Customizable**: Easy to configure for your application needs

```javascript
{
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'ws:', 'wss:'],
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"]
}
```

### 3. Security Headers

- **HSTS**: HTTP Strict Transport Security with preload
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 4. Subresource Integrity (SRI)

- **Automatic hash generation**: SHA-384 hashes for all assets
- **Build-time integration**: No runtime performance impact
- **Tamper detection**: Prevents malicious asset modification

```html
<!-- Automatically generated -->
<script
  src="/assets/main.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

### 5. Security Auditing

- **Pattern detection**: Identifies potentially unsafe code patterns
- **Build-time warnings**: Alerts during development
- **Configurable rules**: Customize security checks

```javascript
// Default unsafe patterns detected:
- eval()
- Function()
- innerHTML assignments
- document.write()
- Unsafe setTimeout/setInterval
- And more...
```

## 🚀 Getting Started

### Installation

```bash
npm install nalth
# or
yarn add nalth
# or
pnpm add nalth
```

### Basic Usage

Nalth is a drop-in replacement for Vite with security enabled by default:

```javascript
// nalth.config.ts
import { defineConfig } from 'nalth'

export default defineConfig({
  // All your existing Vite config works
  plugins: [
    // Your existing plugins work unchanged
  ],

  // Security is enabled by default, but you can customize:
  security: {
    https: {
      enabled: true,
      autoGenerate: true,
    },
    csp: {
      enabled: true,
      // Customize CSP directives
    },
    sri: {
      enabled: true,
      algorithms: ['sha384'],
    },
    audit: {
      enabled: true,
      failOnViolations: false, // Set to true for strict mode
    },
  },
})
```

### CLI Usage

```bash
# Development server (HTTPS by default)
nalth dev

# Build with security features
nalth build

# Preview with security headers
nalth preview
```

## 🔧 Configuration

### Security Configuration

Create a `security.config.ts` file for advanced security settings:

```typescript
import { defineSecurityConfig } from 'nalth'

export default defineSecurityConfig({
  https: {
    enabled: true,
    autoGenerate: true,
    certDir: './certs',
  },

  csp: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      // Add your custom directives
    },
    reportOnly: false, // Set to true for testing
    reportUri: '/csp-report', // CSP violation reporting
  },

  headers: {
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameOptions: 'DENY',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
  },

  sri: {
    enabled: true,
    algorithms: ['sha384'],
    includeInline: false,
  },

  audit: {
    enabled: true,
    unsafePatterns: [
      'eval\\(',
      'innerHTML\\s*=',
      // Add custom patterns
    ],
    failOnViolations: false,
  },
})
```

### Environment-Specific Configuration

```javascript
// nalth.config.ts
export default defineConfig({
  security: {
    // Development settings
    ...(process.env.NODE_ENV === 'development' && {
      csp: {
        directives: {
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
      },
    }),

    // Production settings
    ...(process.env.NODE_ENV === 'production' && {
      audit: {
        failOnViolations: true,
      },
      csp: {
        directives: {
          'script-src': ["'self'"],
        },
      },
    }),
  },
})
```

## 🔌 Plugin Compatibility

Nalth maintains 100% compatibility with existing Vite plugins:

```javascript
import { defineConfig } from 'nalth'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(), // Works exactly as with Vite
    // Any other Vite plugins work unchanged
  ],

  // Nalth-specific security features
  security: {
    // Security configuration
  },
})
```

## 🛠️ Advanced Features

### Custom Security Middleware

```javascript
import { createSecurityMiddleware } from 'nalth'

const customSecurity = createSecurityMiddleware({
  csp: {
    directives: {
      'connect-src': ["'self'", 'https://api.example.com'],
    },
  },
})

// Use in custom server
app.use(customSecurity)
```

### SRI Hash Generation

```javascript
import { generateSRIHash } from 'nalth'

const hash = generateSRIHash(fileContent, 'sha384')
console.log(hash) // sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC
```

### Security Auditing

```javascript
import { auditCode } from 'nalth'

const { violations, safe } = auditCode(sourceCode, [
  'eval\\(',
  'innerHTML\\s*=',
])

if (!safe) {
  console.warn('Security violations found:', violations)
}
```

## 📋 Migration from Vite

Migrating from Vite to Nalth is seamless:

1. **Replace package**: `npm uninstall vite && npm install nalth`
2. **Update imports**: Change `import { defineConfig } from 'vite'` to `import { defineConfig } from 'nalth'`
3. **Update CLI**: Change `vite` commands to `nalth`
4. **Configure security**: Add security configuration as needed

That's it! Your existing Vite configuration and plugins will work unchanged.

## 🚨 Security Best Practices

1. **Keep certificates secure**: Don't commit auto-generated certificates to version control
2. **Test CSP thoroughly**: Use `reportOnly: true` during development
3. **Monitor security violations**: Set up CSP reporting endpoints
4. **Regular audits**: Enable `failOnViolations: true` in CI/CD
5. **Update dependencies**: Keep Nalth and plugins updated

## 🤝 Contributing

Nalth welcomes security-focused contributions. Please review our security guidelines before submitting PRs.

## 📄 License

MIT License - same as Vite.js

---

**Nalth**: Security-first web development, Vite-compatible. 🛡️
