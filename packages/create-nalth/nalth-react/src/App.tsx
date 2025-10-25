import { useState } from 'react'
import reactLogo from './assets/react.svg'
import nalthLogo from './assets/nalth.svg'
import { SecurityBadge } from './components/SecurityBadge'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <div className="nalth-container">
        {/* Header Section */}
        <header className="nalth-header">
          <div className="nalth-logo-group">
            <a href="https://nalth.pages.dev" target="_blank" rel="noopener noreferrer">
              <img src={nalthLogo} className="nalth-logo nalth" alt="Nalth logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="nalth-logo react" alt="React logo" />
            </a>
          </div>
          
          <h1 className="nalth-title">🛡️ Nalth + React</h1>
          <p className="nalth-subtitle">
            Security-first web development framework with React 19 and native ESM support
          </p>
          
          <SecurityBadge score={95} />
        </header>

        {/* Features Grid */}
        <div className="nalth-features">
          <div className="nalth-feature-card">
            <span className="nalth-feature-icon">🛡️</span>
            <h3 className="nalth-feature-title">Security First</h3>
            <p className="nalth-feature-description">
              Built with CSP, HTTPS, and enterprise-grade security headers by default
            </p>
          </div>

          <div className="nalth-feature-card">
            <span className="nalth-feature-icon">⚡</span>
            <h3 className="nalth-feature-title">Lightning Fast</h3>
            <p className="nalth-feature-description">
              Native ESM support with esbuild transformation and React 19 features
            </p>
          </div>

          <div className="nalth-feature-card">
            <span className="nalth-feature-icon">🔷</span>
            <h3 className="nalth-feature-title">TypeScript Ready</h3>
            <p className="nalth-feature-description">
              Full TypeScript support with JSX transformation and strict mode
            </p>
          </div>

          <div className="nalth-feature-card">
            <span className="nalth-feature-icon">🔒</span>
            <h3 className="nalth-feature-title">Zero Trust</h3>
            <p className="nalth-feature-description">
              Real-time security monitoring with CSP violation tracking
            </p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="demo-card">
          <h2>Interactive Demo</h2>
          <p>Click the button to test React state management</p>
          <div className="nalth-counter">
            <div className="nalth-counter-display">{count}</div>
            <button className="nalth-button" onClick={() => setCount((count) => count + 1)}>
              🚀 Increment Securely
            </button>
            <button 
              className="nalth-button secondary nalth-mt-md"
              onClick={() => window.open('/__nalth/dashboard', '_blank')}
            >
              🛡️ Security Dashboard
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="nalth-footer">
          <div className="nalth-footer-links">
            <a href="https://nalth.pages.dev/docs" className="nalth-footer-link" target="_blank" rel="noopener noreferrer">
              📚 Documentation
            </a>
            <a href="https://github.com/nalikiru-dev/nalth.js" className="nalth-footer-link" target="_blank" rel="noopener noreferrer">
              💻 GitHub
            </a>
            <a href="/__nalth/dashboard" className="nalth-footer-link">
              🛡️ Security Dashboard
            </a>
          </div>
          <p>&copy; 2024 Nalth Framework. Security-first development.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
