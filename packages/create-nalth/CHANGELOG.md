# Changelog - create-nalth


![Nalth - Security-First Unified Toolchain](./1.jpg)

All notable changes to the create-nalth package will be documented in this file.

## [2.2.1] - 2025-10-25

### 🎉 Major Release - Unified Toolchain Support

This release aligns create-nalth with **Nalth v2.2.0**, bringing a complete unified toolchain to all templates.

### ✨ Added

#### Unified Toolchain Scripts
- **Testing**: Added `test`, `test:ui`, `test:coverage` scripts using Vitest
- **Linting**: Added `lint`, `lint:fix` scripts with ESLint + security plugins
- **Formatting**: Added `format`, `format:check` scripts using Prettier
- **Security**: Added `audit` script for comprehensive security auditing

#### Configuration Files
- **Vitest** (`vitest.config.ts`) - Test configuration with coverage support
- **ESLint** (`eslint.config.js`) - Linting with TypeScript and security plugins
- **Prettier** (`.prettierrc`) - Code formatting configuration
- **Test Setup** (`src/test/setup.ts`) - Test environment setup
- **Example Test** (`src/test/example.test.ts`) - Sample test file

#### Enhanced Documentation
- Comprehensive README.md for all templates
- Complete command reference
- Security features documentation
- Testing, linting, formatting guides
- Deployment best practices

### 🔄 Changed

- **Package Version**: Updated to 2.2.0
- **Nalth Dependency**: All templates now use `^2.2.0`
- **CLI Messages**: Enhanced help and success messages with unified toolchain features
- **Template Description**: Updated to reflect unified toolchain capabilities

### 📦 Templates Updated

All 8 templates now include:

1. **nalth-vanilla** - Pure TypeScript with enterprise security
2. **nalth-vue** - Vue.js with security middleware
3. **nalth-react** - React with shadcn/ui and security
4. **nalth-preact** - Lightweight Preact with enterprise features
5. **nalth-lit** - Lit web components with security
6. **nalth-svelte** - Svelte with built-in protection
7. **nalth-solid** - SolidJS with enterprise security
8. **nalth-qwik** - Qwik with zero-config security

### 🛡️ Security Features

All templates now support:

- ✅ Secure package installation with typosquatting detection
- ✅ Pre-installation vulnerability scanning
- ✅ License compliance checking
- ✅ Package integrity verification
- ✅ Real-time security monitoring
- ✅ CSP violation tracking

### 🎯 Developer Experience

- **Zero Config**: Everything works out of the box
- **Consistent Structure**: All templates follow the same pattern
- **Modern Tooling**: Latest versions of Vitest, ESLint, Prettier
- **Type Safety**: Full TypeScript support across all templates
- **Fast Feedback**: Instant linting, formatting, and testing

### 📝 Breaking Changes

None! This release is 100% backwards compatible.

---

## [2.1.97] - Previous Release

Previous releases focused on security-first development with HTTPS, CSP, and security headers.
