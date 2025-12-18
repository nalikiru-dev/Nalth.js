import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [activeTab] = useState('dashboard')

  return (
    <div id="app">
      {/* Navbar */}
      <nav className="app-header">
        <div className="logo-group">
          <a href="https://nalthjs.com" target="_blank" rel="noopener noreferrer">
            <img src="/nalth.svg" className="logo" alt="Nalth Logo" />
          </a>
          <span style={{ fontSize: '1.5rem', color: 'var(--glass-border)' }}>/</span>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo" alt="React Logo" style={{ height: '2rem' }} />
          </a>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className="badge security">● System Secure</span>
          <a href="https://github.com/nalikiru-dev/nalth.js" target="_blank" className="nalth-btn secondary" style={{ padding: '0.5rem 1rem' }}>
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="badge security" style={{ marginBottom: '1.5rem' }}>Enterprise Security Framework</div>
        <h1 className="hero-title">
          Build <span className="title-gradient">Unbreakable</span><br />
          Web Applications
        </h1>
        <p className="hero-subtitle">
          Nalth combines rust-based tooling with enterprise-grade security defaults.
          Zero-config policies, automated audits, and instant deployments.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <button className="nalth-btn primary">
            Explore Dashboard
          </button>
          <button className="nalth-btn secondary">
            Read Documentation
          </button>
        </div>

        {/* Security Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Overall Score */}
          <div className="glass-panel feature-card">
            <span className="feature-icon">🛡️</span>
            <h3>Security Score</h3>
            <div className="metric-value">98/100</div>
            <p style={{ color: 'var(--text-secondary)' }}>Real-time heuristic analysis</p>
          </div>

          {/* HTTPS Status */}
          <div className="glass-panel feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Encryption</h3>
            <div className="metric-value" style={{ color: 'var(--accent-success)' }}>TLS 1.3</div>
            <p style={{ color: 'var(--text-secondary)' }}>Zero-config auto-cert generation</p>
          </div>

          {/* Active Policies */}
          <div className="glass-panel feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Active Policies</h3>
            <div className="metric-value" style={{ color: 'var(--secondary-neon)' }}>12</div>
            <p style={{ color: 'var(--text-secondary)' }}>CSP, HSTS, and Frame-Options active</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-links">
          <a href="#" className="footer-link">Documentation</a>
          <a href="#" className="footer-link">Security Guide</a>
          <a href="#" className="footer-link">API Reference</a>
        </div>
        <p>&copy; {new Date().getFullYear()} NMS (Nalth Management System). Open Source Software.</p>
      </footer>
    </div>
  )
}

export default App
