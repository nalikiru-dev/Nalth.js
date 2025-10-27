import { useState } from 'react'
import reactLogo from './assets/react.svg'
import nalthLogo from '/nalth.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logos">
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
            <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer">
              <img src={nalthLogo} className="logo nalth" alt="Nalth logo" />
            </a>
          </div>
          <h1>🛡️ Nalth + React</h1>
          <p className="subtitle">
            Security-first web development framework with native ESM support
          </p>
        </div>

        {/* Features Grid */}
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Security First</h3>
            <p>Built with security headers and best practices by default</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Native ESM support with esbuild transformation</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔷</div>
            <h3>TypeScript</h3>
            <p>Full TypeScript support with JSX transformation</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Zero Config</h3>
            <p>Works out of the box with minimal configuration</p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="demo-card">
          <h2>Interactive Demo</h2>
          <p>Click the button to test React state management</p>
          <div className="counter">
            <div className="count-badge">Count: {count}</div>
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="count-button"
            >
              Click me! 🚀
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Edit <code>src/App.tsx</code> and save to test HMR</p>
          <div className="links">
            <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer">
              📚 Documentation
            </a>
            <a href="https://github.com/nalikiru-dev/nalth.js" target="_blank" rel="noopener noreferrer">
              🔧 GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
