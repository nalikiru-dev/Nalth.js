# 🛡️ create-nalth

**Scaffolding for Nalth - The Security-First Web Framework**

With `create-nalth`, you can quickly bootstrap secure web applications with HTTPS enabled by default, comprehensive security headers, and modern development tools.

> **Compatibility Note:**
> Nalth requires [Node.js](https://nodejs.org/en/) version 18+ or 20+. All templates include security features out of the box.

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

## 🛡️ Available Security Templates

All templates include HTTPS, security headers, hot reload, and production-ready configurations:

- `secure-vanilla` / `secure-vanilla-ts` - Pure JavaScript/TypeScript with security
- `secure-vue` / `secure-vue-ts` - Vue.js with security features
- `secure-react` / `secure-react-ts` - React with security middleware
- `secure-preact` / `secure-preact-ts` - Preact with HTTPS and CSP
- `secure-lit` / `secure-lit-ts` - Lit web components with security
- `secure-svelte` / `secure-svelte-ts` - Svelte with security headers
- `secure-solid` / `secure-solid-ts` - SolidJS with built-in protection

## ✨ What You Get

Every Nalth project includes:

- **🔒 HTTPS by Default** - Auto-generated SSL certificates for development
- **🛡️ Security Headers** - CSP, HSTS, X-Frame-Options, and more
- **🔥 Hot Reload** - Lightning-fast development with WebSocket updates
- **⚡ Performance** - Optimized asset serving and compression
- **🎨 Beautiful Demo** - Stunning landing page showcasing security features
- **📱 Responsive Design** - Mobile-first, modern UI components
- **🔧 Zero Config** - Works out of the box, customize as needed

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
