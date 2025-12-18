import './style.css'
import typescriptLogo from './typescript.svg'
import nalthLogo from '/nalth.svg'
import { SecurityDashboard } from './security-dashboard'
import { SafeHTMLRenderer } from './utils/security'

// Initialize security utilities
const renderer = new SafeHTMLRenderer()

// Security metrics simulation
class SecurityMetrics {
  private metrics = {
    https: 100,
    csp: 98,
    headers: 96,
    monitoring: 94,
  }

  getOverallScore(): number {
    const values = Object.values(this.metrics)
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
  }

  getMetrics() {
    return { ...this.metrics }
  }

  updateMetrics() {
    // Simulate real-time updates
    Object.keys(this.metrics).forEach((key) => {
      const current = this.metrics[key as keyof typeof this.metrics]
      this.metrics[key as keyof typeof this.metrics] = Math.max(
        85,
        Math.min(100, current + (Math.random() - 0.5) * 2),
      )
    })
  }
}

const securityMetrics = new SecurityMetrics()
const dashboard = new SecurityDashboard(securityMetrics)

// Main application
function createApp(): string {
  const overallScore = securityMetrics.getOverallScore()
  const metrics = securityMetrics.getMetrics()

  return `
    <div id="app">
      <!-- Navbar -->
      <nav class="app-header">
        <div class="logo-group">
          <a href="https://nalthjs.com" target="_blank" rel="noopener">
            <img src="${nalthLogo}" class="logo" alt="Nalth Logo" />
          </a>
          <span style="font-size: 1.5rem; color: var(--glass-border)">/</span>
          <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">
            <img src="${typescriptLogo}" class="logo" alt="TypeScript Logo" style="height: 2rem" />
          </a>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center">
          <span class="badge security">● System Secure</span>
          <a href="https://github.com/nalikiru-dev/nalth.js" target="_blank" class="nalth-btn secondary" style="padding: 0.5rem 1rem">
            GitHub
          </a>
        </div>
      </nav>

      <!-- Hero Section -->
      <main class="hero-section">
        <div class="badge security" style="margin-bottom: 1.5rem">Enterprise Security Framework</div>
        <h1 class="hero-title">
          Build <span class="title-gradient">Unbreakable</span><br />
          Web Applications
        </h1>
        <p class="hero-subtitle">
          Nalth combines rust-based tooling with enterprise-grade security defaults.
          Zero-config policies, automated audits, and instant deployments.
        </p>
        
        <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 4rem">
          <button id="dashboard-btn" class="nalth-btn primary">
            Explore Dashboard
          </button>
          <button id="docs-btn" class="nalth-btn secondary">
            Read Documentation
          </button>
        </div>

        <!-- Security Dashboard Grid -->
        <div class="dashboard-grid">
          <!-- Overall Score -->
          <div class="glass-panel feature-card">
            <span class="feature-icon">🛡️</span>
            <h3>Security Score</h3>
            <div class="metric-value">${overallScore}/100</div>
            <p style="color: var(--text-secondary)">Real-time heuristic analysis</p>
          </div>

          <!-- HTTPS Status -->
          <div class="glass-panel feature-card">
            <span class="feature-icon">🔒</span>
            <h3>Encryption</h3>
            <div class="metric-value" style="color: var(--accent-success)">TLS 1.3</div>
            <p style="color: var(--text-secondary)">Zero-config auto-cert generation</p>
          </div>

          <!-- Active Policies -->
          <div class="glass-panel feature-card">
            <span class="feature-icon">⚡</span>
            <h3>Active Policies</h3>
            <div class="metric-value" style="color: var(--secondary-neon)">12</div>
            <p style="color: var(--text-secondary)">CSP, HSTS, and Frame-Options active</p>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-links">
          <a href="#" class="footer-link">Documentation</a>
          <a href="#" class="footer-link">Security Guide</a>
          <a href="#" class="footer-link">API Reference</a>
        </div>
        <p>&copy; ${new Date().getFullYear()} NMS (Nalth Management System). Open Source Software.</p>
      </footer>
    </div>
  `
}

// Initialize the application
function init() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = renderer.sanitize(createApp())

  // Set up event handlers
  setupEventHandlers()

  // Start real-time updates
  setInterval(() => {
    securityMetrics.updateMetrics()
    updateUI()
  }, 5000)

  console.log('🛡️ Nalth Security Framework Initialized')
  console.log('📊 Security Dashboard Available')
  console.log('🔒 All connections secured with HTTPS')
}

function setupEventHandlers() {
  // Secure event handling
  const auditBtn = document.getElementById('audit-btn')
  const dashboardBtn = document.getElementById('dashboard-btn')
  const docsBtn = document.getElementById('docs-btn')

  auditBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    runSecurityAudit()
  })

  dashboardBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    openSecurityDashboard()
  })

  docsBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    window.open('https://www.nalthjs.com/docs', '_blank', 'noopener,noreferrer')
  })
}

function updateUI() {
  const metrics = securityMetrics.getMetrics()
  const overallScore = securityMetrics.getOverallScore()

  // Update score display
  const scoreNumber = document.querySelector('.score-number')
  const scoreFill = document.querySelector('.score-fill')

  if (scoreNumber) scoreNumber.textContent = `${overallScore}/100`
  if (scoreFill) (scoreFill as HTMLElement).style.width = `${overallScore}%`

  // Update individual metrics
  const progressBars = document.querySelectorAll('.progress-bar')
  const statusElements = document.querySelectorAll('.feature-status')

  Object.values(metrics).forEach((value, index) => {
    if (progressBars[index]) {
      ; (progressBars[index] as HTMLElement).style.width = `${value}%`
    }
    if (statusElements[index]) {
      statusElements[index].textContent = `${Math.round(value)}%`
    }
  })
}

function runSecurityAudit() {
  console.log('🔍 Running Security Audit...')
  // Simulate audit
  setTimeout(() => {
    console.log('✅ Security Audit Complete - No vulnerabilities found')
    alert(
      '🛡️ Security Audit Complete!\n\n✅ HTTPS: Enabled\n✅ CSP: Enforced\n✅ Headers: Configured\n✅ Dependencies: Secure',
    )
  }, 2000)
}

function openSecurityDashboard() {
  console.log('📊 Opening Security Dashboard...')
  dashboard.show()
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
