# 🛡️ Nalth Enhanced CSP Security Guide

## Overview

This guide covers the enhanced Content Security Policy (CSP) implementation in Nalth, providing enterprise-grade security while maintaining development productivity.

## ✨ Features

### 🔒 Enhanced Security

- **Comprehensive CSP directives** with secure defaults
- **Real-time violation reporting** and monitoring
- **Nonce generation** for inline scripts and styles
- **Production-ready configurations** with strict policies
- **Development-friendly settings** that don't break HMR

### 📊 Monitoring & Testing

- **CSP violation dashboard** at `/__nalth/csp-report`
- **Security health checks** at `/__nalth/health`
- **Automated CSP testing** and validation
- **Security scoring** and recommendations

### 🔧 Developer Experience

- **Zero-config security** with smart defaults
- **Framework-specific optimizations** for React, Vue, Svelte, etc.
- **Hot reload compatibility** with proper WebSocket policies
- **Detailed violation logging** with actionable insights

## 🚀 Quick Start

### Basic Configuration

```typescript
// nalth.config.ts
import { defineConfig } from 'nalth'

export default defineConfig({
  // Your existing config...

  security: {
    csp: {
      enabled: true,
      reportOnly: false, // Set to true for testing
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        // ... more directives
      },
      reportUri: '/__nalth/csp-report',
    },
  },
})
```

### Environment-Specific Configuration

```typescript
// Development vs Production
export default defineConfig({
  security: {
    csp: {
      enabled: true,
      reportOnly: process.env.NODE_ENV === 'development',
      directives: {
        'script-src':
          process.env.NODE_ENV === 'development'
            ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'localhost:*']
            : ["'self'"],
      },
    },
  },
})
```

## 📋 CSP Directives Explained

### Core Security Directives

| Directive     | Purpose                         | Nalth Default                                               |
| ------------- | ------------------------------- | ----------------------------------------------------------- |
| `default-src` | Fallback for all resource types | `'self'`                                                    |
| `script-src`  | JavaScript execution            | `'self'`, `'unsafe-inline'`, `'unsafe-eval'`, `localhost:*` |
| `style-src`   | CSS stylesheets                 | `'self'`, `'unsafe-inline'`, `fonts.googleapis.com`         |
| `img-src`     | Images                          | `'self'`, `data:`, `https:`, `blob:`                        |
| `connect-src` | AJAX, WebSocket, EventSource    | `'self'`, `ws:`, `wss:`, `localhost:*`                      |

### Security Hardening Directives

| Directive                   | Purpose                 | Nalth Default  |
| --------------------------- | ----------------------- | -------------- |
| `object-src`                | Plugins (Flash, etc.)   | `'none'`       |
| `frame-ancestors`           | Embedding in frames     | `'none'`       |
| `base-uri`                  | Base element URLs       | `'self'`       |
| `form-action`               | Form submission targets | `'self'`       |
| `upgrade-insecure-requests` | Force HTTPS             | `[]` (enabled) |

## 🔧 Framework-Specific Configurations

### React Applications

```typescript
// Optimized for React development
security: {
  csp: {
    directives: {
      'script-src': [
        "'self'",
        "'unsafe-inline'",  // React DevTools
        "'unsafe-eval'",   // Fast Refresh
        'localhost:*'      // Development server
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",  // CSS-in-JS libraries
        'fonts.googleapis.com'
      ]
    }
  }
}
```

### Vue Applications

```typescript
// Optimized for Vue development
security: {
  csp: {
    directives: {
      'script-src': [
        "'self'",
        "'unsafe-inline'",  // Vue DevTools
        "'unsafe-eval'",   // Template compilation
        'localhost:*'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",  // SFC styles
        'fonts.googleapis.com'
      ]
    }
  }
}
```

### Svelte Applications

```typescript
// Optimized for Svelte development
security: {
  csp: {
    directives: {
      'script-src': [
        "'self'",
        "'unsafe-inline'",  // Svelte runtime
        'localhost:*'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",  // Component styles
        'fonts.googleapis.com'
      ]
    }
  }
}
```

## 🚨 CSP Violation Monitoring

### Real-Time Monitoring

Nalth provides comprehensive CSP violation monitoring:

```bash
# View violations in development
curl http://localhost:5173/__nalth/csp-report

# Security dashboard
curl http://localhost:5173/__nalth/security

# Health check
curl http://localhost:5173/__nalth/health
```

### Violation Report Structure

```json
{
  "csp-report": {
    "document-uri": "http://localhost:5173/",
    "violated-directive": "script-src 'self'",
    "blocked-uri": "inline",
    "source-file": "http://localhost:5173/",
    "line-number": 42,
    "column-number": 15
  }
}
```

## 🧪 Testing Your CSP

### Automated Testing

```typescript
import { CSPTester, generateCSPReport } from 'nalth/security'

// Test your CSP configuration
const tester = new CSPTester(config.csp)
const results = await tester.runTests()

console.log(`Security Score: ${results.score}/100`)
console.log(await generateCSPReport(config.csp))
```

### Manual Testing

1. **Enable Report-Only Mode**

   ```typescript
   csp: {
     reportOnly: true, // Test without blocking
     // ... directives
   }
   ```

2. **Monitor Violations**
   - Check browser console for CSP violations
   - Review `/__nalth/csp-report` endpoint
   - Use browser DevTools Security tab

3. **Gradual Tightening**
   - Start with permissive policies
   - Remove `'unsafe-inline'` and `'unsafe-eval'` gradually
   - Test all application features

## 🏭 Production Deployment

### Production-Ready Configuration

```typescript
export default defineConfig({
  security: {
    csp: {
      enabled: true,
      reportOnly: false,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"], // No unsafe-* in production
        'style-src': ["'self'", 'fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https://api.yourdomain.com'],
        'font-src': ["'self'", 'fonts.gstatic.com'],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': [],
      },
      reportUri: '/api/csp-report', // Your reporting endpoint
    },
  },
})
```

### Security Headers

```typescript
headers: {
  hsts: {
    maxAge: 31536000,      // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameOptions: 'DENY',
  contentTypeOptions: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  coep: 'require-corp',
  coop: 'same-origin',
  corp: 'same-origin'
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Inline Scripts Blocked

**Problem**: CSP blocks inline JavaScript
**Solution**:

- Use external script files
- Implement nonce-based CSP
- Use event listeners instead of inline handlers

#### 2. CSS-in-JS Libraries Blocked

**Problem**: Dynamic styles are blocked
**Solution**:

- Allow `'unsafe-inline'` for development
- Use nonce-based CSP for production
- Consider CSS modules or external stylesheets

#### 3. Third-Party Resources Blocked

**Problem**: External APIs or CDNs are blocked
**Solution**:

- Add specific domains to `connect-src`
- Use `https:` for broader HTTPS access
- Whitelist specific resources

#### 4. WebSocket Connections Fail

**Problem**: HMR or real-time features don't work
**Solution**:

- Add `ws:` and `wss:` to `connect-src`
- Include `localhost:*` for development
- Check WebSocket URL patterns

### Debug Mode

Enable detailed CSP logging:

```typescript
security: {
  csp: {
    enabled: true,
    reportOnly: true, // Enable for debugging
    directives: {
      // ... your directives
    }
  },
  audit: {
    enabled: true,
    realTimeMonitoring: true
  }
}
```

## 📚 Best Practices

### 1. **Start Permissive, Tighten Gradually**

- Begin with `reportOnly: true`
- Monitor violations for a few days
- Remove unnecessary permissions

### 2. **Use Nonces for Production**

```typescript
// Generate nonces for inline scripts
'script-src': ["'self'", "'nonce-{GENERATED_NONCE}'"]
```

### 3. **Separate Dev/Prod Configs**

```typescript
const isDev = process.env.NODE_ENV === 'development'

security: {
  csp: {
    directives: {
      'script-src': isDev
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
        : ["'self'"]
    }
  }
}
```

### 4. **Monitor and Alert**

- Set up CSP violation alerts
- Regular security audits
- Monitor security score trends

### 5. **Test Thoroughly**

- Test all user flows
- Check third-party integrations
- Validate mobile compatibility

## 🚀 Advanced Features

### Custom CSP Middleware

```typescript
import { cspMiddlewarePlugin } from 'nalth/security'

export default defineConfig({
  plugins: [
    cspMiddlewarePlugin({
      csp: {
        // Custom CSP configuration
      },
    }),
  ],
})
```

### Dynamic CSP Generation

```typescript
// Generate CSP based on environment
const generateCSP = () => {
  const base = {
    'default-src': ["'self'"],
    'object-src': ["'none'"],
  }

  if (process.env.NODE_ENV === 'development') {
    return {
      ...base,
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    }
  }

  return {
    ...base,
    'script-src': ["'self'"],
  }
}
```

## 📊 Security Metrics

### CSP Security Score

The CSP tester provides a security score based on:

- **Directive Coverage** (40%): Essential directives present
- **Restriction Level** (30%): How restrictive the policies are
- **Best Practices** (20%): Following security recommendations
- **Vulnerability Prevention** (10%): Protection against common attacks

### Score Ranges

- **90-100**: Excellent security posture
- **70-89**: Good security with minor improvements needed
- **50-69**: Moderate security, several issues to address
- **Below 50**: Poor security, immediate attention required

## 🤝 Contributing

To contribute to Nalth's CSP implementation:

1. **Report Issues**: Use GitHub issues for bugs or feature requests
2. **Submit PRs**: Follow the contribution guidelines
3. **Security Reports**: Use responsible disclosure for security issues
4. **Documentation**: Help improve this guide

## 📄 License

This CSP implementation is part of Nalth and follows the same MIT license.

---

**Need Help?**

- 📖 [Nalth Documentation](https://www.nalthjs.com)
- 💬 [Community Discord](https://discord.gg/nalth)
- 🐛 [Report Issues](https://github.com/nalikiru-dev/nalth.js/issues)
