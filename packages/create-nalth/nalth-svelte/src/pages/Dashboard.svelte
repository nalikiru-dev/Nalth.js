<script lang="ts">
  let metrics = [
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
  ]

  let securityEvents = [
    { type: 'success', message: 'SSL certificate renewed successfully', time: '2 min ago' },
    { type: 'info', message: 'Security scan completed - No vulnerabilities found', time: '15 min ago' },
    { type: 'warning', message: 'Rate limit threshold reached for API endpoint', time: '1 hour ago' },
    { type: 'success', message: 'All dependencies updated to latest secure versions', time: '3 hours ago' }
  ]
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
  <!-- Header -->
  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Nalth Dashboard
            </h1>
          </div>
          <span class="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            🛡️ Svelte Powered
          </span>
        </div>
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Settings
          </button>
          <button class="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30">
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
        Welcome to Svelte + Nalth! 👋
      </h2>
      <p class="text-slate-600 dark:text-slate-400">
        Your Svelte application is secured with enterprise-grade protection.
      </p>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {#each metrics as metric, index}
        <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span class={metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} class="text-sm font-semibold">
              {metric.change}
            </span>
          </div>
          <h3 class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {metric.label}
          </h3>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">
            {metric.value}
          </p>
        </div>
      {/each}
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Security Events -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Security Events
          </h3>
          <button class="text-sm text-orange-600 dark:text-orange-400 hover:underline">
            View All
          </button>
        </div>
        <div class="space-y-4">
          {#each securityEvents as event, index}
            <div class="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div class={event.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 p-2 rounded-full' : event.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full' : 'bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full'}>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  {event.message}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {event.time}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        <div class="space-y-3">
          <button class="w-full px-4 py-3 text-left text-sm font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            🛡️ Run Security Scan
          </button>
          <button class="w-full px-4 py-3 text-left text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            ⚡ Optimize Performance
          </button>
          <button class="w-full px-4 py-3 text-left text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            📊 View Analytics
          </button>
          <button class="w-full px-4 py-3 text-left text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            🚀 Deploy to Production
          </button>
        </div>
      </div>
    </div>

    <!-- Feature Highlights -->
    <div class="mt-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white shadow-2xl">
      <h3 class="text-2xl font-bold mb-4">🛡️ Built with Nalth + Svelte</h3>
      <p class="text-orange-100 mb-6">
        Combining Svelte's compiler magic with Nalth's security-first approach for unbeatable performance and protection.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h4 class="font-semibold mb-1">Compiled Security</h4>
            <p class="text-sm text-orange-100">Security checks compiled at build time</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div>
            <h4 class="font-semibold mb-1">Zero Runtime</h4>
            <p class="text-sm text-orange-100">Smallest bundle size with maximum security</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <h4 class="font-semibold mb-1">Secure by Default</h4>
            <p class="text-sm text-orange-100">HTTPS, CSP, and security headers built-in</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  /* Scoped styles if needed */
</style>
