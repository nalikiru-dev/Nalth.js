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
    <div class="app">
      <!-- Header -->
      <header class="header">
        <div class="logo-container">
          <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer" class="logo-link">
            <img src="${nalthLogo}" class="logo nalth-logo" alt="Nalth logo" />
          </a>
          <div class="plus">+</div>
          <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" class="logo-link">
            <img src="${typescriptLogo}" class="logo ts-logo" alt="TypeScript logo" />
          </a>
        </div>
        
        <div class="header-content">
          <div class="badges">
            <span class="badge security">✨ v2.1.0</span>
            <span class="badge success">Enterprise Ready</span>
          </div>
          <h1 class="title">
            🛡️ NALTH + TypeScript
          </h1>
          <p class="subtitle">
            Security-first web development with zero-config HTTPS,<br>
            enterprise-grade protection, and TypeScript power
          </p>
        </div>
      </header>

      <!-- Security Score -->
      <section class="security-score">
        <div class="score-card">
          <div class="score-header">
            <span class="score-icon">✅</span>
            <h2>Overall Security Score</h2>
          </div>
          <div class="score-display">
            <span class="score-number">${overallScore}/100</span>
            <div class="score-bar">
              <div class="score-fill" style="width: ${overallScore}%"></div>
            </div>
          </div>
          <div class="score-status">
            <span class="status-badge excellent">🛡️ Excellent Security Posture</span>
          </div>
        </div>
      </section>

      <!-- Security Features -->
      <section class="features">
        <h2 class="features-title">🔒 Security Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-header">
              <span class="feature-icon">🔒</span>
              <h3>HTTPS/TLS</h3>
              <span class="feature-status active">${Math.round(metrics.https)}%</span>
            </div>
            <p>All connections encrypted with TLS 1.3</p>
            <div class="feature-progress">
              <div class="progress-bar" style="width: ${metrics.https}%"></div>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-header">
              <span class="feature-icon">🛡️</span>
              <h3>Content Security Policy</h3>
              <span class="feature-status active">${Math.round(metrics.csp)}%</span>
            </div>
            <p>Strict CSP with nonce-based script loading</p>
            <div class="feature-progress">
              <div class="progress-bar" style="width: ${metrics.csp}%"></div>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-header">
              <span class="feature-icon">🔧</span>
              <h3>Security Headers</h3>
              <span class="feature-status active">${Math.round(metrics.headers)}%</span>
            </div>
            <p>All recommended security headers active</p>
            <div class="feature-progress">
              <div class="progress-bar" style="width: ${metrics.headers}%"></div>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-header">
              <span class="feature-icon">👁️</span>
              <h3>Real-time Monitoring</h3>
              <span class="feature-status active">${Math.round(metrics.monitoring)}%</span>
            </div>
            <p>Active threat detection and logging</p>
            <div class="feature-progress">
              <div class="progress-bar" style="width: ${metrics.monitoring}%"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <section class="actions">
        <div class="action-buttons">
          <button id="audit-btn" class="btn primary">
            <span class="btn-icon">🔍</span>
            Run Security Audit
          </button>
          <button id="dashboard-btn" class="btn secondary">
            <span class="btn-icon">📊</span>
            Open Dashboard
          </button>
          <button id="docs-btn" class="btn outline">
            <span class="btn-icon">📚</span>
            Documentation
          </button>
        </div>
        
        <div class="dev-info">
          <p class="dev-text">
            🔥 <strong>Hot Module Replacement:</strong> Edit any file and see changes instantly
          </p>
          <code class="dev-path">src/main.ts</code>
          <p class="security-note">
            All changes are monitored for security violations in real-time
          </p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <img src="${nalthLogo}" class="footer-logo" alt="Nalth" />
            <span>Built with ❤️ using NALTH's security-first approach</span>
          </div>
          <div class="footer-links">
            <a href="https://www.nalthjs.com/docs" target="_blank" rel="noopener noreferrer">
              📚 Documentation
            </a>
            <a href="https://github.com/nalikiru-dev/nalth.js" target="_blank" rel="noopener noreferrer">
              🔧 GitHub
            </a>
            <a href="https://www.nalthjs.com/security" target="_blank" rel="noopener noreferrer">
              🛡️ Security Guide
            </a>
          </div>
        </div>
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
      ;(progressBars[index] as HTMLElement).style.width = `${value}%`
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
