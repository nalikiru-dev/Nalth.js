# 🖥️ CLI Reference

**Complete NALTH Command Line Interface Documentation**

The NALTH CLI provides powerful commands for creating, building, and securing your applications. All commands include built-in security features and enterprise-grade protection.

---

## 📥 Installation

### Global Installation

```bash
# Install NALTH CLI globally
npm install -g nalth

# Or use with npx (recommended)
npx create-nalth@latest my-app
```

### Local Installation

```bash
# Install in existing project
npm install nalth --save-dev

# Use local installation
npx nalth dev
```

---

## 🚀 Project Creation

### `create-nalth`

**Create a new secure NALTH project**

```bash
# Interactive mode with beautiful CLI
npx create-nalth@latest

# Specify project name
npx create-nalth@latest my-secure-app

# Use specific template
npx create-nalth@latest my-app --template nalth-react

# Quick creation with all options
npx create-nalth@latest my-app --template nalth-vue --overwrite
```

#### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--template <name>` | `-t` | Specify framework template | Interactive |
| `--overwrite` | | Overwrite existing directory | `false` |
| `--help` | `-h` | Show help message | |

#### Available Templates

```bash
# Frontend Templates
--template nalth-vanilla     # Pure TypeScript
--template nalth-react       # React + TypeScript  
--template nalth-vue         # Vue.js + TypeScript
--template nalth-svelte      # Svelte + TypeScript
--template nalth-preact      # Preact + TypeScript
--template nalth-lit         # Lit + TypeScript
--template nalth-solid       # SolidJS + TypeScript
--template nalth-qwik        # Qwik + TypeScript
```

#### Examples

```bash
# Create React app with security
npx create-nalth@latest my-secure-app --template nalth-react

# Create Vue.js enterprise app
npx create-nalth@latest enterprise-app --template nalth-vue

# Create vanilla TypeScript app
npx create-nalth@latest vanilla-app --template nalth-vanilla
```

---

## 🔧 Development Commands

### `nalth dev`

**Start development server with security monitoring**

```bash
# Start development server
nalth dev

# Custom port
nalth dev --port 3001

# Custom host  
nalth dev --host 0.0.0.0

# Enable debug mode
nalth dev --debug

# Force HTTPS (already enabled by default)
nalth dev --https

# Disable security dashboard
nalth dev --no-dashboard
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--port <number>` | Port number | `3000` |
| `--host <string>` | Host address | `localhost` |
| `--https` | Force HTTPS | `true` |
| `--open` | Open browser | `false` |
| `--cors` | Enable CORS | `false` |
| `--debug` | Debug mode | `false` |
| `--dashboard` | Security dashboard | `true` |
| `--strictPort` | Exit if port busy | `false` |

#### Security Features Active in Dev Mode

- ✅ **HTTPS with TLS 1.3** - Auto-generated SSL certificates
- ✅ **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
- ✅ **Real-time Monitoring** - Security dashboard at `/__nalth`
- ✅ **CSP Violation Tracking** - Automatic policy enforcement
- ✅ **Vulnerability Scanning** - Background dependency auditing

#### Examples

```bash
# Standard development
nalth dev

# Development on custom port with HTTPS
nalth dev --port 8080 --https

# Debug mode with security monitoring
nalth dev --debug --dashboard

# Network accessible development
nalth dev --host 0.0.0.0 --port 3000
```

---

## 🏗️ Build Commands

### `nalth build`

**Build for production with security optimizations**

```bash
# Standard production build
nalth build

# Build with source maps
nalth build --sourcemap

# Build with detailed output
nalth build --verbose

# Build with security report
nalth build --security-report

# Build with SRI generation
nalth build --sri
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--outDir <dir>` | Output directory | `dist` |
| `--sourcemap` | Generate source maps | `false` |
| `--sri` | Generate SRI hashes | `true` |
| `--minify` | Minify output | `true` |
| `--security-report` | Generate security report | `false` |
| `--verbose` | Detailed output | `false` |
| `--analyze` | Bundle analysis | `false` |

#### Security Optimizations in Build

- ✅ **Subresource Integrity (SRI)** - Automatic hash generation
- ✅ **Security Headers** - Production-ready header configuration  
- ✅ **Code Minification** - Secure minification with integrity checks
- ✅ **Bundle Analysis** - Security-focused bundle optimization
- ✅ **Asset Verification** - Integrity verification for all assets

#### Examples

```bash
# Production build with security features
nalth build --sri --security-report

# Development build with source maps
nalth build --sourcemap --verbose

# Analyze bundle security
nalth build --analyze --security-report
```

### `nalth preview`

**Preview production build locally with security**

```bash
# Preview production build
nalth preview

# Custom port
nalth preview --port 4173

# Enable HTTPS for preview
nalth preview --https

# Open browser automatically
nalth preview --open
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--port <number>` | Port number | `4173` |
| `--host <string>` | Host address | `localhost` |
| `--https` | Enable HTTPS | `true` |
| `--open` | Open browser | `false` |

---

## 🔍 Security Commands

### `nalth audit`

**Comprehensive security vulnerability scanning**

```bash
# Full security audit
nalth audit

# Audit with specific severity level
nalth audit --level strict

# Audit with auto-fix
nalth audit --fix

# Audit dev dependencies
nalth audit --dev

# Audit specific packages
nalth audit --filter "react,vue"

# Generate detailed report
nalth audit --format html --output security-report.html

# Continuous monitoring
nalth audit --watch
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--level <level>` | Audit level: `low`, `moderate`, `high`, `strict` | `high` |
| `--fix` | Auto-fix vulnerabilities | `false` |
| `--dev` | Include dev dependencies | `false` |
| `--format <format>` | Report format: `json`, `html`, `sarif` | `json` |
| `--output <file>` | Output file path | `stdout` |
| `--filter <packages>` | Filter specific packages | |
| `--watch` | Continuous monitoring | `false` |
| `--sources <sources>` | Vulnerability sources: `npm`, `snyk`, `ossindex` | `npm,snyk` |

#### Audit Levels

```bash
# Low - Only critical vulnerabilities  
nalth audit --level low

# Moderate - Critical and high vulnerabilities
nalth audit --level moderate  

# High - Critical, high, and moderate vulnerabilities
nalth audit --level high

# Strict - All vulnerabilities including low severity
nalth audit --level strict
```

#### Examples

```bash
# Complete security audit
nalth audit --level strict --format html --output security-audit.html

# Auto-fix critical vulnerabilities
nalth audit --level high --fix

# Monitor dependencies continuously
nalth audit --watch --level strict

# Audit production dependencies only
nalth audit --level high --no-dev
```

### `nalth security:report`

**Generate comprehensive security reports**

```bash
# Generate security report
nalth security:report

# HTML report with charts
nalth security:report --format html --charts

# JSON report for automation
nalth security:report --format json --output security.json

# Include all security metrics
nalth security:report --include-all

# Send report via webhook
nalth security:report --webhook https://your-monitoring.com/webhook
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--format <format>` | Report format: `json`, `html`, `pdf`, `sarif` | `html` |
| `--output <file>` | Output file path | Auto-generated |
| `--charts` | Include visual charts | `false` |
| `--include-all` | Include all metrics | `false` |
| `--webhook <url>` | Webhook URL for reporting | |
| `--email <email>` | Email report to address | |

### `nalth security:headers`

**Test and validate security headers**

```bash
# Test local development server
nalth security:headers http://localhost:3000

# Test production URL
nalth security:headers https://your-app.com

# Test specific headers
nalth security:headers https://your-app.com --headers hsts,csp

# Generate header report
nalth security:headers https://your-app.com --report
```

### `nalth security:csp`

**Content Security Policy utilities**

```bash
# Validate CSP configuration
nalth security:csp validate

# Generate CSP from code analysis
nalth security:csp generate --scan-dir ./src

# Test CSP compliance
nalth security:csp test http://localhost:3000

# Monitor CSP violations
nalth security:csp monitor --endpoint /csp-violations
```

---

## 🔧 Configuration Commands

### `nalth config`

**Manage NALTH configuration**

```bash
# Show current configuration
nalth config show

# Validate configuration
nalth config validate

# Generate default configuration
nalth config init

# Set configuration values
nalth config set security.https.enabled true

# Get configuration value
nalth config get security.audit.level
```

#### Examples

```bash
# Initialize NALTH configuration
nalth config init

# Enable strict security mode
nalth config set security.level strict

# Show security configuration
nalth config show --filter security
```

---

## 📊 Monitoring Commands

### `nalth monitor`

**Real-time security monitoring**

```bash
# Start security monitoring
nalth monitor

# Monitor with dashboard
nalth monitor --dashboard

# Monitor specific metrics
nalth monitor --metrics vulnerabilities,csp,headers

# Monitor with alerts
nalth monitor --alerts --webhook https://alerts.example.com

# Export monitoring data
nalth monitor --export monitoring-data.json
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dashboard` | Enable web dashboard | `true` |
| `--metrics <list>` | Specific metrics to monitor | `all` |
| `--alerts` | Enable alerting | `false` |
| `--webhook <url>` | Webhook for alerts | |
| `--interval <ms>` | Monitoring interval | `5000` |
| `--export <file>` | Export data file | |

---

## 🧪 Testing Commands

### `nalth test:security`

**Run security tests**

```bash
# Run all security tests
nalth test:security

# Test specific security features
nalth test:security --features https,csp,headers

# Test with coverage
nalth test:security --coverage

# Test against production URL
nalth test:security --url https://your-app.com
```

---

## 📦 Plugin Commands

### `nalth plugin`

**Manage NALTH plugins**

```bash
# List installed plugins
nalth plugin list

# Install security plugin
nalth plugin install @nalth/plugin-security-scanner

# Update all plugins
nalth plugin update

# Remove plugin
nalth plugin remove @nalth/plugin-custom
```

---

## 🌍 Environment Variables

### Security Configuration

```bash
# HTTPS Configuration
export NALTH_HTTPS_ENABLED=true
export NALTH_HTTPS_AUTO_GENERATE=true
export NALTH_HTTPS_CERT_DIR="./.nalth/certs"

# CSP Configuration
export NALTH_CSP_MODE=auto
export NALTH_CSP_REPORT_URI="/csp-violations"
export NALTH_CSP_NONCE=true

# Audit Configuration
export NALTH_AUDIT_LEVEL=strict
export NALTH_AUDIT_SOURCES="npm,snyk,ossindex"
export NALTH_AUDIT_AUTO_FIX=false

# Monitoring Configuration
export NALTH_MONITORING_ENABLED=true
export NALTH_MONITORING_INTERVAL=5000
export NALTH_MONITORING_DASHBOARD=true
```

### Development Environment

```bash
# Development server
export NALTH_DEV_PORT=3000
export NALTH_DEV_HTTPS=true
export NALTH_DEV_DEBUG=false

# Build configuration
export NALTH_BUILD_SOURCEMAP=true
export NALTH_BUILD_SRI=true
export NALTH_BUILD_MINIFY=true

# Production settings
export NODE_ENV=production
export NALTH_SECURITY_LEVEL=strict
export NALTH_CSP_REPORT_URI=https://your-app.com/csp-violations
```

---

## 🔧 Configuration File

### `nalth.config.ts`

```typescript
// Complete NALTH configuration example
import { defineConfig } from 'nalth'

export default defineConfig({
  // Standard Vite options work unchanged
  plugins: [],
  server: {
    port: 3000,
    https: true,  // Managed by NALTH security
  },
  
  // NALTH security configuration
  security: {
    // HTTPS settings
    https: {
      enabled: true,
      autoGenerate: true,
      force: true
    },
    
    // Content Security Policy  
    csp: {
      mode: 'auto',
      reportUri: '/csp-violations',
      nonce: true
    },
    
    // Security headers
    headers: {
      hsts: true,
      frameOptions: 'DENY',
      contentTypeOptions: true,
      xssProtection: true
    },
    
    // Vulnerability auditing
    audit: {
      enabled: true,
      level: 'strict',
      sources: ['npm', 'snyk'],
      autoFix: false
    },
    
    // Real-time monitoring
    monitoring: {
      enabled: true,
      dashboard: true,
      interval: 5000,
      alerts: {
        enabled: true,
        webhook: 'https://alerts.example.com'
      }
    }
  }
})
```

---

## 🚨 Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Configuration error |
| `3` | Security vulnerability detected |
| `4` | Build failed |
| `5` | Network error |
| `6` | Permission denied |
| `10` | Critical security issue |

---

## 🎯 Common Workflows

### Development Workflow

```bash
# 1. Create new project
npx create-nalth@latest my-app --template nalth-react

# 2. Enter project directory
cd my-app

# 3. Install dependencies
npm install

# 4. Start development with security monitoring
nalth dev --dashboard

# 5. Run security audit
nalth audit --level strict

# 6. Generate security report
nalth security:report --format html
```

### Production Deployment Workflow

```bash
# 1. Run comprehensive security audit
nalth audit --level strict --format sarif

# 2. Build for production
nalth build --sri --security-report

# 3. Preview production build
nalth preview --https

# 4. Test security headers
nalth security:headers http://localhost:4173

# 5. Deploy with monitoring
nalth monitor --dashboard --alerts
```

### CI/CD Integration

```yaml
# .github/workflows/security.yml
name: Security Pipeline
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: nalth audit --level strict --format sarif --output security.sarif
      - run: nalth build --sri --security-report
      - run: nalth test:security --coverage
```

---

## 🆘 Troubleshooting

### Common Issues

**SSL Certificate Issues**
```bash
# Clear certificate cache
rm -rf ./.nalth/certs/
nalth dev
```

**Port Already in Use**
```bash
# Use different port
nalth dev --port 3001
```

**CSP Violations**
```bash
# Check CSP configuration
nalth security:csp validate
nalth security:csp monitor
```

**Build Failures**
```bash
# Debug build process
nalth build --verbose --debug
```

### Getting Help

```bash
# Show help for any command
nalth --help
nalth dev --help
nalth audit --help

# Show version information
nalth --version

# Show configuration
nalth config show
```

---

## 📚 Learn More

- [Configuration Guide](../guide/configuration.md) - Detailed configuration options
- [Security Features](../security/overview.md) - Complete security documentation
- [API Reference](../api/overview.md) - Programmatic API usage
- [Examples](../examples/overview.md) - Practical implementation examples

---

**NALTH CLI**: Powerful, secure, and developer-friendly. 🛡️⚡

*Need help with a specific command? Use `nalth <command> --help` for detailed information.*