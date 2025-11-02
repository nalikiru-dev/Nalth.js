<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <!-- Header -->
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Nalth Dashboard
              </h1>
            </div>
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              🛡️ Vue Powered
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Settings
            </button>
            <button class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30">
              Deploy
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome to Vue + Nalth! 👋
        </h2>
        <p class="text-slate-600 dark:text-slate-400">
          Your Vue application is secured with enterprise-grade protection.
        </p>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="(metric, index) in metrics" :key="index"
          class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <component :is="metric.icon" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span :class="metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              class="text-sm font-semibold">
              {{ metric.change }}
            </span>
          </div>
          <h3 class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {{ metric.label }}
          </h3>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">
            {{ metric.value }}
          </p>
        </div>
      </div>

      <!-- Feature Highlights -->
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white shadow-2xl">
        <h3 class="text-2xl font-bold mb-4">🛡️ Built with Nalth + Vue</h3>
        <p class="text-emerald-100 mb-6">
          Combining Vue's reactivity with Nalth's security-first approach for unbeatable performance and protection.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h4 class="font-semibold mb-1">Reactive Security</h4>
              <p class="text-sm text-emerald-100">Real-time security monitoring with Vue's reactivity</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h4 class="font-semibold mb-1">Lightning Fast</h4>
              <p class="text-sm text-emerald-100">Optimized builds with Vue 3 Composition API</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h4 class="font-semibold mb-1">Secure by Default</h4>
              <p class="text-sm text-emerald-100">HTTPS, CSP, and security headers built-in</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const metrics = ref([
  {
    label: 'Security Score',
    value: '98.5%',
    change: '+2.3%',
    trend: 'up',
    icon: 'shield'
  },
  {
    label: 'Performance',
    value: '99.2ms',
    change: '-12%',
    trend: 'up',
    icon: 'zap'
  },
  {
    label: 'Active Users',
    value: '2,847',
    change: '+18%',
    trend: 'up',
    icon: 'users'
  },
  {
    label: 'Uptime',
    value: '99.99%',
    change: '+0.01%',
    trend: 'up',
    icon: 'server'
  }
])
</script>
