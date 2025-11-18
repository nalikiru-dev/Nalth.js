# 🛡️ NALTH CLI Commands Reference

Complete reference for all Nalth CLI commands with security-first features.

---

## 📦 Core Commands

### `nalth dev` / `nalth serve`
Start the development server with HTTPS and security monitoring.

```bash
nalth dev
nalth dev --port 3000
nalth dev --host 0.0.0.0
nalth dev --open
nalth dev --cors
nalth dev --force  # Force optimizer re-bundle
```

**Options:**
- `--host [host]` - Specify hostname (default: localhost)
- `--port <port>` - Specify port (default: 5173)
- `--open [path]` - Open browser on startup
- `--cors` - Enable CORS
- `--strictPort` - Exit if port is in use
- `--force` - Force optimizer to ignore cache

---

### `nalth build`
Build for production with security optimizations.

```bash
nalth build
nalth build --watch
nalth build --minify
nalth build --sourcemap
```

**Options:**
- `--target <target>` - Transpile target (default: 'baseline-widely-available')
- `--outDir <dir>` - Output directory (default: dist)
- `--assetsDir <dir>` - Assets directory under outDir (default: assets)
- `--sourcemap [output]` - Output source maps (boolean | "inline" | "hidden")
- `--minify [minifier]` - Enable/disable minification ("terser" | "esbuild")
- `--watch` - Rebuild when files change
- `--emptyOutDir` - Force empty outDir when outside of root

---

### `nalth preview`
Preview production build locally.

```bash
nalth preview
nalth preview --port 4173
nalth preview --open
```

**Options:**
- `--host [host]` - Specify hostname
- `--port <port>` - Specify port
- `--strictPort` - Exit if port is in use
- `--open [path]` - Open browser on startup
- `--outDir <dir>` - Output directory (default: dist)

---

## 🧪 Testing Commands

### `nalth test`
Run tests with Vitest and security checks.

```bash
nalth test                    # Watch mode
nalth test --run              # Run once
nalth test --coverage         # Generate coverage
nalth test --ui               # Open UI
nalth test --security         # Security-enhanced testing
nalth test src/auth.test.ts   # Run specific test
```

**Options:**
- `--watch` - Run tests in watch mode
- `--run` - Run tests once
- `--coverage` - Generate coverage report
- `--ui` - Open Vitest UI
- `--reporter <name>` - Test reporter
- `--mode <mode>` - Test mode (unit|integration|e2e|browser)
- `--security` - Run with security checks
- `--bail` - Stop on first failure
- `--threads` - Enable/disable threads
- `--isolate` - Enable/disable test isolation

### `nalth test:init`
Initialize test configuration with Vitest.

```bash
nalth test:init
nalth test:init --template react
```

---

## 🔍 Linting Commands

### `nalth lint`
Lint code with ESLint and security checks.

```bash
nalth lint                    # Lint src directory
nalth lint src/               # Lint specific directory
nalth lint --fix              # Auto-fix issues
nalth lint --security         # Security-focused linting
nalth lint --strict           # Use strict rules
```

**Options:**
- `--fix` - Automatically fix problems
- `--cache` - Use cache (default: true)
- `--security` - Run security-focused linting
- `--strict` - Use strict rules
- `--format <format>` - Output format (stylish|json|compact|html)
- `--quiet` - Report errors only
- `--max-warnings <number>` - Maximum warnings before error

### `nalth lint:init`
Initialize ESLint configuration with security plugins.

```bash
nalth lint:init
nalth lint:init --strict
nalth lint:init --security
```

---

## ✨ Formatting Commands

### `nalth fmt`
Format code with Prettier.

```bash
nalth fmt                     # Format all files
nalth fmt src/                # Format specific directory
nalth fmt --check             # Check without writing
nalth fmt --cache             # Use cache
```

**Options:**
- `--check` - Check formatting without writing
- `--write` - Write formatted files (default: true)
- `--cache` - Use cache (default: true)
- `--parser <parser>` - Specify parser
- `--config <path>` - Custom config file

### `nalth fmt:init`
Initialize Prettier configuration.

```bash
nalth fmt:init
nalth fmt:init --strict
```

---

## 🚀 Task Runner Commands

### `nalth run`
Run tasks with smart caching (Turborepo/Nx alternative).

```bash
nalth run build               # Run build task
nalth run build --cache       # Use cache
nalth run build --force       # Skip cache
nalth run test --parallel     # Run in parallel
nalth run build --dry-run     # Show what would run
```

**Options:**
- `--cache` - Use task cache (default: true)
- `--force` - Force run, skip cache
- `--parallel` - Run tasks in parallel
- `--dry-run` - Show what would run

### `nalth run:init`
Initialize task runner configuration.

```bash
nalth run:init
```

---

## 🎨 UI Commands

### `nalth ui`
Open advanced GUI devtools.

```bash
nalth ui                      # Open Vitest UI
```

---

## 📦 Library Commands

### `nalth lib`
Build library with best practices.

```bash
nalth lib                     # Build library
nalth lib --watch             # Watch mode
```

**Options:**
- `--watch` - Watch mode

### `nalth lib:init`
Initialize library configuration.

```bash
nalth lib:init
```

---

## 🔒 Security Commands

### `nalth install` / `nalth i`
**Securely install packages with typosquatting detection, vulnerability scanning, and integrity verification.**

```bash
nalth install                 # Install all dependencies
nalth install react vue       # Install specific packages
nalth install lodash -D       # Install as dev dependency
nalth install --use-bun       # Use Bun package manager
nalth install --production    # Production install
nalth install --frozen        # Use frozen lockfile
```

**Security Features:**
- ✅ Typosquatting detection (prevents `raect` instead of `react`)
- ✅ Malicious package name pattern detection
- ✅ License compliance checking
- ✅ Pre-installation vulnerability scanning
- ✅ Post-installation security audit
- ✅ Package integrity verification
- ✅ Support for npm, pnpm, yarn, and Bun

**Options:**
- `--secure` - Enable security checks (default: true)
- `--verify` - Verify package integrity (default: true)
- `--audit` - Audit after installation (default: true)
- `--use-bun` - Use Bun package manager
- `--save-dev` / `-D` - Save as dev dependency
- `--production` - Production install only
- `--frozen` - Use frozen lockfile
- `--registry <url>` - Custom registry URL

**Examples:**
```bash
# Secure installation with all checks
nalth install express

# Install multiple packages
nalth install react react-dom

# Install dev dependencies
nalth install -D typescript @types/node

# Use Bun for faster installs
nalth install --use-bun

# Production install (no dev dependencies)
nalth install --production

# Frozen lockfile for CI/CD
nalth install --frozen
```

### `nalth uninstall` / `nalth remove` / `nalth rm`
Uninstall packages.

```bash
nalth uninstall lodash
nalth remove express cors
nalth rm unused-package
```

### `nalth audit`
Run comprehensive security audit.

```bash
nalth audit                   # Full audit
nalth audit --fix             # Auto-fix vulnerabilities
nalth audit --severity high   # Filter by severity
nalth audit --format json     # JSON output
```

**Options:**
- `--path <path>` - Project path
- `--format <format>` - Output format (json|text)
- `--severity <level>` - Minimum severity (low|moderate|high|critical)
- `--fix` - Auto-fix vulnerabilities

### `nalth security:report`
Generate detailed security report.

```bash
nalth security:report
nalth security:report --output security.md
nalth security:report --detailed
```

**Options:**
- `--path <path>` - Project path
- `--output <file>` - Output file
- `--detailed` - Detailed report

### `nalth security:scan`
Scan specific package for security issues.

```bash
nalth security:scan lodash
nalth security:scan express --version 4.17.1
nalth security:scan axios --detailed
```

**Options:**
- `--version <version>` - Package version
- `--detailed` - Detailed output

### `nalth security:init`
Initialize security configuration.

```bash
nalth security:init
nalth security:init --strict
nalth security:init --framework react
```

**Options:**
- `--strict` - Strict security mode
- `--framework <name>` - Framework name

---

## 🔧 Utility Commands

### `nalth optimize`
Pre-bundle dependencies (runs automatically, deprecated as standalone command).

```bash
nalth optimize
nalth optimize --force
```

---

## ⚙️ Global Options

These options work with any command:

- `-c, --config <file>` - Use specified config file
- `--base <path>` - Public base path (default: /)
- `-l, --logLevel <level>` - Log level (info|warn|error|silent)
- `--clearScreen` - Allow/disable clear screen when logging
- `-d, --debug [feat]` - Show debug logs
- `-f, --filter <filter>` - Filter debug logs
- `-m, --mode <mode>` - Set env mode
- `--force` - Force operations

---

## 🎯 Command Aliases

```bash
nalth dev     → nalth serve
nalth i       → nalth install
nalth rm      → nalth uninstall → nalth remove
```

---

## 📋 Common Workflows

### Development Workflow
```bash
# Initial setup
nalth test:init
nalth lint:init
nalth fmt:init
nalth security:init

# Development
nalth dev

# Pre-commit
nalth fmt
nalth lint --fix
nalth test --run
nalth audit
```

### CI/CD Workflow
```bash
# Install dependencies securely
nalth install --frozen --production

# Run tests
nalth test --run --coverage

# Lint code
nalth lint --max-warnings 0

# Security audit
nalth audit --severity high

# Build
nalth build

# Preview (optional)
nalth preview
```

### Library Development
```bash
# Initialize
nalth lib:init
nalth test:init

# Development
nalth lib --watch

# Before publish
nalth test --run
nalth lint --fix
nalth audit
nalth lib
```

---

## 🔐 Security Best Practices

1. **Always use `nalth install`** instead of `npm install` for security checks
2. **Run `nalth audit`** before deployments
3. **Enable security linting:** `nalth lint --security`
4. **Use frozen lockfiles in CI/CD:** `nalth install --frozen`
5. **Regular security scans:** `nalth security:report --detailed`
6. **Check specific packages:** `nalth security:scan <package>`

---

## 💡 Tips

- Use `nalth --help` to see all commands
- Use `nalth <command> --help` for command-specific help
- Set `NALTH_DEBUG=1` for detailed debug output
- Use `.nalthrc` for project-specific configuration
- Enable security features by default in CI/CD

---

## 🆘 Troubleshooting

### Command not found
```bash
# Ensure Nalth is installed globally or use npx
npx nalth dev

# Or install globally
npm install -g nalth
```

### Port already in use
```bash
# Use different port
nalth dev --port 3001

# Or use strictPort to fail fast
nalth dev --strictPort
```

### Security checks blocking installation
```bash
# Review security warnings carefully
# If false positive, use --force (not recommended)
nalth install <package> --force
```

---

**NALTH**: Security-First Unified Toolchain for Modern Web Development 🛡️⚡
