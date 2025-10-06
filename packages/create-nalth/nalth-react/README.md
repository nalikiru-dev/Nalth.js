# React + TypeScript + Nalth

This template provides a **security-first** setup for React with the Nalth framework, featuring enterprise-grade security, Hot Module Replacement (HMR), TypeScript, and modern tooling.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Your app will be available at `http://localhost:5173` with hot reload enabled.

3. **Build for Production**
   ```bash
   npm run build
   ```
   Creates an optimized production build in the `dist` folder.

4. **Preview Production Build**
   ```bash
   npm run preview
   ```
   Serves the production build locally for testing.

## 🛡️ Security Features

Nalth provides enterprise-grade security features out of the box:

- ✅ **Content Security Policy (CSP)** - Prevents XSS attacks with strict CSP headers
- ✅ **Security Headers** - HSTS, X-Frame-Options, X-Content-Type-Options, and more
- ✅ **HTTPS Support** - Optional HTTPS for development (configure in `nalth.config.ts`)
- ✅ **Dependency Auditing** - Built-in vulnerability scanning
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **CORS Configuration** - Secure cross-origin resource sharing

### Configuration

Edit `nalth.config.ts` to customize security settings:

```typescript
export default defineConfig({
  security: {
    https: true,              // Enable HTTPS in development
    csp: {
      enabled: true,          // Enable Content Security Policy
      nonce: true,            // Use nonces for inline scripts
      strictDynamic: true     // Enable strict-dynamic
    },
    sri: true,                // Subresource Integrity
    headers: {
      hsts: true,             // HTTP Strict Transport Security
      frameOptions: 'DENY'    // Prevent clickjacking
    }
  }
})
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
