import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import nalthLogo from '/nalth.svg'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Security-first web development with Lit components'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`
      <div class="nalth-container">
        <header class="nalth-header">
          <div class="nalth-logo-group">
            <a href="https://nalth.pages.dev" target="_blank" rel="noopener noreferrer">
              <img src=${nalthLogo} class="nalth-logo nalth" alt="Nalth logo" />
            </a>
            <a href="https://lit.dev" target="_blank" rel="noopener noreferrer">
              <img src=${litLogo} class="nalth-logo lit" alt="Lit logo" />
            </a>
          </div>
          
          <h1 class="nalth-title">🛡️ Nalth + Lit</h1>
          <p class="nalth-subtitle">
            Security-first web development framework with Lit's reactive components
          </p>
        </header>
        
        <div class="nalth-counter">
          <div class="nalth-counter-display">${this.count}</div>
          <button class="nalth-button" @click=${this._onClick} part="button">
            🚀 Increment Securely
          </button>
          <button class="nalth-button secondary nalth-mt-md" @click=${this._openDashboard}>
            🛡️ Security Dashboard
          </button>
        </div>
        
        <footer class="nalth-footer">
          <div class="nalth-footer-links">
            <a href="https://nalth.pages.dev/docs" class="nalth-footer-link" target="_blank" rel="noopener noreferrer">
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
    `
  }

  private _onClick() {
    this.count++
  }

  private _openDashboard() {
    window.open('/__nalth/dashboard', '_blank')
  }

  static styles = css`
    @import url('./styles/nalth-design-system.css');
    
    :host {
      display: block;
      min-height: 100vh;
    }

    /* Lit-specific logo animation */
    .nalth-logo.lit:hover {
      filter: drop-shadow(0 0 20px #325cffaa);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
