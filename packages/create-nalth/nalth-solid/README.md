# SolidJS + Nalth


**Framework:** SolidJS
**Description:** SolidJS with fine-grained reactivity and security

Created with [Nalth](https://www.nalthjs.com) - Security-First Unified Toolchain

## 🛡️ Built with Enterprise Security

This project is powered by **Nalth v2.2.0**, featuring:

- ✅ **HTTPS by Default** - TLS 1.3 encryption with auto-generated certificates
- ✅ **Content Security Policy (CSP)** - XSS protection built-in
- ✅ **Security Headers** - HSTS, X-Frame-Options, CSP, and more
- ✅ **Secure Package Management** - Typosquatting detection & vulnerability scanning
- ✅ **Real-time Monitoring** - Security event tracking and alerts

## 🛠️ Unified Toolchain

Everything you need in one command-line interface:

### Development
```bash
npm run dev          # Start HTTPS dev server (https://localhost:3000)
npm run build        # Production build with security optimizations
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run tests with Vitest
npm run test:ui      # Open interactive test UI
npm run test:coverage # Generate coverage reports
```

### Code Quality
```bash
npm run lint         # Lint with ESLint + security plugins
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting (CI-friendly)
npm run typecheck    # TypeScript type checking
```

### Security
```bash
npm run audit        # Run comprehensive security audit
nalth install <pkg>  # Securely install packages with checks
```

## 📁 Project Structure

```
.
├── src/
│   ├── test/              # Test files
│   │   ├── example.test.ts
│   │   └── setup.ts
│   └── ...                # Your source files
├── .prettierrc            # Prettier configuration
├── eslint.config.js       # ESLint configuration
├── vitest.config.ts       # Vitest configuration
├── nalth.config.ts        # Nalth configuration
└── package.json
```

## 🧪 Testing

This project uses **Vitest** for testing with:

- Jest-compatible API
- Fast test execution
- Built-in coverage reporting
- Interactive UI mode

Run tests:
```bash
npm test                    # Watch mode
npm test -- --run           # Run once
npm run test:coverage       # With coverage
npm run test:ui             # Open UI
```

## 🔍 Linting

ESLint is configured with:

- TypeScript support
- Security plugins (eslint-plugin-security)
- Modern ES2024 syntax
- Customizable rules in `eslint.config.js`

Run linting:
```bash
npm run lint                # Check for issues
npm run lint:fix            # Auto-fix issues
```

## ✨ Formatting

Prettier is configured for consistent code style:

- Single quotes
- No semicolons
- 2-space indentation
- Trailing commas
- 100 character line width

Format code:
```bash
npm run format              # Format all files
npm run format:check        # Check only (CI)
```

## 🔒 Secure Package Management

Nalth includes **secure package installation** with:

1. **Typosquatting Detection** - Prevents installing `raect` instead of `react`
2. **Vulnerability Scanning** - Pre-installation security checks
3. **License Compliance** - Automatic license verification
4. **Integrity Verification** - Package checksum validation

Install packages securely:
```bash
nalth install <package>           # Secure install
nalth install axios react-query   # Multiple packages
nalth install lodash -D           # Dev dependency
nalth install --use-bun           # Use Bun package manager
```

## 📊 Security Dashboard

Access the security dashboard at: `https://localhost:3000/__nalth`

Features:
- Real-time security metrics
- CSP violation monitoring
- Dependency vulnerability tracking
- Security event logging

## 🚀 Deployment

Before deploying:

1. Run full test suite: `npm test -- --run`
2. Check code quality: `npm run lint && npm run typecheck`
3. Security audit: `npm run audit`
4. Build for production: `npm run build`
5. Preview build: `npm run preview`

## 📚 Learn More

- [Nalth Documentation](https://www.nalthjs.com/docs)
- [Security Best Practices](https://www.nalthjs.com/docs/security)
- [CLI Commands](https://www.nalthjs.com/docs/cli)
- [Configuration Guide](https://www.nalthjs.com/docs/config)

## 🤝 Contributing

Contributions are welcome! Please ensure:

- All tests pass (`npm test -- --run`)
- Code is linted (`npm run lint`)
- Code is formatted (`npm run format`)
- Security audit passes (`npm run audit`)

## 📄 License

MIT

---

**Powered by Nalth v2.2.0** - Security-First Unified Toolchain 🛡️⚡
