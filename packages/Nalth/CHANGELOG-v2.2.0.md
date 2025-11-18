# 🚀 NALTH v2.2.0 - Unified Toolchain Release

## 🎯 Overview

This major release transforms Nalth from a security-first Vite alternative into a **complete unified toolchain** for modern web development, inspired by Vite Plus but with enterprise-grade security features at its core.

---

## ✨ New Features

### 🧪 Testing Suite (`nalth test`)
- **Vitest Integration** - Jest-compatible API with native ESM support
- **Interactive UI Mode** - Beautiful test UI with `--ui` flag
- **Coverage Reports** - Built-in coverage with `--coverage`
- **Security-Enhanced Testing** - Test with security checks enabled
- **Multiple Test Modes** - Unit, integration, E2E, and browser testing
- **Auto-Install** - Automatically installs Vitest if missing
- **Configuration Init** - `nalth test:init` for quick setup

**Usage:**
```bash
nalth test                    # Watch mode
nalth test --run              # Run once
nalth test --coverage         # With coverage
nalth test --ui               # Interactive UI
nalth test --security         # Security checks
```

---

### 🔍 Linting (`nalth lint`)
- **ESLint Integration** - Full ESLint support with auto-configuration
- **Security Plugins** - Built-in security-focused linting rules
- **Auto-Fix** - Fix issues automatically with `--fix`
- **Strict Mode** - Enforce stricter rules with `--strict`
- **Multiple Formats** - Stylish, JSON, compact, HTML output
- **Cache Support** - Fast linting with intelligent caching
- **Configuration Init** - `nalth lint:init` with security presets

**Security Plugins Included:**
- `eslint-plugin-security` - Detect security vulnerabilities
- `eslint-plugin-no-secrets` - Prevent secret leaks
- `eslint-plugin-xss` - XSS prevention

**Usage:**
```bash
nalth lint                    # Lint src/
nalth lint --fix              # Auto-fix
nalth lint --security         # Security rules
nalth lint --strict           # Strict mode
```

---

### ✨ Formatting (`nalth fmt`)
- **Prettier Integration** - Industry-standard code formatting
- **Check Mode** - Verify formatting without writing
- **Cache Support** - Fast formatting with cache
- **Multiple Parsers** - Support for TS, JS, JSX, JSON, CSS, etc.
- **Configuration Init** - `nalth fmt:init` for setup

**Usage:**
```bash
nalth fmt                     # Format all files
nalth fmt --check             # Check only
nalth fmt src/                # Format directory
```

---

### 🚀 Task Runner (`nalth run`)
- **Smart Caching** - Turborepo/Nx-style task caching
- **Parallel Execution** - Run tasks in parallel
- **Dependency Graph** - Intelligent task ordering
- **Cache Invalidation** - Smart cache based on file changes
- **Dry Run Mode** - See what would run with `--dry-run`
- **Configuration Init** - `nalth run:init` for setup

**Usage:**
```bash
nalth run build               # Run build task
nalth run build --cache       # Use cache
nalth run build --force       # Skip cache
nalth run test --parallel     # Parallel execution
```

---

### 📦 Library Bundling (`nalth lib`)
- **Rolldown Integration** - Fast, Rollup-compatible bundler
- **DTS Generation** - Automatic TypeScript definitions
- **Watch Mode** - Development mode with `--watch`
- **Multiple Formats** - ESM, CJS, UMD support
- **Tree Shaking** - Optimal bundle sizes
- **Configuration Init** - `nalth lib:init` for setup

**Usage:**
```bash
nalth lib                     # Build library
nalth lib --watch             # Watch mode
```

---

### 🎨 GUI Devtools (`nalth ui`)
- **Vitest UI** - Beautiful test runner UI
- **Transform Inspector** - View Vite transform pipeline
- **Dependency Graph** - Visualize module dependencies
- **Bundle Analyzer** - Analyze bundle composition

**Usage:**
```bash
nalth ui                      # Open devtools
```

---

### 🔒 Secure Package Management (`nalth install`)

**The most comprehensive secure package installation tool available.**

#### Security Features:
1. **Typosquatting Detection**
   - Levenshtein distance algorithm
   - Protects against common typos (e.g., `raect` → `react`)
   - Checks against popular package database

2. **Malicious Package Scanning**
   - Pattern matching for suspicious behavior
   - Detects obfuscated code
   - Identifies suspicious scripts

3. **License Compliance**
   - Automatic license checking
   - Configurable license whitelist/blacklist
   - GPL/AGPL warnings

4. **Pre-Installation Vulnerability Scanning**
   - NPM audit integration
   - CVE database checking
   - Severity-based blocking

5. **Post-Installation Audits**
   - Automatic security audit after install
   - Dependency tree analysis
   - Transitive dependency checking

6. **Package Integrity Verification**
   - Checksum verification
   - Registry signature validation
   - MITM attack prevention

7. **Multi-Package Manager Support**
   - Auto-detects npm, pnpm, yarn, bun
   - Respects lockfiles
   - Supports all package manager flags

**Usage:**
```bash
nalth install                 # Install all deps
nalth install react vue       # Install packages
nalth install lodash -D       # Dev dependency
nalth install --use-bun       # Use Bun
nalth install --production    # Prod only
nalth install --frozen        # Frozen lockfile
nalth install --registry URL  # Custom registry
```

**Uninstall:**
```bash
nalth uninstall lodash
nalth remove express cors
nalth rm unused-package
```

---

## 🔄 Enhanced Existing Features

### Security Commands
- **`nalth audit`** - Enhanced with new vulnerability database
- **`nalth security:report`** - More detailed reports
- **`nalth security:scan`** - Faster scanning

### Development
- **`nalth dev`** - Improved performance and security monitoring
- **`nalth build`** - Additional security optimizations
- **`nalth preview`** - Enhanced preview server

---

## 📦 New Peer Dependencies

The following packages are now peer dependencies (all optional):

```json
{
  "vitest": "^2.0.0",
  "eslint": "^9.0.0",
  "eslint-plugin-security": "^3.0.0",
  "eslint-plugin-no-secrets": "^1.0.0",
  "eslint-plugin-xss": "^0.1.0",
  "prettier": "^3.0.0"
}
```

All peer dependencies are marked as optional and will be auto-installed when needed.

---

## 📚 Documentation

### New Documentation Files
- **`CLI-COMMANDS.md`** - Complete CLI command reference
- **Updated `README.md`** - Unified toolchain overview
- **Quick Start Guide** - Get started in 5 minutes

### Documentation Sections
- Development workflows
- CI/CD examples
- Security best practices
- Command reference
- Configuration guides

---

## 🎯 Breaking Changes

### None! 

This release is **100% backwards compatible** with existing Nalth projects. All new features are additive.

---

## 🔧 Technical Improvements

### Architecture
- Modular command structure
- Lazy-loaded command imports
- Improved error handling
- Better CLI output with picocolors

### Performance
- Faster startup time with lazy imports
- Improved caching mechanisms
- Parallel task execution
- Optimized dependency scanning

### Security
- Enhanced vulnerability detection
- Improved typosquatting algorithm
- Better license compliance checking
- Comprehensive security auditing

---

## 📊 Comparison with Other Tools

| Feature | Nalth 2.2 | Vite + Tools | Next.js | Create React App |
|---------|-----------|--------------|---------|-------------------|
| Dev Server | ✅ | ✅ | ✅ | ✅ |
| Production Build | ✅ | ✅ | ✅ | ✅ |
| Testing (Vitest) | ✅ | Manual | Manual | ✅ (Jest) |
| Linting | ✅ | Manual | ⚠️ | ✅ |
| Formatting | ✅ | Manual | Manual | Manual |
| Task Runner | ✅ | Manual | Manual | Manual |
| Library Bundling | ✅ | Manual | ❌ | ❌ |
| Secure Install | ✅ | ❌ | ❌ | ❌ |
| Security Audit | ✅ | Manual | Manual | Manual |
| GUI Devtools | ✅ | Manual | ✅ | ⚠️ |
| **Setup Required** | **One CLI** | **5+ tools** | **One CLI** | **One CLI** |

---

## 🚀 Migration Guide

### From Nalth 2.1.x → 2.2.0

**No migration needed!** Just update:

```bash
npm install -g nalth@2.2.0
```

### Adopting New Features

**Initialize all tools:**
```bash
nalth test:init
nalth lint:init
nalth fmt:init
nalth security:init
nalth run:init
```

**Update package.json scripts:**
```json
{
  "scripts": {
    "dev": "nalth dev",
    "build": "nalth build",
    "test": "nalth test",
    "test:ui": "nalth test --ui",
    "test:coverage": "nalth test --coverage",
    "lint": "nalth lint",
    "lint:fix": "nalth lint --fix",
    "format": "nalth fmt",
    "format:check": "nalth fmt --check",
    "audit": "nalth audit",
    "preview": "nalth preview"
  }
}
```

---

## 🎉 What's Next?

### Roadmap for v2.3.0
- 🔧 **Oxlint Integration** - 100x faster linting
- 🎨 **Advanced UI Dashboard** - Real-time security monitoring
- 📊 **Analytics** - Build performance tracking
- 🔐 **SBOM Generation** - Software Bill of Materials
- 🌐 **Multi-Framework Support** - React, Vue, Svelte, Solid presets
- 🚀 **Edge Runtime** - Deploy to edge platforms

---

## 🙏 Acknowledgments

Inspired by:
- **Vite** - Blazing fast dev server
- **Vite Plus** - Unified toolchain concept
- **Vitest** - Modern testing framework
- **Turborepo** - Smart task caching
- **Socket.dev** - Package security scanning

---

## 📝 Full Changelog

### Added
- ✅ `nalth test` command with Vitest integration
- ✅ `nalth lint` command with ESLint and security plugins
- ✅ `nalth fmt` command with Prettier
- ✅ `nalth run` command with smart caching
- ✅ `nalth ui` command for GUI devtools
- ✅ `nalth lib` command for library bundling
- ✅ `nalth install` command with comprehensive security checks
- ✅ `nalth uninstall` command
- ✅ Typosquatting detection system
- ✅ Malicious package scanning
- ✅ License compliance checking
- ✅ Pre/post-installation vulnerability scanning
- ✅ Package integrity verification
- ✅ Multi-package manager support (npm, pnpm, yarn, bun)
- ✅ Comprehensive CLI documentation
- ✅ Quick start guide
- ✅ Command initialization helpers

### Changed
- 📝 Updated README with unified toolchain overview
- 📝 Enhanced package.json description and keywords
- 🔄 Version bumped to 2.2.0
- 🎨 Improved CLI output with better colors and formatting

### Fixed
- 🐛 Removed unused imports
- 🐛 Fixed lint errors
- 🔧 Improved error handling

---

## 📄 License

MIT © Nalth Team

---

**Ready to build secure web applications with the best developer experience?**

```bash
npm install -g nalth@2.2.0
nalth --help
```

🛡️ **Nalth - Security First, Developer Experience Always** ⚡
