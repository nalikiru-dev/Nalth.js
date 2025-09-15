#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { spawn } from 'node:child_process'
import chalk from 'chalk'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const commands = {
  create: 'Create a new Nalth project',
  dev: 'Start development server',
  build: 'Build for production',
  preview: 'Preview production build',
  '--help': 'Show help',
  '--version': 'Show version'
}

function showHelp() {
  console.log(chalk.blue.bold('🛡️  Nalth - Security-First Web Framework'))
  console.log()
  console.log(chalk.white('Usage:'))
  console.log('  nalth <command> [options]')
  console.log()
  console.log(chalk.white('Commands:'))
  Object.entries(commands).forEach(([cmd, desc]) => {
    console.log(`  ${chalk.green(cmd.padEnd(12))} ${desc}`)
  })
  console.log()
  console.log(chalk.white('Examples:'))
  console.log('  nalth create my-app    Create new project')
  console.log('  nalth dev              Start development server')
  console.log('  nalth build            Build for production')
}

function showVersion() {
  try {
    const packagePath = join(__dirname, '..', 'package.json')
    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
    console.log(pkg.version)
  } catch {
    console.log('1.0.0')
  }
}

async function runDev() {
  console.log(chalk.blue('🚀 Starting Nalth development server...'))
  
  // Look for nalth.config.js in current directory
  const configPath = join(process.cwd(), 'nalth.config.js')
  
  if (!existsSync(configPath)) {
    console.log(chalk.yellow('⚠ No nalth.config.js found, creating default configuration...'))
    await createDefaultConfig()
  }

  // Import and run the development server
  try {
    const { default: config } = await import(configPath)
    const { NalthServer } = await import('../dist/index.js')
    
    const server = new NalthServer(config)
    
    // Setup basic routes if none exist
    server.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Nalth App</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; padding: 2rem; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 2rem; }
            .logo { font-size: 3rem; margin-bottom: 0.5rem; }
            .status { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
            .status-item { padding: 1rem; background: #f8f9fa; border-radius: 4px; border-left: 4px solid #28a745; }
            .status-item.warning { border-left-color: #ffc107; }
            .status-item h3 { margin: 0 0 0.5rem 0; color: #333; }
            .status-item p { margin: 0; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️</div>
              <h1>Welcome to Nalth</h1>
              <p>Security-first web development framework</p>
            </div>
            
            <div class="status">
              <div class="status-item">
                <h3>🔒 HTTPS</h3>
                <p id="https-status">Checking...</p>
              </div>
              <div class="status-item">
                <h3>🛡️ Security Headers</h3>
                <p id="security-status">Active</p>
              </div>
              <div class="status-item">
                <h3>🔥 Hot Reload</h3>
                <p id="reload-status">Connected</p>
              </div>
              <div class="status-item">
                <h3>⚡ Performance</h3>
                <p id="perf-status">Optimized</p>
              </div>
            </div>
          </div>
          
          <script>
            // Check HTTPS status
            document.getElementById('https-status').textContent = 
              location.protocol === 'https:' ? '✅ Enabled' : '⚠️ HTTP Mode';
            
            // Hot reload connection
            const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
            const ws = new WebSocket(protocol + '//' + location.host + '/__nalth_hot');
            
            ws.onopen = () => {
              document.getElementById('reload-status').textContent = '✅ Connected';
            };
            
            ws.onmessage = (event) => {
              if (event.data === 'reload') {
                window.location.reload();
              }
            };
            
            ws.onerror = () => {
              document.getElementById('reload-status').textContent = '❌ Disconnected';
            };
          </script>
        </body>
        </html>
      `)
    })
    
    await server.listen()
  } catch (error) {
    console.error(chalk.red('✗ Failed to start development server:'), error.message)
    process.exit(1)
  }
}

async function createProject(projectName) {
  if (!projectName) {
    console.log(chalk.red('❌ Please provide a project name'))
    console.log(chalk.gray('Usage: nalth create <project-name>'))
    process.exit(1)
  }

  const projectPath = join(process.cwd(), projectName)
  
  if (existsSync(projectPath)) {
    console.log(chalk.red(`❌ Directory ${projectName} already exists`))
    process.exit(1)
  }

  console.log(chalk.blue.bold(`🚀 Creating Nalth project: ${projectName}`))
  console.log()

  // Create project directory structure
  const dirs = [
    '',
    'src',
    'src/components',
    'src/styles',
    'src/utils',
    'public',
    'public/assets',
    'public/styles',
    'public/js'
  ]

  dirs.forEach(dir => {
    const dirPath = join(projectPath, dir)
    mkdirSync(dirPath, { recursive: true })
    console.log(chalk.gray(`📁 Created ${dir || './'}`))
  })

  // Create files
  await createProjectFiles(projectPath, projectName)
  
  console.log()
  console.log(chalk.green.bold('✅ Project created successfully!'))
  console.log()
  console.log(chalk.white('Next steps:'))
  console.log(chalk.gray(`  cd ${projectName}`))
  console.log(chalk.gray('  npm install'))
  console.log(chalk.gray('  nalth dev'))
  console.log()
  console.log(chalk.blue('🛡️  Your secure development environment is ready!'))
}

async function createProjectFiles(projectPath, projectName) {
  // Package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    type: 'module',
    private: true,
    scripts: {
      dev: 'nalth dev',
      build: 'nalth build',
      preview: 'nalth preview'
    },
    dependencies: {
      nalth: '^1.0.0'
    },
    devDependencies: {}
  }
  
  writeFileSync(
    join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )
  console.log(chalk.gray('📄 Created package.json'))

  // Nalth config
  const nalthConfig = `export default {
  port: 3000,
  host: 'localhost',
  https: {
    enabled: true,
    autoGenerate: true
  },
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
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  },
  cors: {
    origin: true,
    credentials: true
  },
  hotReload: true,
  static: {
    dir: 'public',
    prefix: '/'
  }
}
`
  
  writeFileSync(join(projectPath, 'nalth.config.js'), nalthConfig)
  console.log(chalk.gray('⚙️  Created nalth.config.js'))

  // Main HTML file
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} - Powered by Nalth</title>
  <link rel="stylesheet" href="/styles/main.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>">
</head>
<body>
  <div id="app">
    <header class="hero">
      <div class="hero-content">
        <div class="logo">🛡️</div>
        <h1 class="hero-title">Welcome to <span class="brand">Nalth</span></h1>
        <p class="hero-subtitle">Security-first web development framework</p>
        <div class="hero-badges">
          <span class="badge badge-success">🔒 HTTPS Enabled</span>
          <span class="badge badge-info">🛡️ Security Headers</span>
          <span class="badge badge-warning">🔥 Hot Reload</span>
        </div>
      </div>
      <div class="hero-animation">
        <div class="shield-animation"></div>
      </div>
    </header>

    <main class="main-content">
      <section class="features">
        <div class="container">
          <h2>Why Choose Nalth?</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">🔐</div>
              <h3>Security by Default</h3>
              <p>Built-in HTTPS, CSP headers, rate limiting, and XSS protection out of the box</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Optimized performance with hot reload and efficient asset serving</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🛠️</div>
              <h3>Developer Experience</h3>
              <p>Simple CLI, intuitive configuration, and powerful development tools</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3>Production Ready</h3>
              <p>Enterprise-grade security features for modern web applications</p>
            </div>
          </div>
        </div>
      </section>

      <section class="demo">
        <div class="container">
          <h2>Live Security Status</h2>
          <div class="status-grid">
            <div class="status-card">
              <div class="status-indicator" id="https-indicator"></div>
              <h4>HTTPS Connection</h4>
              <p id="https-status">Checking...</p>
            </div>
            <div class="status-card">
              <div class="status-indicator active"></div>
              <h4>Security Headers</h4>
              <p>CSP, HSTS, X-Frame-Options</p>
            </div>
            <div class="status-card">
              <div class="status-indicator" id="ws-indicator"></div>
              <h4>WebSocket Connection</h4>
              <p id="ws-status">Connecting...</p>
            </div>
            <div class="status-card">
              <div class="status-indicator active"></div>
              <h4>Rate Limiting</h4>
              <p>100 requests per 15 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section class="getting-started">
        <div class="container">
          <h2>Get Started</h2>
          <div class="code-example">
            <pre><code class="language-bash"># Create a new project
npx nalth create my-secure-app

# Start development
cd my-secure-app
npm install
nalth dev

# Build for production
nalth build</code></pre>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <p>Built with ❤️ using <strong>Nalth</strong> - The Security-First Framework</p>
      </div>
    </footer>
  </div>

  <script src="/js/main.js"></script>
</body>
</html>`

  writeFileSync(join(projectPath, 'public', 'index.html'), indexHtml)
  console.log(chalk.gray('🌐 Created public/index.html'))

  // CSS file
  const mainCss = `/* Nalth Demo Styles */
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --dark-color: #1f2937;
  --light-color: #f8fafc;
  --border-radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--dark-color);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(30, 64, 175, 0.9));
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
}

.logo {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand {
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.badge-success {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-info {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.hero-animation {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shield-animation {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  border-radius: 50%;
  position: relative;
  animation: rotate 10s linear infinite;
}

.shield-animation::before {
  content: '🛡️';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 6rem;
  animation: counter-rotate 10s linear infinite;
}

/* Main Content */
.main-content {
  background: white;
  position: relative;
  z-index: 1;
}

.features {
  padding: 5rem 0;
  background: linear-gradient(to bottom, white, #f8fafc);
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--dark-color);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.demo {
  padding: 5rem 0;
  background: var(--light-color);
}

.demo h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--dark-color);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.status-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  position: relative;
}

.status-indicator.active {
  background: var(--success-color);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.status-indicator.active::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--success-color);
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.status-card h4 {
  margin: 0 0 0.25rem 0;
  color: var(--dark-color);
}

.status-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.getting-started {
  padding: 5rem 0;
  background: white;
}

.getting-started h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--dark-color);
}

.code-example {
  background: var(--dark-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
}

.code-example code {
  color: #e5e7eb;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

.footer {
  background: var(--dark-color);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

/* Animations */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes counter-rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(-360deg); }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .shield-animation {
    width: 150px;
    height: 150px;
    margin-top: 2rem;
  }
  
  .shield-animation::before {
    font-size: 4rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
}`

  writeFileSync(join(projectPath, 'public', 'styles', 'main.css'), mainCss)
  console.log(chalk.gray('🎨 Created public/styles/main.css'))

  // JavaScript file
  const mainJs = `// Nalth Demo JavaScript
class NalthDemo {
  constructor() {
    this.init()
  }

  init() {
    this.checkHTTPS()
    this.initWebSocket()
    this.addInteractivity()
  }

  checkHTTPS() {
    const httpsIndicator = document.getElementById('https-indicator')
    const httpsStatus = document.getElementById('https-status')
    
    if (location.protocol === 'https:') {
      httpsIndicator.classList.add('active')
      httpsStatus.textContent = '✅ Secure HTTPS Connection'
    } else {
      httpsStatus.textContent = '⚠️ HTTP Mode (Development)'
    }
  }

  initWebSocket() {
    const wsIndicator = document.getElementById('ws-indicator')
    const wsStatus = document.getElementById('ws-status')
    
    try {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(\`\${protocol}//\${location.host}/__nalth_hot\`)
      
      ws.onopen = () => {
        wsIndicator.classList.add('active')
        wsStatus.textContent = '✅ Hot Reload Connected'
      }
      
      ws.onmessage = (event) => {
        if (event.data === 'reload') {
          this.showReloadNotification()
          setTimeout(() => window.location.reload(), 1000)
        }
      }
      
      ws.onerror = () => {
        wsStatus.textContent = '❌ Connection Failed'
      }
      
      ws.onclose = () => {
        wsStatus.textContent = '🔄 Reconnecting...'
        // Try to reconnect after 3 seconds
        setTimeout(() => this.initWebSocket(), 3000)
      }
    } catch (error) {
      wsStatus.textContent = '❌ WebSocket Not Available'
    }
  }

  showReloadNotification() {
    const notification = document.createElement('div')
    notification.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    \`
    notification.innerHTML = '🔄 Hot reload triggered - Updating...'
    
    const style = document.createElement('style')
    style.textContent = \`
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    \`
    document.head.appendChild(style)
    document.body.appendChild(notification)
  }

  addInteractivity() {
    // Add click effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card')
    featureCards.forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)'
        setTimeout(() => {
          card.style.transform = ''
        }, 150)
      })
    })

    // Add hover effects to status cards
    const statusCards = document.querySelectorAll('.status-card')
    statusCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const indicator = card.querySelector('.status-indicator')
        if (indicator.classList.contains('active')) {
          indicator.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)'
        }
      })
      
      card.addEventListener('mouseleave', () => {
        const indicator = card.querySelector('.status-indicator')
        if (indicator.classList.contains('active')) {
          indicator.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)'
        }
      })
    })

    // Add performance monitoring
    this.monitorPerformance()
  }

  monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0]
          const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart)
          
          console.log(\`🚀 Nalth Performance:
📊 Page Load Time: \${loadTime}ms
🔒 Security: HTTPS + CSP Headers
⚡ Hot Reload: Active
🛡️ Framework: Nalth v1.0.0\`)
        }, 100)
      })
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NalthDemo())
} else {
  new NalthDemo()
}`

  writeFileSync(join(projectPath, 'public', 'js', 'main.js'), mainJs)
  console.log(chalk.gray('⚡ Created public/js/main.js'))

  // README.md
  const readme = `# ${projectName}

A secure web application built with **Nalth** - the security-first web development framework.

## 🛡️ Features

- **🔒 HTTPS by Default** - Automatic SSL certificate generation
- **🛡️ Security Headers** - CSP, HSTS, X-Frame-Options, and more
- **🔥 Hot Reload** - Instant development feedback
- **⚡ Performance** - Optimized asset serving and compression
- **🎯 Production Ready** - Enterprise-grade security features

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
nalth dev

# Build for production
nalth build

# Preview production build
nalth preview
\`\`\`

## 📁 Project Structure

\`\`\`
${projectName}/
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
\`\`\`

## ⚙️ Configuration

Edit \`nalth.config.js\` to customize your security settings, HTTPS configuration, and more.

## 🔧 Development

- **Development Server**: \`nalth dev\` - Starts HTTPS development server
- **Production Build**: \`nalth build\` - Creates optimized production build
- **Preview**: \`nalth preview\` - Preview production build locally

## 📚 Learn More

- [Nalth Documentation](https://github.com/your-org/nalth)
- [Security Best Practices](https://github.com/your-org/nalth/docs/security)
- [Configuration Guide](https://github.com/your-org/nalth/docs/config)

---

Built with ❤️ using **Nalth** - The Security-First Framework
`

  writeFileSync(join(projectPath, 'README.md'), readme)
  console.log(chalk.gray('📖 Created README.md'))

  // .gitignore
  const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# SSL certificates (auto-generated)
.nalth/
*.pem
*.key
*.crt

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`

  writeFileSync(join(projectPath, '.gitignore'), gitignore)
  console.log(chalk.gray('🚫 Created .gitignore'))
}

async function createDefaultConfig() {
  const { writeFileSync } = await import('node:fs')
  
  const defaultConfig = `export default {
  port: 3000,
  host: 'localhost',
  https: {
    enabled: true,
    autoGenerate: true
  },
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
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  },
  cors: {
    origin: true,
    credentials: true
  },
  hotReload: true
}
`
  
  writeFileSync(join(process.cwd(), 'nalth.config.js'), defaultConfig)
  console.log(chalk.green('✓ Created nalth.config.js'))
}

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'dev':
    runDev()
    break
  case 'build':
    console.log(chalk.blue('🏗️  Building for production...'))
    console.log(chalk.yellow('Build command coming soon!'))
    break
  case 'preview':
    console.log(chalk.blue('👀 Starting preview server...'))
    console.log(chalk.yellow('Preview command coming soon!'))
    break
  case 'create':
    console.log(chalk.blue('🛡️ Creating new Nalth project...'))
    console.log(chalk.gray('Delegating to create-nalth for enhanced project scaffolding...'))
    console.log()
    
    // Use create-nalth package for project creation
    const { spawn } = await import('node:child_process')
    const createNalthArgs = args.slice(1) // Remove 'create' from args
    
    const child = spawn('npx', ['create-nalth', ...createNalthArgs], {
      stdio: 'inherit',
      shell: true
    })
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log()
        console.log(chalk.green.bold('✅ Project created successfully with create-nalth!'))
        console.log(chalk.blue('🛡️ Your secure development environment is ready!'))
      } else {
        console.log(chalk.red('❌ Failed to create project'))
        process.exit(code)
      }
    })
    break
  case '--version':
  case '-v':
    showVersion()
    break
  case '--help':
  case '-h':
  case undefined:
    showHelp()
    break
  default:
    console.log(chalk.red(`Unknown command: ${command}`))
    console.log()
    showHelp()
    process.exit(1)
}
