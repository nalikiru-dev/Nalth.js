# 🏁 Getting Started with NALTH

**Create your first secure application in under 2 minutes**

Welcome to NALTH! This guide will walk you through creating your first secure web application with enterprise-grade security features enabled by default.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 20.19.0+** or **22.12.0+** installed
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- Basic knowledge of TypeScript/JavaScript and web development

## ⚡ Quick Start

### 1. Create Your Project

Choose your preferred framework and create a new NALTH project:

```bash
# Interactive project creation
npx create-nalth@latest

# Or specify template directly
npx create-nalth my-secure-app --template nalth-react
npx create-nalth my-secure-app --template nalth-vue
npx create-nalth my-secure-app --template nalth-vanilla
```

### 2. Navigate and Install

```bash
cd my-secure-app
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

🎉 **Congratulations!** Your secure application is now running at `https://localhost:3000` with:

- ✅ **HTTPS enabled** with auto-generated SSL certificates
- ✅ **Security headers** automatically configured
- ✅ **Content Security Policy** intelligently generated
- ✅ **Real-time security monitoring** active
- ✅ **Vulnerability scanning** running in the background

## 🛡️ What You Get Out of the Box

### Security Features

When you create a NALTH project, you automatically get:

| Feature | Status | Description |
|---------|--------|-------------|
| 🔒 **HTTPS by Default** | ✅ Active | TLS 1.3 encryption with auto-generated certificates |
| 🛡️ **Content Security Policy** | ✅ Active | Auto-generated CSP based on your code analysis |
| 🔧 **Security Headers** | ✅ Active | HSTS, X-Frame-Options, X-Content-Type-Options, etc. |
| 👁️ **Real-time Monitoring** | ✅ Active | Live security dashboard and threat detection |
| 🔍 **Vulnerability Scanning** | ✅ Active | Continuous dependency and code security auditing |
| 📊 **Security Dashboard** | ✅ Available | Interactive security metrics and monitoring |

### Development Experience

NALTH enhances your development workflow with:

- **🔥 Hot Module Replacement** - Lightning-fast updates with security checks
- **📊 Security Metrics** - Real-time security posture monitoring
- **🚨 Instant Alerts** - Immediate notification of security issues
- **🎨 Beautiful UI** - Professional security dashboard interfaces

## 📁 Project Structure

A typical NALTH project structure:

```
my-secure-app/
├── public/
│   ├── nalth.svg           # NALTH logo
│   └── vite.svg           # Framework logo
├── src/
│   ├── components/        # UI components (React/Vue/etc.)
│   ├── lib/              # Utility libraries
│   ├── assets/           # Static assets
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── nalth.config.ts       # NALTH configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
```

## 🔧 Configuration

NALTH works with zero configuration, but you can customize it for your needs:

```typescript
// nalth.config.ts
import { defineConfig } from 'nalth'

export default defineConfig({
  // All standard Vite options work unchanged
  plugins: [
    // Your existing Vite plugins work seamlessly
  ],
  
  // NALTH security configuration
  security: {
    // HTTPS configuration
    https: {
      enabled: true,           // Enable HTTPS (default: true)
      autoGenerate: true,      // Auto-generate certificates (default: true)
      force: true              // Redirect HTTP to HTTPS (default: true)
    },
    
    // Content Security Policy
    csp: {
      mode: 'auto',           // Auto-generate CSP (default: 'auto')
      reportUri: '/csp-report', // CSP violation reporting
      strict: true            // Enable strict CSP (default: true)
    },
    
    // Security headers
    headers: {
      hsts: true,             // HTTP Strict Transport Security
      frameOptions: 'DENY',   // X-Frame-Options
      contentTypeOptions: true, // X-Content-Type-Options
      xssProtection: true     // X-XSS-Protection
    },
    
    // Vulnerability scanning
    audit: {
      enabled: true,          // Enable vulnerability scanning
      level: 'strict',        // Audit level: 'low' | 'moderate' | 'high' | 'strict'
      autoFix: false         // Automatically fix vulnerabilities
    }
  },
  
  // Build optimizations
  build: {
    sourcemap: true,         // Generate source maps for debugging
    rollupOptions: {
      // Custom Rollup options
    }
  }
})
```

## 🎯 Available Templates

NALTH provides professionally designed templates for popular frameworks:

### 🔵 React Template (`nalth-react`)
```bash
npx create-nalth my-app --template nalth-react
```
- React 19 with TypeScript
- shadcn/ui components
- Interactive security dashboard
- Real-time security metrics
- Beautiful responsive design

### 🟢 Vue.js Template (`nalth-vue`)
```bash
npx create-nalth my-app --template nalth-vue
```
- Vue 3 with Composition API
- TypeScript support
- Security middleware integration
- Modern UI components

### 🟡 Vanilla TypeScript Template (`nalth-vanilla`)
```bash
npx create-nalth my-app --template nalth-vanilla
```
- Pure TypeScript with zero dependencies
- Built-in security utilities
- Interactive security dashboard
- Modern CSS with animations
- Professional responsive design

### Other Templates
- 🟣 **Preact** (`nalth-preact`) - Lightweight React alternative
- 🔴 **Lit** (`nalth-lit`) - Web components with security
- ⭐ **Svelte** (`nalth-svelte`) - Compiled security
- 💙 **SolidJS** (`nalth-solid`) - Fine-grained reactivity + security
- ⚡ **Qwik** (`nalth-qwik`) - Zero-config security

## 🚀 Next Steps

Now that you have NALTH running, here's what to explore next:

### 🔍 Explore Security Features
- Open the **Security Dashboard** at `https://localhost:3000/__nalth`
- View real-time security metrics and monitoring
- Test CSP violation detection
- Run security audits with `nalth audit`

### 📖 Learn Core Concepts
- [Core Concepts](../NALTH_SECURITY.md) - Understand NALTH's architecture
- [Security Features](../security/overview.md) - Deep dive into security capabilities
- [Configuration Guide](#configuration) - Customize NALTH for your needs

### 🎯 Build Something Real
- [React Security App Example](../examples/react-security.md)
- [Enterprise Security Tutorial](../NALTH_SECURITY.md)

### 🏢 Enterprise Features
- [OWASP Compliance](../NALTH_SECURITY.md)
- [Security Status](../CSP_IMPLEMENTATION_STATUS.md)

## 📊 Security Dashboard Overview

Your NALTH application includes a built-in security dashboard accessible at `/__nalth`:

![Security Dashboard Preview](../assets/security-dashboard.png)

### Dashboard Features:
- **📈 Security Score** - Real-time security posture rating
- **🔍 Vulnerability Scanner** - Live dependency and code scanning
- **🛡️ CSP Monitor** - Content Security Policy violation tracking
- **📊 Security Metrics** - HTTPS, headers, and protection status
- **🚨 Alert Center** - Security notifications and recommendations

## ⚙️ Development Commands

NALTH projects come with enhanced development commands:

```bash
# Development server with security monitoring
npm run dev

# Build for production with security optimizations  
npm run build

# Preview production build with security
npm run preview

# Run security audit
npm run security:audit

# Generate security report
npm run security:report

# Fix security vulnerabilities (where possible)
npm run security:fix
```

## 🛡️ Security Best Practices

To get the most out of NALTH's security features:

1. **Keep Dependencies Updated**
   ```bash
   npm run security:audit
   npm update
   ```

2. **Monitor Security Dashboard**
   - Check the dashboard regularly at `/__nalth`
   - Address any security warnings promptly

3. **Configure CSP Properly**
   - Review CSP violations in the dashboard
   - Adjust CSP settings as needed

4. **Use HTTPS in Production**
   - NALTH enforces HTTPS by default
   - Configure proper SSL certificates for production

5. **Regular Security Audits**
   - Run `npm run security:audit` before deployments
   - Set up automated security scanning in CI/CD

## 🆘 Troubleshooting

### Common Issues

**SSL Certificate Errors in Development**
```bash
# Clear certificate cache
rm -rf ./.nalth/certs/
npm run dev
```

**CSP Violations**
- Check the Security Dashboard for violation details
- Adjust CSP settings in `nalth.config.ts`
- Use `'unsafe-inline'` only for development

**Port Already in Use**
```bash
# Use custom port
npm run dev -- --port 3001
```

### Getting Help

- 📖 [Full Troubleshooting Guide](./troubleshooting.md)
- 💬 [GitHub Discussions](https://github.com/nalikiru-dev/nalth.js/discussions)
- 🐛 [Report Issues](https://github.com/nalikiru-dev/nalth.js/issues)

---

## 🎉 You're Ready!

Congratulations! You now have a secure, production-ready web application running with NALTH. The security features are working behind the scenes to protect your application while you focus on building great features.

**What's Next?**
- [Learn about Core Concepts](../NALTH_SECURITY.md)
- [Explore Security Features](../security/overview.md)  
- [Build a Real Application](../examples/react-security.md)
- [CLI Reference](../reference/cli.md)

---

**Need help?** Check out our [CLI reference](../reference/cli.md) or join the [NALTH community](https://discord.gg/nalth) for support and discussions.

**NALTH**: Where Security Meets Speed. 🛡️⚡