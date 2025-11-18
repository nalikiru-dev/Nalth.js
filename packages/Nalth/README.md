[banner](./banner.png)

# Nalth.JS

**The Security-First Unified Toolchain for the Web**

Welcome to NALTH, the world's first security-first web development framework. Built on TypeScript and powered by a security-enhanced Vite.js foundation, NALTH makes enterprise-grade security effortless while maintaining lightning-fast development speeds.

**Now with Vite+ Inspired Features:** Everything you need in one unified toolchain - dev, build, test, lint, fmt, run, ui, and lib commands - all with security-first enhancements.

---

## 🚀 Quick Navigation

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">

### [🏁 Getting Started](./guide/getting-started.md)

**New to NALTH?** Start here! Learn how to create your first secure application in under 2 minutes.

- [Installation](./guide/installation.md)
- [Your First Project](./guide/first-project.md)
- [CLI Reference](./reference/cli.md)

### [🔧 Configuration](./guide/configuration.md)

**Customize your security.** Learn how to configure NALTH for your specific security requirements.

- [Security Configuration](./guide/security-config.md)
- [HTTPS Setup](./guide/https-setup.md)
- [Environment Variables](./reference/env-variables.md)

### [🛡️ Security Features](./security/overview.md)

**Enterprise-grade protection.** Explore NALTH's comprehensive security features and best practices.

- [HTTPS by Default](./security/https.md)
- [Content Security Policy](./security/csp.md)
- [Security Headers](./security/headers.md)
- [Vulnerability Scanning](./security/auditing.md)

### [📚 API Reference](./api/overview.md)

**Complete API documentation.** Detailed reference for all NALTH APIs, plugins, and configuration options.

- [Configuration API](./api/config.md)
- [Security API](./api/security.md)
- [Plugin API](./api/plugins.md)
- [Build API](./api/build.md)

### [🎯 Examples](./examples/overview.md)

**Learn by doing.** Real-world examples and templates for common use cases.

- [React Security App](./examples/react-security.md)
- [Vue.js Enterprise](./examples/vue-enterprise.md)
- [Node.js API Security](./examples/node-api.md)
- [Full-Stack Security](./examples/full-stack.md)

### [🏢 Enterprise](./guide/enterprise.md)

**Production-ready security.** Advanced features for enterprise environments and compliance.

- [OWASP Compliance](./security/owasp.md)
- [SOC2 Guidelines](./security/soc2.md)
- [GDPR Compliance](./security/gdpr.md)
- [Monitoring & Alerts](./guide/monitoring.md)

</div>

---

## 🌟 What Makes NALTH Special?

### ⚡ **Unified Toolchain with Security-First Approach**

```bash
# Create a secure app with one command
npx create-nalth my-secure-app --template nalth-react

# Security features work out of the box:
# ✅ HTTPS with auto-generated certificates
# ✅ Content Security Policy auto-generation
# ✅ Security headers configuration
# ✅ Real-time vulnerability scanning

# Complete development workflow in one tool:
nalth dev          # Start dev server
nalth build        # Production build
nalth test         # Run tests with Vitest
nalth lint         # Lint with ESLint + security checks
nalth fmt          # Format with Prettier
nalth run build    # Run tasks with smart caching
nalth ui           # Open advanced devtools
nalth lib          # Build libraries
nalth audit        # Security audit
```

### 🔒 **Enterprise-Grade Protection**

- **OWASP Top 10 Protection** - Built-in defenses against the most critical security risks
- **Real-time Security Dashboard** - Monitor threats and security posture in real-time
- **Automated Vulnerability Scanning** - Continuous dependency and code security auditing
- **Compliance Ready** - SOC2, GDPR, and enterprise security standards support

### 🚀 **Developer Experience First**

- **100% Vite.js Compatibility** - All existing Vite plugins and configurations work unchanged
- **TypeScript Native** - Full type safety with comprehensive TypeScript support
- **Hot Reload with Security** - Lightning-fast development with security monitoring
- **Beautiful Security UI** - Professional security dashboards and monitoring interfaces

### 🛠️ **Complete Unified Toolchain**

All the tools you need in one command-line interface:

#### Development & Build
- `nalth dev` - Start dev server with HTTPS
- `nalth build` - Production build with security optimizations
- `nalth preview` - Preview production build

#### Testing & Quality
- `nalth test` - Run tests with Vitest (Jest-compatible API)
- `nalth test --ui` - Open interactive test UI
- `nalth test --coverage` - Generate coverage reports
- `nalth test --security` - Security-enhanced testing

#### Code Quality
- `nalth lint` - ESLint with security plugins (100x faster potential with Oxlint)
- `nalth lint --fix` - Auto-fix issues
- `nalth lint --security` - Security-focused linting
- `nalth fmt` - Format with Prettier
- `nalth fmt --check` - Check formatting in CI

#### Task Runner
- `nalth run <task>` - Smart task runner with caching (Turborepo/Nx alternative)
- `nalth run build --cache` - Cached task execution
- `nalth run test --parallel` - Parallel task execution

#### Library Development
- `nalth lib` - Build libraries with best practices
- `nalth lib --watch` - Watch mode for libraries
- DTS generation & bundling included

#### Security-First Package Management
- `nalth install <package>` - **Secure package installation**
  - ✅ Typosquatting detection
  - ✅ Malicious package scanning
  - ✅ Pre-installation vulnerability checks
  - ✅ License compliance verification
  - ✅ Post-installation audits
  - ✅ Package integrity verification
- `nalth audit` - Comprehensive security audit
- `nalth security:report` - Generate security reports
- `nalth security:scan <package>` - Scan specific packages

#### Developer Tools
- `nalth ui` - Advanced GUI devtools
- Transform pipeline inspector
- Module dependency graph visualization
- Bundle analyzer

### 📊 **Real-Time Security Monitoring**

- **Interactive Security Dashboard** - Live metrics and threat visualization
- **CSP Violation Tracking** - Real-time Content Security Policy monitoring
- **Dependency Audit Alerts** - Instant notifications for vulnerable dependencies
- **Security Event Logging** - Comprehensive audit trails and security events

---

## 🚀 Quick Start

```bash
# Install Nalth
npm install -g nalth

# Create a new secure project
npx create-nalth my-secure-app
cd my-secure-app

# Initialize all tooling
nalth test:init
nalth lint:init
nalth fmt:init
nalth security:init

# Start development
nalth dev

# In another terminal - run tests
nalth test

# Install packages securely
nalth install axios react-query

# Run security audit
nalth audit

# Format code
nalth fmt

# Lint with security checks
nalth lint --security

# Build for production
nalth build

# Preview production build
nalth preview
```

## 📖 Documentation Sections

### 🎓 **Learning Path**

**Beginner → Intermediate → Advanced**

1. **[Getting Started](./guide/getting-started.md)** - Install NALTH and create your first secure app
2. **[Core Concepts](./guide/core-concepts.md)** - Understand NALTH's security-first architecture
3. **[Security Features](./security/overview.md)** - Learn about built-in security protections
4. **[Configuration Guide](./guide/configuration.md)** - Customize NALTH for your needs
5. **[Plugin Development](./guide/plugin-development.md)** - Build security-focused plugins
6. **[Production Deployment](./guide/deployment.md)** - Deploy secure applications to production

### 🎯 **By Use Case**

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">

#### **Frontend Applications**

- [React + Security](./examples/react-security.md)
- [Vue.js Enterprise](./examples/vue-enterprise.md)
- [Svelte Security](./examples/svelte-security.md)
- [Vanilla TypeScript](./examples/vanilla-security.md)

#### **Full-Stack Applications**

- [Node.js API Security](./examples/node-api.md)
- [Express.js + NALTH](./examples/express-security.md)
- [Authentication & Authorization](./examples/auth-security.md)
- [Database Security](./examples/database-security.md)

#### **Enterprise Features**

- [Multi-tenant Security](./examples/multi-tenant.md)
- [Microservices Security](./examples/microservices.md)
- [CI/CD Security Pipeline](./examples/cicd-security.md)
- [Monitoring & Alerting](./examples/monitoring.md)

</div>

### 🛡️ **Security-First Architecture**

```mermaid
graph TB
    A[NALTH Core] --> B[Security Middleware]
    A --> C[Build Pipeline]
    A --> D[Dev Server]

    B --> E[HTTPS Handler]
    B --> F[CSP Generator]
    B --> G[Security Headers]
    B --> H[Vulnerability Scanner]

    C --> I[Asset Security]
    C --> J[Bundle Analysis]
    C --> K[SRI Generation]

    D --> L[Real-time Monitoring]
    D --> M[Security Dashboard]
    D --> N[Hot Reload + Security]
```

---

## 🆘 Need Help?

### 📞 **Support Channels**

- **[GitHub Issues](https://github.com/nalikiru-dev/nalth.js/issues)** - Bug reports and feature requests
- **[Discussions](https://github.com/nalikiru-dev/nalth.js/discussions)** - Community support and questions
- **[Discord Server](https://discord.gg/nalth)** - Real-time community chat
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/nalth)** - Technical Q&A with `nalth` tag

### 📚 **Additional Resources**

- **[Migration Guide](./guide/migration.md)** - Moving from Vite.js or other build tools
- **[Troubleshooting](./guide/troubleshooting.md)** - Common issues and solutions
- **[FAQ](./guide/faq.md)** - Frequently asked questions
- **[Changelog](./reference/changelog.md)** - Version history and updates

### 🔐 **Security Resources**

- **[Security Policy](https://github.com/nalikiru-dev/nalth.js/security/policy)** - Vulnerability reporting
- **[Security Advisories](./security/advisories.md)** - Security updates and alerts
- **[Best Practices](./security/best-practices.md)** - Security implementation guidelines
- **[Compliance Guides](./security/compliance.md)** - Industry standards and regulations

---

## 🤝 Contributing

NALTH is open source and we welcome contributions! Check out our:

- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute to NALTH
- **[Code of Conduct](../CODE_OF_CONDUCT.md)** - Community guidelines
- **[Development Setup](./guide/development.md)** - Setting up the development environment
- **[Architecture Guide](./guide/architecture.md)** - Understanding NALTH's internals

---

## 📄 License

NALTH is [MIT licensed](../LICENSE) - the same as Vite.js to maintain ecosystem compatibility.

---

<div class="text-center my-12">
  <h2>🚀 Ready to Build Secure Applications?</h2>
  <p class="text-lg text-gray-600 mb-6">
    Join thousands of developers who trust NALTH for enterprise-grade security
  </p>
  
  <div class="flex justify-center gap-4">
    <a href="./guide/getting-started.md" class="btn-primary">Get Started</a>
    <a href="./examples/overview.md" class="btn-secondary">View Examples</a>
    <a href="https://github.com/nalikiru-dev/nalth.js" class="btn-outline">GitHub</a>
  </div>
</div>

---

**NALTH**: Where Security Meets Speed. Built for the modern web. 🛡️⚡
