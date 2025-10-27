<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import nalthLogo from '/nalth.svg'
  import Counter from './lib/Counter.svelte'
  import SecurityBadge from './lib/SecurityBadge.svelte'

  function openDashboard() {
    window.open('/__nalth/dashboard', '_blank')
  }
</script>

<div class="nalth-container">
  <!-- Header Section -->
  <header class="nalth-header">
    <div class="nalth-logo-group">
      <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer">
        <img src={nalthLogo} class="nalth-logo nalth" alt="Nalth logo" />
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer">
        <img src={svelteLogo} class="nalth-logo svelte" alt="Svelte logo" />
      </a>
    </div>
    
    <h1 class="nalth-title">🛡️ Nalth + Svelte</h1>
    <p class="nalth-subtitle">
      Security-first web development framework with Svelte reactivity and native ESM support
    </p>
    
    <SecurityBadge score={95} />
  </header>

  <!-- Features Grid -->
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
        Native ESM support with esbuild transformation and Svelte compilation
      </p>
    </div>

    <div class="nalth-feature-card">
      <span class="nalth-feature-icon">🔷</span>
      <h3 class="nalth-feature-title">TypeScript Ready</h3>
      <p class="nalth-feature-description">
        Full TypeScript support with Svelte components and stores
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

  <!-- Interactive Counter -->
  <div class="nalth-counter">
    <Counter />
    <button class="nalth-button secondary nalth-mt-md" on:click={openDashboard}>
      🛡️ Security Dashboard
    </button>
  </div>

  <!-- Footer -->
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

<style>
  @import './styles/nalth-design-system.css';
  
  /* Svelte logo animation */
  @keyframes svelte-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  :global(.nalth-logo.svelte:hover) {
    animation: svelte-pulse 1s ease-in-out;
    filter: drop-shadow(0 0 20px #ff3e00aa);
  }
</style>
