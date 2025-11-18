import { createSignal, For } from 'solid-js'

interface Metric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
}

interface SecurityEvent {
  type: 'success' | 'info' | 'warning'
  message: string
  time: string
}

export default function Dashboard() {
  const [metrics] = createSignal<Metric[]>([
    { label: 'Security Score', value: '98.5%', change: '+2.3%', trend: 'up' },
    { label: 'Performance', value: '99.2ms', change: '-12%', trend: 'up' },
    { label: 'Active Users', value: '2,847', change: '+18%', trend: 'up' },
    { label: 'Uptime', value: '99.99%', change: '+0.01%', trend: 'up' }
  ])

  const [securityEvents] = createSignal<SecurityEvent[]>([
    { type: 'success', message: 'SSL certificate renewed successfully', time: '2 min ago' },
    { type: 'info', message: 'Security scan completed - No vulnerabilities found', time: '15 min ago' },
    { type: 'warning', message: 'Rate limit threshold reached for API endpoint', time: '1 hour ago' },
    { type: 'success', message: 'All dependencies updated to latest secure versions', time: '3 hours ago' }
  ])

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
      {/* Header */}
      <header class="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h1 class="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Nalth Dashboard
                </h1>
              </div>
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                🛡️ Solid Powered
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <button class="px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors">
                Settings
              </button>
              <button class="px-4 py-2 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-lg shadow-sky-500/30">
                Deploy
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-slate-900 mb-2">
            Welcome to Solid + Nalth! 👋
          </h2>
          <p class="text-slate-600">
            Your Solid application is secured with enterprise-grade protection and fine-grained reactivity.
          </p>
        </div>

        {/* Metrics Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <For each={metrics()}>
            {(metric) => (
              <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center justify-between mb-4">
                  <div class="p-3 bg-sky-100 rounded-lg">
                    <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span class={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
                <h3 class="text-sm font-medium text-slate-600 mb-1">
                  {metric.label}
                </h3>
                <p class="text-2xl font-bold text-slate-900">
                  {metric.value}
                </p>
              </div>
            )}
          </For>
        </div>

        {/* Two Column Layout */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Events */}
          <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-slate-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Security Events
              </h3>
              <button class="text-sm text-sky-600 hover:underline">
                View All
              </button>
            </div>
            <div class="space-y-4">
              <For each={securityEvents()}>
                {(event) => (
                  <div class="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div class={`p-2 rounded-full ${
                      event.type === 'success' 
                        ? 'bg-green-100' 
                        : event.type === 'warning'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">
                        {event.message}
                      </p>
                      <p class="text-xs text-slate-500 mt-1">
                        {event.time}
                      </p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Quick Actions */}
          <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 class="text-lg font-semibold text-slate-900 mb-6">
              Quick Actions
            </h3>
            <div class="space-y-3">
              <button class="w-full px-4 py-3 text-left text-sm font-medium bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors flex items-center">
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Run Security Scan
              </button>
              <button class="w-full px-4 py-3 text-left text-sm font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center">
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Optimize Performance
              </button>
              <button class="w-full px-4 py-3 text-left text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center">
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                View Analytics
              </button>
              <button class="w-full px-4 py-3 text-left text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center">
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Deploy to Production
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div class="mt-8 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl p-8 text-white shadow-2xl">
          <h3 class="text-2xl font-bold mb-4">🛡️ Built with Nalth + Solid</h3>
          <p class="text-sky-100 mb-6">
            Combining Solid's fine-grained reactivity with Nalth's security-first approach for maximum performance and protection.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <h4 class="font-semibold mb-1">Fine-Grained Reactivity</h4>
                <p class="text-sm text-sky-100">Update only what changes</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <h4 class="font-semibold mb-1">Blazing Fast</h4>
                <p class="text-sm text-sky-100">No virtual DOM overhead</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h4 class="font-semibold mb-1">Secure by Default</h4>
                <p class="text-sm text-sky-100">HTTPS, CSP, and security headers built-in</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
