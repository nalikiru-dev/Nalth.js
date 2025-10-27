<script setup lang="ts">
import { ref } from 'vue'
import SecurityBadge from './components/SecurityBadge.vue'

const count = ref(0)

const increment = () => {
  count.value++
}

const openDashboard = () => {
  window.open('/__nalth/dashboard', '_blank')
}
</script>

<template>
  <div class="nalth-container">
    <!-- Header Section -->
    <header class="nalth-header">
      <div class="nalth-logo-group">
        <a href="https://www.nalthjs.com" target="_blank" rel="noopener noreferrer">
          <img src="/nalth.svg" class="nalth-logo nalth" alt="Nalth logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
          <img src="./assets/vue.svg" class="nalth-logo vue" alt="Vue logo" />
        </a>
      </div>
      
      <h1 class="nalth-title">🛡️ Nalth + Vue</h1>
      <p class="nalth-subtitle">
        Security-first web development framework with Vue.js reactivity and native ESM support
      </p>
      
      <SecurityBadge :score="95" />
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
          Native ESM support with esbuild transformation and Vue 3 Composition API
        </p>
      </div>

      <div class="nalth-feature-card">
        <span class="nalth-feature-icon">🔷</span>
        <h3 class="nalth-feature-title">TypeScript Ready</h3>
        <p class="nalth-feature-description">
          Full TypeScript support with Vue SFC and script setup syntax
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
      <div class="nalth-counter-display">{{ count }}</div>
      <button class="nalth-button" @click="increment">
        🚀 Increment Securely
      </button>
      <button class="nalth-button secondary nalth-mt-md" @click="openDashboard">
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
</template>

<style>
@import './styles/nalth-design-system.css';
</style>
