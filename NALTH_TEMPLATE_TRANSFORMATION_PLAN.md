# 🛡️ NALTH Template Transformation Plan

## 📋 Current Template Analysis

**TypeScript Templates to Keep & Transform:**
- `template-react-ts` → `nalth-react`
- `template-vue-ts` → `nalth-vue`
- `template-svelte-ts` → `nalth-svelte`
- `template-solid-ts` → `nalth-solid`
- `template-lit-ts` → `nalth-lit`
- `template-preact-ts` → `nalth-preact`
- `template-qwik-ts` → `nalth-qwik`
- `template-vanilla-ts` → `nalth-vanilla`

**JavaScript Templates to Remove:**
- `template-react`, `template-vue`, `template-svelte`, `template-solid`, `template-preact`, `template-qwik`, `template-vanilla`

## 🚀 Step-by-Step Implementation Plan

### Phase 1: Cleanup & Restructure (HIGH PRIORITY)

#### Step 1: Remove JavaScript-Only Templates
```bash
# Navigate to packages/create-nalth
cd packages/create-nalth

# Remove all non-TypeScript templates
rm -rf template-react template-vue template-svelte template-solid 
rm -rf template-preact template-qwik template-vanilla template-lit
```

#### Step 2: Rename Templates to NALTH Convention
```bash
# Rename all TypeScript templates
mv template-react-ts nalth-react
mv template-vue-ts nalth-vue
mv template-svelte-ts nalth-svelte
mv template-solid-ts nalth-solid
mv template-lit-ts nalth-lit
mv template-preact-ts nalth-preact
mv template-qwik-ts nalth-qwik
mv template-vanilla-ts nalth-vanilla
```

### Phase 2: Update Configuration Files (HIGH PRIORITY)

#### Step 3: Transform vite.config.ts → nalth.config.ts

For each template, replace `vite.config.ts` with `nalth.config.ts`:

**OLD: vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**NEW: nalth.config.ts**
```typescript
import { defineConfig } from 'nalth'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // NALTH Security Features
  security: {
    https: true,              // HTTPS by default
    csp: 'auto',             // Auto-generated CSP
    sri: true,               // Subresource Integrity
    audit: 'strict',         // Security auditing
    headers: {
      hsts: true,            // HTTP Strict Transport Security
      frameOptions: 'DENY',  // X-Frame-Options
      contentTypeOptions: true // X-Content-Type-Options
    }
  }
})
```

#### Step 4: Update package.json Files

Transform each template's `package.json`:

**Template: nalth-react/package.json**
```json
{
  "name": "nalth-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "nalth dev",
    "build": "tsc -b && nalth build", 
    "lint": "eslint .",
    "preview": "nalth preview",
    "security:audit": "nalth audit",
    "security:report": "nalth security:report"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.1",
    "nalth": "workspace:*"
  }
}
```

**Template: nalth-vue/package.json**
```json
{
  "name": "nalth-vue-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "nalth dev",
    "build": "vue-tsc -b && nalth build",
    "preview": "nalth preview",
    "security:audit": "nalth audit",
    "security:report": "nalth security:report"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "typescript": "~5.8.3",
    "nalth": "workspace:*",
    "vue-tsc": "^2.2.0"
  }
}
```

### Phase 3: Security-First Enhancements (MEDIUM PRIORITY)

#### Step 5: Add Security Configuration Files

Create `.nalth/security.config.ts` in each template:

```typescript
import { defineSecurityConfig } from 'nalth'

export default defineSecurityConfig({
  https: {
    enabled: true,
    autoGenerate: true,
    certDir: './.nalth/certs'
  },
  
  csp: {
    enabled: true,
    strict: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'ws:', 'wss:']
    }
  },
  
  audit: {
    enabled: true,
    failOnViolations: false,
    patterns: [
      'eval\\(',
      'innerHTML\\s*=',
      'document\\.write\\(',
      'Function\\('
    ]
  }
})
```

#### Step 6: Update HTML Templates

Transform `index.html` files to include security meta tags:

**nalth-react/index.html**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/nalth.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- NALTH Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    
    <title>NALTH React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**nalth-vue/index.html**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/nalth.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- NALTH Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    
    <title>NALTH Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### Phase 4: NALTH Branding & Documentation (MEDIUM PRIORITY)

#### Step 7: Update README Files

**nalth-react/README.md**
```markdown
# 🛡️ NALTH React Template

This template provides a minimal setup to get React working with NALTH's security-first features including HTTPS by default, Content Security Policy, and real-time security monitoring.

## 🚀 Getting Started

```bash
npm run dev          # Start secure development server (HTTPS)
npm run build        # Build with security validation
npm run security:audit # Run security audit
```

## 🛡️ Security Features

- ✅ HTTPS by default in development
- ✅ Auto-generated Content Security Policy
- ✅ Subresource Integrity for all assets
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ Real-time vulnerability scanning

## 📝 Configuration

Edit `nalth.config.ts` to customize security settings:

```typescript
export default defineConfig({
  security: {
    csp: 'strict',     // 'permissive' | 'balanced' | 'strict'
    audit: 'strict',   // Enable strict security auditing
    https: true        // Force HTTPS in development
  }
})
```

## 🔧 Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
```

**nalth-vue/README.md**
```markdown
# 🛡️ NALTH Vue Template

This template provides a minimal setup to get Vue working with NALTH's security-first features including HTTPS by default, Content Security Policy, and real-time security monitoring.

## 🚀 Getting Started

```bash
npm run dev          # Start secure development server (HTTPS)
npm run build        # Build with security validation
npm run security:audit # Run security audit
```

## 🛡️ Security Features

- ✅ HTTPS by default in development
- ✅ Auto-generated Content Security Policy
- ✅ Subresource Integrity for all assets
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ Real-time vulnerability scanning

## 📝 Configuration

Edit `nalth.config.ts` to customize security settings:

```typescript
export default defineConfig({
  security: {
    csp: 'strict',     // 'permissive' | 'balanced' | 'strict'
    audit: 'strict',   // Enable strict security auditing
    https: true        // Force HTTPS in development
  }
})
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the default `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.
```

### Phase 5: New NALTH-Specific Templates (MEDIUM PRIORITY)

#### Step 8: Create Advanced Security Templates

**nalth-secure-api Template Structure:**
```
nalth-secure-api/
├── src/
│   ├── middleware/
│   │   ├── security.ts
│   │   ├── cors.ts
│   │   └── rateLimit.ts
│   ├── routes/
│   │   └── api.ts
│   └── server.ts
├── nalth.config.ts
├── package.json
└── README.md
```

**nalth-enterprise Template Features:**
- SOC2 compliance configuration
- GDPR data protection settings
- Advanced audit logging
- Enterprise security policies

**nalth-pwa Template Features:**
- Service Worker with security headers
- Secure manifest.json
- Content Security Policy for PWA
- Secure offline functionality

### Phase 6: CLI Integration Updates (LOW PRIORITY)

#### Step 9: Update create-nalth CLI

Update the CLI to use new template names in `src/index.ts`:

```typescript
const TEMPLATES = [
  'nalth-react',
  'nalth-vue', 
  'nalth-svelte',
  'nalth-solid',
  'nalth-lit',
  'nalth-preact',
  'nalth-qwik',
  'nalth-vanilla',
  'nalth-secure-api',
  'nalth-enterprise',
  'nalth-pwa',
  'nalth-fullstack'
] as const

const TEMPLATE_DESCRIPTIONS = {
  'nalth-react': 'React with TypeScript and security features',
  'nalth-vue': 'Vue 3 with TypeScript and security features',
  'nalth-svelte': 'Svelte with TypeScript and security features',
  'nalth-solid': 'Solid with TypeScript and security features',
  'nalth-lit': 'Lit with TypeScript and security features',
  'nalth-preact': 'Preact with TypeScript and security features',
  'nalth-qwik': 'Qwik with TypeScript and security features',
  'nalth-vanilla': 'Vanilla TypeScript with security features',
  'nalth-secure-api': 'Node.js API with security middleware',
  'nalth-enterprise': 'Enterprise-ready with compliance features',
  'nalth-pwa': 'Progressive Web App with security best practices',
  'nalth-fullstack': 'Full-stack with secure client-server communication'
}
```

## 🎯 Expected Outcomes

After implementation, users will be able to create secure projects with:

```bash
# Create secure React app
npx create-nalth my-app --template nalth-react

# Create secure Vue app  
npx create-nalth my-app --template nalth-vue

# Create enterprise-ready app
npx create-nalth my-app --template nalth-enterprise

# Create secure API
npx create-nalth my-api --template nalth-secure-api
```

Each template will include:
- 🛡️ Security-first configuration out of the box
- 🚀 HTTPS development server by default
- 📊 Real-time security monitoring
- 🔒 Content Security Policy auto-generation
- ✅ Built-in security auditing
- 🏢 Enterprise compliance features (where applicable)

## 📋 Implementation Checklist

### Phase 1: Cleanup & Restructure
- [ ] Remove JavaScript-only templates
- [ ] Rename TypeScript templates to nalth-* convention

### Phase 2: Configuration Updates
- [ ] Replace vite.config.ts with nalth.config.ts in all templates
- [ ] Update package.json scripts to use nalth commands
- [ ] Update dependencies to use nalth instead of vite

### Phase 3: Security Enhancements
- [ ] Add .nalth/security.config.ts to all templates
- [ ] Update index.html with security meta tags
- [ ] Add security-focused assets (nalth.svg icon)

### Phase 4: Documentation & Branding
- [ ] Update README.md files with NALTH branding
- [ ] Add security feature documentation
- [ ] Include configuration examples

### Phase 5: Advanced Templates
- [ ] Create nalth-secure-api template
- [ ] Create nalth-enterprise template
- [ ] Create nalth-pwa template
- [ ] Create nalth-fullstack template

### Phase 6: CLI Updates
- [ ] Update template list in CLI
- [ ] Add template descriptions
- [ ] Update help text and documentation

## 🚀 Priority Order

1. **HIGH**: Steps 1-4 (Cleanup, rename, update configs)
2. **MEDIUM**: Steps 5-7 (Security enhancements, documentation)
3. **LOW**: Steps 8-9 (New templates, CLI updates)

This plan transforms the create-nalth package into a truly security-first template system that aligns with NALTH's mission of making secure web development effortless.
