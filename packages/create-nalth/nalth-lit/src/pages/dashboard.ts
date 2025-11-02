import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

interface Metric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
}

interface SecurityEvent {
  type: 'success' | 'info' | 'warning'
  message: string
  time: string
}

@customElement('nalth-dashboard')
export class NalthDashboard extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(to bottom right, #f8fafc, #fef3c7, #fef08a);
    }

    .header {
      border-bottom: 1px solid #e2e8f0;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-content {
      max-width: 80rem;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .shield-icon {
      width: 2rem;
      height: 2rem;
      color: #eab308;
    }

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(to right, #eab308, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      background: #fef3c7;
      color: #92400e;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      color: #475569;
      background: transparent;
    }

    .btn-secondary:hover {
      color: #eab308;
    }

    .btn-primary {
      background: #eab308;
      color: white;
      box-shadow: 0 10px 15px -3px rgba(234, 179, 8, 0.3);
    }

    .btn-primary:hover {
      background: #ca8a04;
    }

    .main {
      max-width: 80rem;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome {
      margin-bottom: 2rem;
    }

    .welcome h2 {
      font-size: 1.875rem;
      font-weight: bold;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }

    .welcome p {
      color: #64748b;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s;
    }

    .metric-card:hover {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }

    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .metric-icon {
      padding: 0.75rem;
      background: #fef3c7;
      border-radius: 0.5rem;
    }

    .metric-change {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .metric-change.up {
      color: #16a34a;
    }

    .metric-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #0f172a;
    }

    .events-section {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }

    .events-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .events-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .event-item {
      display: flex;
      align-items: start;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }

    .event-item:hover {
      background: #f1f5f9;
    }

    .event-icon {
      padding: 0.5rem;
      border-radius: 9999px;
    }

    .event-icon.success {
      background: #dcfce7;
    }

    .event-icon.warning {
      background: #fef3c7;
    }

    .event-icon.info {
      background: #dbeafe;
    }

    .event-content {
      flex: 1;
    }

    .event-message {
      font-size: 0.875rem;
      font-weight: 500;
      color: #0f172a;
      margin-bottom: 0.25rem;
    }

    .event-time {
      font-size: 0.75rem;
      color: #64748b;
    }

    .feature-banner {
      background: linear-gradient(to right, #eab308, #f59e0b);
      border-radius: 0.75rem;
      padding: 2rem;
      color: white;
      box-shadow: 0 20px 25px -5px rgba(234, 179, 8, 0.3);
    }

    .feature-banner h3 {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .feature-banner p {
      color: #fef3c7;
      margin-bottom: 1.5rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .feature-item {
      display: flex;
      align-items: start;
      gap: 0.75rem;
    }

    .feature-item svg {
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
    }

    .feature-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .feature-description {
      font-size: 0.875rem;
      color: #fef3c7;
    }
  `

  @state()
  private metrics: Metric[] = [
    { label: 'Security Score', value: '98.5%', change: '+2.3%', trend: 'up' },
    { label: 'Performance', value: '99.2ms', change: '-12%', trend: 'up' },
    { label: 'Active Users', value: '2,847', change: '+18%', trend: 'up' },
    { label: 'Uptime', value: '99.99%', change: '+0.01%', trend: 'up' }
  ]

  @state()
  private securityEvents: SecurityEvent[] = [
    { type: 'success', message: 'SSL certificate renewed successfully', time: '2 min ago' },
    { type: 'info', message: 'Security scan completed - No vulnerabilities found', time: '15 min ago' },
    { type: 'warning', message: 'Rate limit threshold reached for API endpoint', time: '1 hour ago' },
    { type: 'success', message: 'All dependencies updated to latest secure versions', time: '3 hours ago' }
  ]

  render() {
    return html`
      <div class="header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-group">
              <svg class="shield-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h1 class="title">Nalth Dashboard</h1>
            </div>
            <span class="badge">🛡️ Lit Powered</span>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary">Settings</button>
            <button class="btn btn-primary">Deploy</button>
          </div>
        </div>
      </div>

      <main class="main">
        <div class="welcome">
          <h2>Welcome to Lit + Nalth! 👋</h2>
          <p>Your Lit application is secured with enterprise-grade protection.</p>
        </div>

        <div class="metrics-grid">
          ${this.metrics.map(metric => html`
            <div class="metric-card">
              <div class="metric-header">
                <div class="metric-icon">
                  <svg style="width: 1.5rem; height: 1.5rem; color: #eab308;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span class="metric-change ${metric.trend}">${metric.change}</span>
              </div>
              <div class="metric-label">${metric.label}</div>
              <div class="metric-value">${metric.value}</div>
            </div>
          `)}
        </div>

        <div class="events-section">
          <div class="events-header">
            <h3 class="events-title">
              <svg style="width: 1.25rem; height: 1.25rem; color: #eab308;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Security Events
            </h3>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">View All</button>
          </div>
          <div class="events-list">
            ${this.securityEvents.map(event => html`
              <div class="event-item">
                <div class="event-icon ${event.type}">
                  <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="event-content">
                  <div class="event-message">${event.message}</div>
                  <div class="event-time">${event.time}</div>
                </div>
              </div>
            `)}
          </div>
        </div>

        <div class="feature-banner">
          <h3>🛡️ Built with Nalth + Lit</h3>
          <p>Combining Lit's web components with Nalth's security-first approach for modern, standards-based development.</p>
          <div class="features-grid">
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <div class="feature-title">Web Standards</div>
                <div class="feature-description">Built on native web components</div>
              </div>
            </div>
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <div class="feature-title">Lightning Fast</div>
                <div class="feature-description">Minimal runtime overhead</div>
              </div>
            </div>
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <div class="feature-title">Secure by Default</div>
                <div class="feature-description">HTTPS, CSP, and security headers</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nalth-dashboard': NalthDashboard
  }
}
