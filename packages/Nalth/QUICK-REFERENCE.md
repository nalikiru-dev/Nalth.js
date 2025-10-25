# 🚀 NALTH Quick Reference Card

## Essential Commands (Security-First Unified Toolchain)

### 📦 Installation & Setup
```bash
npm install -g nalth@2.2.0
nalth --version
nalth --help
```

### 🔧 Initialize New Project
```bash
npx create-nalth my-app
cd my-app

# Initialize all tools
nalth test:init      # Vitest testing
nalth lint:init      # ESLint + security
nalth fmt:init       # Prettier
nalth security:init  # Security config
nalth run:init       # Task runner
```

### 💻 Development
```bash
nalth dev            # Start dev server (HTTPS by default)
nalth dev --port 3000
nalth dev --open
```

### 🧪 Testing
```bash
nalth test           # Watch mode
nalth test --run     # Run once
nalth test --coverage
nalth test --ui      # Interactive UI
nalth test --security
```

### 🔍 Code Quality
```bash
nalth lint           # Lint with security checks
nalth lint --fix     # Auto-fix issues
nalth lint --security
nalth fmt            # Format code
nalth fmt --check    # Check formatting
```

### 🔒 **SECURE PACKAGE MANAGEMENT** ⭐
```bash
# ✅ Typosquatting detection
# ✅ Malicious package scanning
# ✅ Vulnerability scanning
# ✅ License compliance
# ✅ Integrity verification

nalth install <package>        # Secure install
nalth install axios react-query
nalth install lodash -D        # Dev dependency
nalth install --use-bun        # Use Bun PM
nalth uninstall <package>      # Uninstall
```

### 🏗️ Build & Deploy
```bash
nalth build          # Production build
nalth preview        # Preview build
nalth audit          # Security audit
nalth security:report
```

### 🚀 Task Runner
```bash
nalth run build      # Run with cache
nalth run test --parallel
nalth run build --force
```

### 📚 Library Development
```bash
nalth lib            # Build library
nalth lib --watch    # Watch mode
```

### 🎨 Developer Tools
```bash
nalth ui             # Open GUI devtools
```

---

## 🔐 Security Features Highlight

### Secure Install Protection
- **Typosquatting**: Detects `raect` → should be `react`
- **Malicious Patterns**: Scans for suspicious code
- **Vulnerability Scan**: Checks before installation
- **License Check**: Ensures compliance
- **Integrity Verify**: Validates checksums

### Security Commands
```bash
nalth audit                    # Full audit
nalth audit --fix              # Auto-fix vulnerabilities
nalth security:scan <pkg>      # Scan specific package
nalth security:report          # Generate report
```

---

## 📊 Workflow Examples

### Daily Development
```bash
nalth dev           # Terminal 1: Dev server
nalth test          # Terminal 2: Tests
nalth lint --fix    # Before commit
nalth audit         # Weekly
```

### CI/CD Pipeline
```bash
nalth install --frozen --production
nalth lint --max-warnings 0
nalth test --run --coverage
nalth audit --severity high
nalth build
```

### Pre-Commit Hook
```bash
nalth fmt
nalth lint --fix
nalth test --run
```

---

## 💡 Pro Tips

1. Use `nalth i` instead of `npm install` for security
2. Run `nalth audit` before every deployment
3. Enable `--security` flag for extra protection
4. Use `--frozen` in CI/CD for reproducible builds
5. Leverage `nalth run` for fast task caching

---

## 🆘 Quick Troubleshooting

```bash
# Clear cache
rm -rf .nalth/cache

# Reinstall dependencies
nalth install --force

# Debug mode
NALTH_DEBUG=1 nalth dev

# Check version
nalth --version

# Get help
nalth <command> --help
```

---

## 🔗 Links

- **Full Commands**: See `CLI-COMMANDS.md`
- **Changelog**: See `CHANGELOG-v2.2.0.md`
- **Implementation**: See `IMPLEMENTATION-SUMMARY.md`
- **Documentation**: Coming soon at docs.nalth.dev

---

**NALTH v2.2.0** - Security First, Developer Experience Always 🛡️⚡
