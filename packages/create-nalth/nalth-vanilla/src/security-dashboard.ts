import { SecurityLogger, CSPValidator } from './utils/security'

export class SecurityDashboard {
  private logger = SecurityLogger.getInstance()
  private cspValidator = new CSPValidator()
  private isVisible = false
  private metrics: any

  constructor(securityMetrics: any) {
    this.metrics = securityMetrics
  }

  show() {
    if (this.isVisible) return

    this.createDashboard()
    this.isVisible = true
  }

  hide() {
    const dashboard = document.getElementById('security-dashboard')
    if (dashboard) {
      dashboard.remove()
    }
    this.isVisible = false
  }

  private createDashboard() {
    const dashboard = document.createElement('div')
    dashboard.id = 'security-dashboard'
    dashboard.className = 'security-dashboard'
    
    const events = this.logger.getEvents()
    const violations = this.cspValidator.getViolations()
    const metrics = this.metrics.getMetrics()

    dashboard.innerHTML = `
      <div class="dashboard-overlay">
        <div class="dashboard-modal">
          <div class="dashboard-header">
            <h2>🔒 Security Dashboard</h2>
            <button class="close-btn" onclick="this.closest('.security-dashboard').remove()">&times;</button>
          </div>
          
          <div class="dashboard-content">
            <div class="dashboard-tabs">
              <button class="tab-btn active" data-tab="overview">Overview</button>
              <button class="tab-btn" data-tab="events">Events</button>
              <button class="tab-btn" data-tab="violations">CSP</button>
            </div>

            <div class="tab-content active" data-tab="overview">
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-header">
                    <span class="metric-icon">🔒</span>
                    <h3>HTTPS/TLS</h3>
                  </div>
                  <div class="metric-value">${Math.round(metrics.https)}%</div>
                  <div class="metric-description">TLS 1.3 Encryption Active</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-header">
                    <span class="metric-icon">🛡️</span>
                    <h3>Content Security Policy</h3>
                  </div>
                  <div class="metric-value">${Math.round(metrics.csp)}%</div>
                  <div class="metric-description">Strict CSP Enforced</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-header">
                    <span class="metric-icon">🔧</span>
                    <h3>Security Headers</h3>
                  </div>
                  <div class="metric-value">${Math.round(metrics.headers)}%</div>
                  <div class="metric-description">All Headers Configured</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-header">
                    <span class="metric-icon">👁️</span>
                    <h3>Monitoring</h3>
                  </div>
                  <div class="metric-value">${Math.round(metrics.monitoring)}%</div>
                  <div class="metric-description">Real-time Protection</div>
                </div>
              </div>
            </div>

            <div class="tab-content" data-tab="events">
              <div class="events-list">
                <h3>Security Events (${events.length})</h3>
                ${events.length === 0 ? 
                  '<p class="no-events">No security events recorded</p>' :
                  events.slice(-10).reverse().map(event => `
                    <div class="event-item ${event.level}">
                      <div class="event-time">${event.timestamp.toLocaleTimeString()}</div>
                      <div class="event-level">${event.level.toUpperCase()}</div>
                      <div class="event-message">${event.message}</div>
                    </div>
                  `).join('')
                }
              </div>
            </div>

            <div class="tab-content" data-tab="violations">
              <div class="violations-list">
                <h3>CSP Violations (${violations.length})</h3>
                ${violations.length === 0 ?
                  '<p class="no-violations">✅ No CSP violations detected</p>' :
                  violations.slice(-10).reverse().map(violation => `
                    <div class="violation-item">
                      <div class="violation-time">${violation.timestamp.toLocaleTimeString()}</div>
                      <div class="violation-directive">${violation.directive}</div>
                      <div class="violation-uri">${violation.blockedURI}</div>
                    </div>
                  `).join('')
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Add styles
    const style = document.createElement('style')
    style.textContent = this.getDashboardStyles()
    dashboard.appendChild(style)

    // Add event listeners for tabs
    const tabBtns = dashboard.querySelectorAll('.tab-btn')
    const tabContents = dashboard.querySelectorAll('.tab-content')

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab')
        
        tabBtns.forEach(b => b.classList.remove('active'))
        tabContents.forEach(c => c.classList.remove('active'))
        
        btn.classList.add('active')
        const content = dashboard.querySelector(`[data-tab="${tabName}"]`)
        if (content) content.classList.add('active')
      })
    })

    document.body.appendChild(dashboard)
  }

  private getDashboardStyles(): string {
    return `
      .security-dashboard {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10000;
      }

      .dashboard-overlay {
        background: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      }

      .dashboard-modal {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e2e8f0;
      }

      .dashboard-header h2 {
        margin: 0;
        font-size: 24px;
        color: #1a202c;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #718096;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }

      .close-btn:hover {
        background: #f7fafc;
        color: #2d3748;
      }

      .dashboard-tabs {
        display: flex;
        border-bottom: 1px solid #e2e8f0;
        padding: 0 24px;
      }

      .tab-btn {
        background: none;
        border: none;
        padding: 12px 16px;
        cursor: pointer;
        color: #718096;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
      }

      .tab-btn.active {
        color: #3182ce;
        border-bottom-color: #3182ce;
      }

      .tab-content {
        display: none;
        padding: 24px;
      }

      .tab-content.active {
        display: block;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      .metric-card {
        background: #f7fafc;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e2e8f0;
      }

      .metric-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .metric-icon {
        font-size: 20px;
      }

      .metric-header h3 {
        margin: 0;
        font-size: 16px;
        color: #2d3748;
      }

      .metric-value {
        font-size: 32px;
        font-weight: bold;
        color: #38a169;
        margin-bottom: 4px;
      }

      .metric-description {
        color: #718096;
        font-size: 14px;
      }

      .events-list h3, .violations-list h3 {
        margin: 0 0 16px 0;
        color: #2d3748;
      }

      .event-item, .violation-item {
        background: #f7fafc;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        border-left: 4px solid #e2e8f0;
      }

      .event-item.warn {
        border-left-color: #f6ad55;
      }

      .event-item.error {
        border-left-color: #fc8181;
      }

      .event-item.info {
        border-left-color: #63b3ed;
      }

      .event-time, .violation-time {
        font-size: 12px;
        color: #718096;
        margin-bottom: 4px;
      }

      .event-level {
        display: inline-block;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 4px;
        background: #e2e8f0;
        color: #4a5568;
        margin-bottom: 4px;
      }

      .event-message {
        font-weight: 500;
        color: #2d3748;
      }

      .no-events, .no-violations {
        text-align: center;
        color: #718096;
        padding: 40px;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (prefers-color-scheme: dark) {
        .dashboard-modal {
          background: #1a202c;
          color: #e2e8f0;
        }

        .dashboard-header {
          border-bottom-color: #2d3748;
        }

        .dashboard-header h2 {
          color: #e2e8f0;
        }

        .dashboard-tabs {
          border-bottom-color: #2d3748;
        }

        .tab-btn {
          color: #a0aec0;
        }

        .tab-btn.active {
          color: #63b3ed;
          border-bottom-color: #63b3ed;
        }

        .metric-card {
          background: #2d3748;
          border-color: #4a5568;
        }

        .event-item, .violation-item {
          background: #2d3748;
        }
      }
    `
  }
}