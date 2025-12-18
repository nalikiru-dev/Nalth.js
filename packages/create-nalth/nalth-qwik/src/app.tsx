import { component$, useSignal } from '@builder.io/qwik'

import qwikLogo from './assets/qwik.svg'
import './app.css'

export const App = component$(() => {
  const activeTab = useSignal('dashboard')

  return (
    <div id="app">
      {/* Navbar */}
      <nav class="app-header">
        <div class="logo-group">
          <a href="https://nalthjs.com" target="_blank" rel="noopener noreferrer">
            <img src="/nalth.svg" class="logo" alt="Nalth Logo" />
          </a>
          <span style="font-size: 1.5rem; color: var(--glass-border)">/</span>
          <a href="https://qwik.dev" target="_blank" rel="noopener noreferrer">
            <img src={qwikLogo} class="logo" alt="Qwik Logo" style="height: 2rem" />
          </a>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center">
          <span class="badge security">● System Secure</span>
          <a href="https://github.com/nalikiru-dev/nalth.js" target="_blank" class="nalth-btn secondary" style="padding: 0.5rem 1rem">
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
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
          <button class="nalth-btn primary">
            Explore Dashboard
          </button>
          <button class="nalth-btn secondary">
            Read Documentation
          </button>
        </div>

        {/* Security Dashboard Grid */}
        <div class="dashboard-grid">
          {/* Overall Score */}
          <div class="glass-panel feature-card">
            <span class="feature-icon">🛡️</span>
            <h3>Security Score</h3>
            <div class="metric-value">98/100</div>
            <p style="color: var(--text-secondary)">Real-time heuristic analysis</p>
          </div>

          {/* HTTPS Status */}
          <div class="glass-panel feature-card">
            <span class="feature-icon">🔒</span>
            <h3>Encryption</h3>
            <div class="metric-value" style="color: var(--accent-success)">TLS 1.3</div>
            <p style="color: var(--text-secondary)">Zero-config auto-cert generation</p>
          </div>

          {/* Active Policies */}
          <div class="glass-panel feature-card">
            <span class="feature-icon">⚡</span>
            <h3>Active Policies</h3>
            <div class="metric-value" style="color: var(--secondary-neon)">12</div>
            <p style="color: var(--text-secondary)">CSP, HSTS, and Frame-Options active</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="app-footer">
        <div class="footer-links">
          <a href="#" class="footer-link">Documentation</a>
          <a href="#" class="footer-link">Security Guide</a>
          <a href="#" class="footer-link">API Reference</a>
        </div>
        <p>&copy; {new Date().getFullYear()} NMS (Nalth Management System). Open Source Software.</p>
      </footer>
    </div>
  )
})
