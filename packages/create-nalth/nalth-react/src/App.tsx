import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { SecurityBadge } from './components/SecurityBadge'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Simple client-side routing
  const path = window.location.pathname

  // Render dashboard if path matches
  if (path === '/__nalth/dashboard' || path === '/dashboard') {
    return <Dashboard />
  }

  return (
    <div className="app">
      <div className="nalth-container">
        {/* Hero Section */}
        <header className="nalth-header">
          <div className="nalth-logo-group">
            <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer">
              <img src="/nalth.svg" className="nalth-logo nalth" alt="Nalth logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="nalth-logo react" alt="React logo" />
            </a>
          </div>

          <h1 className="nalth-title">Nalth + React</h1>
          <p className="nalth-subtitle">
            The enterprise-grade security framework for modern web applications.
            Built for speed, security, and scalability.
          </p>

          <div className="nalth-mt-lg">
            <SecurityBadge score={98} />
          </div>
        </header>

        {/* Features Grid */}
        <div className="nalth-features">
          <div className="nalth-feature-card">
            <span className="nalth-feature-icon">🛡️</span>
            <h3 className="nalth-feature-title">Enterprise Security</h3>
            <p className="nalth-feature-description">
              Automated CSP generation, SRI, and security headers out of the box.
              Zero-config protection against XSS and injection attacks.
            </p>
          </div>

          <div className="nalth-feature-card">
            <span className="nalth-feature-icon">⚡</span>
            <h3 className="nalth-feature-title">Blazing Performance</h3>
            <p className="nalth-feature-description">
              Powered by Rust-based tooling for millisecond HMR and instant builds.
              Optimized for React 19 concurrent features.
            </p>
          </div>

          <div className="nalth-feature-card">
            <span className="nalth-feature-icon">💎</span>
            <h3 className="nalth-feature-title">Premium DX</h3>
            <p className="nalth-feature-description">
              Type-safe by default. Integrated linting, formatting, and testing.
              Everything you need to ship production-grade apps.
            </p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="demo-card">
          <h2>Interactive State Demo</h2>
          <p>Experience the reactive performance of Nalth + React.</p>
          <div className="nalth-counter">
            <div className="nalth-counter-display">{count}</div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="nalth-button" onClick={() => setCount((count) => count + 1)}>
                🚀 Increment
              </button>
              <button
                className="nalth-button secondary"
                onClick={() => window.open('/__nalth/dashboard', '_blank')}
              >
                🛡️ View Security Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="nalth-footer">
          <div className="nalth-footer-links">
            <a href="https://www.nalthjs.com/docs" className="nalth-footer-link" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
            <a href="https://github.com/nalikiru-dev/nalth.js" className="nalth-footer-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="/__nalth/dashboard" className="nalth-footer-link">
              Security Status
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} Nalth Framework. Engineered for Security.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
