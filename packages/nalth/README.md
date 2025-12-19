![banner](./banner.png)

# 🛡️ Nalth.js

### **The Security-First Unified Toolchain for the Modern Web**

[![Version](https://img.shields.io/npm/v/nalth?color=blue&label=version)](https://www.npmjs.com/package/nalth)
[![License](https://img.shields.io/npm/l/nalth)](https://github.com/nalikiru-dev/nalth.js/blob/main/LICENSE)
[![Security Level](https://img.shields.io/badge/security-enterprise-green)](https://nalthjs.com/security)

Welcome to **Nalth**, the world's first security-first web development framework. Built on TypeScript and powered by a security-enhanced Vite.js foundation, Nalth makes enterprise-grade security effortless while maintaining lightning-fast development speeds.

---

## ⚡ Unified Toolchain

Everything you need in one unified interface. No more configuration hell or fragmented tools.

```bash
# Complete development workflow in one tool:
nalth dev          # 🚀 Start dev server with auto-HTTPS
nalth build        # 📦 Production-grade secure build
nalth test         # 🧪 Unit & E2E testing via Vitest
nalth lint         # 🔍 Security-aware linting (ESLint + Security)
nalth fmt          # ✨ Professional formatting (Prettier)
nalth run build    # 🏎️ Smart task runner with caching
nalth ui           # 🎨 Advanced security & dev dashboard
nalth lib          # 📚 Secure library bundling
nalth audit        # 🛡️ Deep security dependency scan
```

---

## 🌟 Why Nalth?

### 🛡️ **Security by Design, Not as an Afterthought**
Nalth isn't just a build tool; it's a security layer for your entire stack.
*   ✅ **Auto-HTTPS**: Zero-config SSL/TLS certificates for development.
*   ✅ **CSP Generation**: Automatic Content Security Policy management.
*   ✅ **Security Headers**: Standard-compliant HSTS, X-Frame-Options, and more.
*   ✅ **Vulnerability Shields**: Real-time protection against SSRF and SQL Injection.

### 🚀 **Developer Experience (DX) Optimized**
*   **Vite Native**: 100% compatible with the Vite ecosystem and plugins.
*   **Instant HMR**: Blazing fast hot module replacement.
*   **TypeScript First**: Deeply integrated type safety throughout the toolchain.

---

## 🏗️ Getting Started

Create a professional, secure application in seconds:

```bash
npx create-nalth@latest my-secure-app
cd my-secure-app
npm install
nalth dev
```

---

## 📖 Key Features

### **Secure Package Management**
`nalth install <package>` provides:
- **Typosquatting Detection**: Prevention against malicious look-alike packages.
- **Pre-Installation Audits**: Scans for known vulnerabilities before files hit your disk.
- **Integrity Verification**: Ensures package contents match expected signatures.

### **Enterprise-Grade Protection**
- **OWASP Top 10 Defense**: Built-in mitigations for the most common web risks.
- **Secure Fetch**: `safeFetch` prevents SSRF by blocking internal network access.
- **SQL Sanitizer**: Tagged templates for safe db queries.

---

## 🗺️ Documentation

Explore our comprehensive guides:

- [🏁 Getting Started](./guide/getting-started.md)
- [🛡️ Security Overview](./security/overview.md)
- [🔧 Configuration Reference](./guide/configuration.md)
- [🎯 Framework Examples](./examples/overview.md)
- [🏢 Enterprise Deployment](./guide/enterprise.md)

---

## 🤝 Community & Support

Join the security-first movement:

- **[GitHub Issues](https://github.com/nalikiru-dev/nalth.js/issues)** - Bug reports & feature requests
- **[Discord](https://discord.gg/nalth)** - Real-time support
- **[Security Policy](https://github.com/nalikiru-dev/nalth.js/security/policy)** - Disclose vulnerabilities securely

---

## 📄 License

Nalth is [MIT licensed](../LICENSE) — maintained for the modern, secure web.

**Nalth**: Where Security Meets Velocity. 🛡️⚡
