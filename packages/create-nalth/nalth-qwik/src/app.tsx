import { component$, useSignal } from '@builder.io/qwik'

import qwikLogo from './assets/qwik.svg'
import nalthLogo from '/nalth.svg'
import './app.css'

export const App = component$(() => {
  const count = useSignal(0)

  return (
    <>
      <div class="nalth-container">
        <header class="nalth-header">
          <div class="nalth-logo-group">
            <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer">
              <img src={nalthLogo} class="nalth-logo nalth" alt="Nalth logo" />
            </a>
            <a href="https://qwik.dev" target="_blank" rel="noopener noreferrer">
              <img src={qwikLogo} class="nalth-logo qwik" alt="Qwik logo" />
            </a>
          </div>
          
          <h1 class="nalth-title">🛡️ Nalth + Qwik</h1>
          <p class="nalth-subtitle">
            Security-first web development framework with Qwik's resumable architecture
          </p>
        </header>
        
        <div class="nalth-counter">
          <div class="nalth-counter-display">{count.value}</div>
          <button class="nalth-button" onClick$={() => count.value++}>
            🚀 Increment Securely
          </button>
          <button class="nalth-button secondary nalth-mt-md" onClick$={() => window.open('/__nalth/dashboard', '_blank')}>
            🛡️ Security Dashboard
          </button>
        </div>
        
        <footer class="nalth-footer">
          <div class="nalth-footer-links">
            <a href="https://www.nalthjs.com/docs" class="nalth-footer-link" target="_blank" rel="noopener noreferrer">
              📚 Documentation
            </a>
            <a href="https://github.com/nalikiru-dev/nalth.js" class="nalth-footer-link" target="_blank" rel="noopener noreferrer">
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
})
