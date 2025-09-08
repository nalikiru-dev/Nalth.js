# demo-secure-app

A secure web application built with **Nalth** - the security-first web development framework.

## 🛡️ Features

- **🔒 HTTPS by Default** - Automatic SSL certificate generation
- **🛡️ Security Headers** - CSP, HSTS, X-Frame-Options, and more
- **🔥 Hot Reload** - Instant development feedback
- **⚡ Performance** - Optimized asset serving and compression
- **🎯 Production Ready** - Enterprise-grade security features

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
nalth dev

# Build for production
nalth build

# Preview production build
nalth preview
```

## 📁 Project Structure

```
demo-secure-app/
├── public/           # Static assets
│   ├── index.html   # Main HTML file
│   ├── styles/      # CSS files
│   └── js/          # JavaScript files
├── src/             # Source code
│   ├── components/  # Reusable components
│   ├── styles/      # Source styles
│   └── utils/       # Utility functions
├── nalth.config.js  # Nalth configuration
└── package.json     # Project dependencies
```

## ⚙️ Configuration

Edit `nalth.config.js` to customize your security settings, HTTPS configuration, and more.

## 🔧 Development

- **Development Server**: `nalth dev` - Starts HTTPS development server
- **Production Build**: `nalth build` - Creates optimized production build
- **Preview**: `nalth preview` - Preview production build locally

## 📚 Learn More

- [Nalth Documentation](https://github.com/your-org/nalth)
- [Security Best Practices](https://github.com/your-org/nalth/docs/security)
- [Configuration Guide](https://github.com/your-org/nalth/docs/config)

---

Built with ❤️ using **Nalth** - The Security-First Framework
