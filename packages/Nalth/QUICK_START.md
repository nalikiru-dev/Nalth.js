# 🚀 Nalth Quick Start Guide

Welcome to Nalth! This guide will get you up and running in under 5 minutes.

## 📦 Installation

```bash
# Create a new project
npx create-nalth my-app

# Or use your preferred package manager
pnpm create nalth my-app
bun create nalth my-app
```

## 🎯 Choose Your Framework

Nalth supports all major frameworks:

```bash
# React + TypeScript (Recommended)
npx create-nalth my-app --template react-ts

# Vue 3 + TypeScript
npx create-nalth my-app --template vue-ts

# Svelte + TypeScript
npx create-nalth my-app --template svelte-ts

# Vanilla TypeScript
npx create-nalth my-app --template vanilla-ts
```

## 🏃 Start Development

```bash
cd my-app
npm install
npm run dev
```

Your app will be running at:
- 🔒 **HTTPS**: https://localhost:5173
- 🌐 **HTTP**: http://localhost:5173

## 🛡️ Security Features (Auto-Enabled)

Nalth comes with enterprise-grade security out of the box:

✅ **HTTPS by Default** - Auto-generated certificates
✅ **Content Security Policy** - Automatic CSP generation
✅ **Security Headers** - OWASP recommended headers
✅ **Vulnerability Scanning** - Real-time dependency auditing
✅ **SRI (Subresource Integrity)** - Asset integrity verification

## 📝 Configuration

Create `nalth.config.ts` in your project root:

```typescript
import { defineConfig } from 'nalth'

export default defineConfig({
  // All Vite options work here
  plugins: [],
  
  // Security configuration
  security: {
    https: true, // Enable HTTPS
    csp: {
      enabled: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
      },
    },
  },
  
  // Build optimizations
  build: {
    target: 'esnext',
    sourcemap: true,
  },
})
```

## 🎨 Common Use Cases

### React Application

```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### API Integration with Security

```typescript
// api.ts
import { secureRequest } from 'nalth/security'

export async function fetchData() {
  // Automatic CSRF protection and security headers
  const response = await secureRequest('/api/data', {
    method: 'GET',
    credentials: 'include',
  })
  
  return response.json()
}
```

### Environment Variables

```typescript
// .env
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-api-key

// Usage in code
const apiUrl = import.meta.env.VITE_API_URL
```

## 🔧 CLI Commands

```bash
# Development
nalth dev              # Start dev server
nalth dev --port 3000  # Custom port
nalth dev --host       # Expose to network

# Building
nalth build            # Production build
nalth build --watch    # Watch mode
nalth preview          # Preview production build

# Security
nalth security:report  # Generate security report
nalth security:scan    # Scan dependencies
nalth audit            # Run security audit

# Testing
nalth test             # Run tests with Vitest
nalth test:ui          # Open test UI

# Linting & Formatting
nalth lint             # Lint with ESLint
nalth fmt              # Format with Prettier

# Advanced
nalth ui               # Open devtools UI
nalth lib              # Build library
```

## 🎯 Keyboard Shortcuts (Dev Mode)

Press `h` in the terminal to see all shortcuts:

- `r` - Restart server
- `u` - Show server URLs
- `o` - Open in browser
- `c` - Clear console
- `q` - Quit

## 📊 Performance Tips

### 1. Code Splitting

```typescript
// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'))

// Dynamic imports
const module = await import('./heavy-module')
```

### 2. Optimize Dependencies

```typescript
// nalth.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle
    exclude: ['@nalth/client'],       // Don't pre-bundle
  },
})
```

### 3. Build Optimizations

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@mui/material'],
        },
      },
    },
  },
})
```

## 🐛 Debugging

### Enable Debug Logs

```bash
# All debug logs
DEBUG=nalth:* npm run dev

# Specific module
DEBUG=nalth:hmr npm run dev
```

### Source Maps

```typescript
export default defineConfig({
  build: {
    sourcemap: true, // or 'inline' or 'hidden'
  },
})
```

### Error Overlay

Nalth shows helpful error overlays with:
- ✅ Exact error location
- ✅ Code frame
- ✅ Suggestions to fix
- ✅ Stack trace

## 🔐 Security Best Practices

### 1. Use Environment Variables

```typescript
// ❌ Don't hardcode secrets
const apiKey = 'sk_live_123...'

// ✅ Use environment variables
const apiKey = import.meta.env.VITE_API_KEY
```

### 2. Enable CSP

```typescript
export default defineConfig({
  security: {
    csp: {
      enabled: true,
      reportOnly: false, // Enforce in production
    },
  },
})
```

### 3. Regular Security Audits

```bash
# Run before each deployment
nalth security:report
nalth audit
```

## 📚 Next Steps

- 📖 [Full Documentation](https://nalthjs.com/docs)
- 🎯 [Examples](https://nalthjs.com/examples)
- 🛡️ [Security Guide](https://nalthjs.com/security)
- 💬 [Discord Community](https://discord.gg/nalth)
- 🐛 [Report Issues](https://github.com/nalikiru-dev/nalth.js/issues)

## 🆘 Common Issues

### Port Already in Use

```bash
# Use a different port
nalth dev --port 3000

# Or let Nalth find an available port
nalth dev --strictPort=false
```

### HTTPS Certificate Issues

```bash
# Regenerate certificates
rm -rf .nalth/certs
nalth dev
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .nalth
npm install
```

### Slow HMR

```typescript
// Add HMR boundaries
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

## 💡 Pro Tips

1. **Use TypeScript** - Better DX and fewer bugs
2. **Enable Source Maps** - Easier debugging
3. **Code Splitting** - Faster load times
4. **Security First** - Run audits regularly
5. **Monitor Performance** - Use `nalth ui` for insights

---

**Need Help?** Join our [Discord](https://discord.gg/nalth) or check the [docs](https://nalthjs.com)

**Happy Coding! 🚀🛡️**
