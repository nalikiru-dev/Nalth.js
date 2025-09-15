# 🛡️ create-nalth

**Scaffolding for Nalth - The Security-First Web Framework**

Bootstrap enterprise-ready, secure web applications in seconds. Create-nalth provides professionally designed templates with HTTPS enabled by default, comprehensive security headers, real-time threat monitoring, and modern development tools.

🎆 **What's New in v2.1.0:**
- 🎨 Completely redesigned UI with professional security-focused interfaces
- 📊 Interactive security dashboards with real-time metrics
- 🔍 Built-in security auditing and threat detection
- 🌍 Enterprise-grade security features out of the box
- ⚡ Enhanced developer experience with better CLI and documentation

> **System Requirements:**
> Nalth requires [Node.js](https://nodejs.org/en/) version 20.19.0+ or 22.12.0+. All templates include enterprise-grade security features and beautiful, responsive designs.

## 🚀 Quick Start

With NPM:

```bash
$ npm create nalth@latest
```

With Yarn:

```bash
$ yarn create nalth
```

With PNPM:

```bash
$ pnpm create nalth
```

With Bun:

```bash
$ bun create nalth
```

Then follow the prompts to select your preferred framework and security configuration!

## 🎯 Direct Template Usage

You can also directly specify the project name and template via command line options:

```bash
# npm 7+, extra double-dash is needed:
npm create nalth@latest my-secure-app -- --template secure-vanilla

# yarn
yarn create nalth my-secure-app --template secure-vanilla

# pnpm
pnpm create nalth my-secure-app --template secure-vanilla

# Bun
bun create nalth my-secure-app --template secure-vanilla
```

## 🎨 Available Security Templates

All templates feature beautiful, professionally designed interfaces with enterprise-grade security:

### 🟡 **nalth-vanilla** - Pure TypeScript Excellence
- Modern, responsive design with CSS variables and animations
- Interactive security dashboard with real-time metrics
- Built-in security utilities and CSP violation monitoring
- Beautiful gradient interfaces and professional typography

### 🟢 **nalth-vue** - Vue.js with Security Middleware
- Vue 3 Composition API with TypeScript
- Integrated security monitoring and threat detection
- Modern UI components with Tailwind CSS

### 🔵 **nalth-react** - Enterprise React Security
- React 19 with TypeScript and shadcn/ui components
- Interactive security dashboard with tabs and real-time updates
- Beautiful card-based layouts with security metrics
- Professional badges, progress bars, and status indicators

### 🟣 **nalth-preact** - Lightweight Security Power
- Preact with full TypeScript support
- Real-time HTTPS monitoring and security headers
- Compact bundle size with enterprise features

### 🔴 **nalth-lit** - Web Components Security
- Lit web components with security features
- Custom elements with built-in protection
- Modern shadow DOM security patterns

### ⭐ **nalth-svelte** - Compiled Security
- SvelteKit with built-in security protection
- Compile-time optimizations with runtime security
- Beautiful animations and transitions

### 💙 **nalth-solid** - Performance + Security
- SolidJS with enterprise security suite
- Fine-grained reactivity with security monitoring
- Minimal runtime with maximum protection

### ⚡ **nalth-qwik** - Zero-Config Security
- Qwik with automatic security configuration
- Edge-ready with built-in security features
- Progressive loading with security headers

## ✨ What You Get

Every Nalth project includes enterprise-grade features and beautiful design:

### 🔒 **Security & Protection**
- **HTTPS by Default** - Auto-generated SSL certificates with TLS 1.3
- **Advanced Security Headers** - CSP, HSTS, X-Frame-Options, CSRF protection
- **Real-time Threat Monitoring** - Live security event tracking and alerts
- **Dependency Auditing** - Continuous vulnerability scanning
- **CSP Violation Detection** - Automatic policy enforcement and reporting

### 🎨 **Modern Design & UX**
- **Professional UI Components** - Beautiful, accessible design systems
- **Interactive Dashboards** - Real-time security metrics and monitoring
- **Responsive Design** - Mobile-first, adaptive layouts
- **Dark/Light Mode** - Automatic theme switching
- **Smooth Animations** - Professional transitions and micro-interactions

### ⚡ **Developer Experience**
- **Hot Reload** - Lightning-fast development with WebSocket updates
- **TypeScript First** - Full type safety and IntelliSense
- **Zero Config** - Works out of the box, customize as needed
- **Enhanced CLI** - Beautiful, informative command-line interface
- **Security Auditing** - Built-in security testing and reporting

### 📊 **Monitoring & Analytics**
- **Security Dashboard** - Real-time security posture monitoring
- **Performance Metrics** - Built-in performance tracking
- **Event Logging** - Comprehensive security event management
- **Violation Tracking** - CSP and security policy monitoring

## 🏗️ Project Structure

```
my-secure-app/
├── index.html          # Main HTML with security meta tags
├── style.css           # Modern, responsive styles
├── main.js             # Interactive JavaScript with security demos
├── nalth.config.js     # Security and server configuration
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## 🚀 Getting Started

After creating your project:

```bash
cd my-secure-app
npm install
npm run dev
```

Your secure development server will start at `https://localhost:3000` with:
- ✅ SSL certificates automatically generated
- ✅ Security headers enabled
- ✅ Hot reload active
- ✅ Rate limiting configured

## 🔧 Available Scripts

- `npm run dev` - Start secure development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🛡️ Security Features

### Automatic HTTPS
- Self-signed certificates for development
- Proper key usage extensions
- No SSL warnings or errors

### Security Headers
- **Content Security Policy (CSP)** - Prevents XSS attacks
- **HTTP Strict Transport Security (HSTS)** - Forces HTTPS
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing

### Development Security
- Rate limiting built-in
- CORS configuration
- Input validation ready
- Secure cookie handling

## 📚 Learn More

- [Nalth Documentation](https://github.com/your-org/nalth)
- [Security Best Practices](https://github.com/your-org/nalth/docs/security)
- [Configuration Guide](https://github.com/your-org/nalth/docs/config)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

---

**Built with ❤️ by the Nalth Team - Making web development secure by default** 🛡️

## Community Templates

create-nalth is a tool to quickly start a project from a basic template for popular frameworks. Check out Awesome Nalth for [community maintained templates](https://github.com/Nalthjs/awesome-Nalth#templates) that include other tools or target different frameworks. You can use a tool like [degit](https://github.com/Rich-Harris/degit) to scaffold your project with one of the templates.

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

If the project uses `main` as the default branch, suffix the project repo with `#main`

```bash
npx degit user/project#main my-project
```
