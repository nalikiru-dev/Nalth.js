import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import nalthLogo from '/nalth.svg'
import './app.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="nalth-container">
        <header class="nalth-header">
          <div class="nalth-logo-group">
            <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer">
              <img src={nalthLogo} class="nalth-logo nalth" alt="Nalth logo" />
            </a>
            <a href="https://preactjs.com" target="_blank" rel="noopener noreferrer">
              <img src={preactLogo} class="nalth-logo preact" alt="Preact logo" />
            </a>
          </div>

          <h1 class="nalth-title">🛡️ Nalth + Preact</h1>
          <p class="nalth-subtitle">
            Security-first web development framework with Preact's lightweight reactivity
          </p>
        </header>

        {/* Features Grid */}
        <div class="nalth-features">
          <div class="nalth-feature-card">
            <span class="nalth-feature-icon">🛡️</span>
            <h3 class="nalth-feature-title">Security First</h3>
            <p class="nalth-feature-description">
              Built with CSP, HTTPS, and enterprise-grade security headers by default
            </p>
          </div>

          <div class="nalth-feature-card">
            <span class="nalth-feature-icon">⚡</span>
            <h3 class="nalth-feature-title">Lightning Fast</h3>
            <p class="nalth-feature-description">
              Native ESM support with Preact's lightweight 3KB runtime
            </p>
          </div>

          <div class="nalth-feature-card">
            <span class="nalth-feature-icon">🔷</span>
            <h3 class="nalth-feature-title">TypeScript Ready</h3>
            <p class="nalth-feature-description">
              Full TypeScript support with Preact's type-safe hooks
            </p>
          </div>

          <div class="nalth-feature-card">
            <span class="nalth-feature-icon">🔒</span>
            <h3 class="nalth-feature-title">Zero Trust</h3>
            <p class="nalth-feature-description">
              Real-time security monitoring with CSP violation tracking
            </p>
          </div>
        </div>

        <div class="nalth-counter">
          <div class="nalth-counter-display">{count}</div>
          <button class="nalth-button" onClick={() => setCount((count) => count + 1)}>
            🚀 Increment Securely
          </button>
          <button
            class="nalth-button secondary nalth-mt-md"
            onClick={() => window.open('/__nalth/dashboard', '_blank')}
          >
            🛡️ Security Dashboard
          </button>
        </div>

        <footer class="nalth-footer">
          <div class="nalth-footer-links">
            <a
              href="https://www.nalthjs.com/docs"
              class="nalth-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              📚 Documentation
            </a>
            <a
              href="https://github.com/nalikiru-dev/nalth.js"
              class="nalth-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              💻 GitHub
            </a>
            <a href="/__nalth/dashboard" class="nalth-footer-link">
              🛡️ Security Dashboard
            </a>
          </div>
          <p>&copy; 2024 Nalth Framework. Security-first development.</p>
        </footer>
      </div>
    </>
  )
}
