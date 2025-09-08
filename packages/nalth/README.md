# 🛡️ Nalth

**The Security-First Web Development Framework**

Nalth is a modern, security-focused web development framework that provides HTTPS by default, comprehensive security headers, and a delightful developer experience. Built from the ground up with security as the primary concern.

## ✨ Features

- **🔒 HTTPS by Default** - Automatic SSL certificate generation with proper key usage
- **🛡️ Security Headers** - CSP, HSTS, X-Frame-Options, and more out of the box
- **🔥 Hot Reload** - Lightning-fast development with WebSocket-based hot reloading
- **⚡ Performance** - Optimized asset serving, compression, and caching
- **🎯 Production Ready** - Enterprise-grade security features for modern web apps
- **🛠️ Developer Experience** - Simple CLI, intuitive configuration, zero-config setup

## 🚀 Quick Start

### Create a New Project

```bash
# Using npx (recommended)
npx nalth create my-secure-app

# Or install globally
npm install -g nalth
nalth create my-secure-app
```

### Start Development

```bash
cd my-secure-app
npm install
nalth dev
```

Your secure development server will start at `https://localhost:3000` with:
- ✅ Auto-generated SSL certificates
- ✅ Security headers enabled
- ✅ Hot reload active
- ✅ Rate limiting configured

## 📦 Installation

```bash
npm install nalth
```

## 🎯 CLI Commands

| Command | Description |
|---------|-------------|
| `nalth create <name>` | Create a new Nalth project |
| `nalth dev` | Start development server |
| `nalth build` | Build for production |
| `nalth preview` | Preview production build |
| `nalth --help` | Show help information |
| `nalth --version` | Show version |

## ⚙️ Configuration

Create a `nalth.config.js` file in your project root:

```javascript
export default {
  port: 3000,
  host: 'localhost',
  
  // HTTPS Configuration
  https: {
    enabled: true,
    autoGenerate: true,  // Auto-generate SSL certificates
    // Or provide your own:
    // key: './path/to/key.pem',
    // cert: './path/to/cert.pem'
  },
  
  // Security Settings
  security: {
    csp: {
      enabled: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'ws:', 'wss:']
      }
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  // CORS Configuration
  cors: {
    origin: true,
    credentials: true
  },
  
  // Development Features
  hotReload: true,
  
  // Static File Serving
  static: {
    dir: 'public',
    prefix: '/'
  }
}
```

## 🏗️ Project Structure

When you create a new Nalth project, you get this organized structure:

```
my-secure-app/
├── public/              # Static assets served directly
│   ├── index.html      # Main HTML file
│   ├── styles/         # CSS files
│   │   └── main.css    # Main stylesheet
│   └── js/             # JavaScript files
│       └── main.js     # Main JavaScript
├── src/                # Source code (for your app logic)
│   ├── components/     # Reusable components
│   ├── styles/         # Source styles (SCSS, etc.)
│   └── utils/          # Utility functions
├── nalth.config.js     # Nalth configuration
├── package.json        # Dependencies and scripts
├── README.md           # Project documentation
└── .gitignore          # Git ignore rules
```

## 🔐 Security Features

### Automatic HTTPS
- Self-signed certificates for development
- Proper key usage extensions (digitalSignature, keyEncipherment, serverAuth)
- No more SSL errors in development

### Security Headers
- **Content Security Policy (CSP)** - Prevents XSS attacks
- **HTTP Strict Transport Security (HSTS)** - Forces HTTPS
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **Referrer-Policy** - Controls referrer information

### Rate Limiting
- Built-in rate limiting to prevent abuse
- Configurable per endpoint
- Memory-based by default, Redis support available

### Input Validation
- Express-validator integration
- DOMPurify for HTML sanitization
- Bcrypt for password hashing

## 🎨 Demo Page Features

Every new Nalth project comes with a beautiful demo page showcasing:

- **🎯 Live Security Status** - Real-time HTTPS and WebSocket connection status
- **⚡ Performance Monitoring** - Built-in performance metrics
- **🎨 Modern UI** - Beautiful, responsive design with animations
- **🔄 Hot Reload Demo** - Visual feedback for development changes
- **📱 Mobile Responsive** - Works perfectly on all devices

## 🚀 Why Choose Nalth?

### vs. Express.js
- ✅ Security by default (Express requires manual setup)
- ✅ HTTPS out of the box (Express needs additional configuration)
- ✅ Built-in hot reload (Express needs additional tools)
- ✅ Zero-config development (Express requires extensive setup)

### vs. Next.js
- ✅ Security-first approach (Next.js focuses on React/performance)
- ✅ Framework agnostic (Next.js is React-only)
- ✅ Simpler configuration (Next.js can be complex)
- ✅ Built-in security headers (Next.js requires manual setup)

### vs. Vite
- ✅ Production-ready security (Vite is development-focused)
- ✅ Built-in server features (Vite requires additional setup)
- ✅ HTTPS by default (Vite needs manual configuration)
- ✅ Security middleware included (Vite has none)

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-org/nalth.git
cd nalth

# Install dependencies
npm install

# Build the project
npm run build

# Test the CLI
npm link
nalth create test-app
```

## 📚 API Reference

### NalthServer Class

```javascript
import { NalthServer } from 'nalth'

const server = new NalthServer(config)

// Add routes
server.get('/', (req, res) => {
  res.send('Hello, secure world!')
})

server.post('/api/data', (req, res) => {
  // Your API logic here
})

// Start the server
await server.listen()
```

### Security Middleware

```javascript
import { securityMiddleware, rateLimiter } from 'nalth/security'

// Apply security headers
app.use(securityMiddleware())

// Apply rate limiting
app.use('/api', rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with security best practices from OWASP
- Inspired by the simplicity of Vite and the power of Express
- SSL certificate generation powered by node-forge

## 📞 Support

- 📖 [Documentation](https://github.com/your-org/nalth/docs)
- 🐛 [Issue Tracker](https://github.com/your-org/nalth/issues)
- 💬 [Discussions](https://github.com/your-org/nalth/discussions)
- 🔒 [Security Policy](SECURITY.md)

---

**Built with ❤️ by the Nalth Team**

*Making web development secure by default* 🛡️
