import { useState, useEffect } from 'react'
import { Shield, Zap, Lock, Activity, TrendingUp, Users, Server, AlertTriangle } from 'lucide-react'

interface Metric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: any
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Security Score',
      value: '98.5%',
      change: '+2.3%',
      trend: 'up',
      icon: Shield
    },
    {
      label: 'Performance',
      value: '99.2ms',
      change: '-12%',
      trend: 'up',
      icon: Zap
    },
    {
      label: 'Active Users',
      value: '2,847',
      change: '+18%',
      trend: 'up',
      icon: Users
    },
    {
      label: 'Uptime',
      value: '99.99%',
      change: '+0.01%',
      trend: 'up',
      icon: Server
    }
  ])

  const [securityEvents, setSecurityEvents] = useState([
    { type: 'success', message: 'SSL certificate renewed successfully', time: '2 min ago' },
    { type: 'info', message: 'Security scan completed - No vulnerabilities found', time: '15 min ago' },
    { type: 'warning', message: 'Rate limit threshold reached for API endpoint', time: '1 hour ago' },
    { type: 'success', message: 'All dependencies updated to latest secure versions', time: '3 hours ago' }
  ])

  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'performance'>('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Nalth Dashboard
                </h1>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                🛡️ Secure
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Settings
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                Deploy
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your application is running smoothly with enterprise-grade security.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-2 border-b border-slate-200 dark:border-slate-800">
          {(['overview', 'security', 'performance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className={`text-sm font-semibold ${
                    metric.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {metric.label}
                </h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Events */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Security Events
              </h3>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {securityEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className={`p-2 rounded-full ${
                    event.type === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : event.type === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {event.type === 'success' ? (
                      <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : event.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {event.message}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 text-left text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center">
                <Shield className="w-4 h-4 mr-3" />
                Run Security Scan
              </button>
              <button className="w-full px-4 py-3 text-left text-sm font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center">
                <Zap className="w-4 h-4 mr-3" />
                Optimize Performance
              </button>
              <button className="w-full px-4 py-3 text-left text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center">
                <TrendingUp className="w-4 h-4 mr-3" />
                View Analytics
              </button>
              <button className="w-full px-4 py-3 text-left text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center">
                <Server className="w-4 h-4 mr-3" />
                Deploy to Production
              </button>
            </div>

            {/* System Status */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                System Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">API</span>
                  <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Database</span>
                  <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">CDN</span>
                  <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">🛡️ Built with Nalth</h3>
          <p className="text-indigo-100 mb-6">
            Your application is powered by Nalth - the security-first web framework with enterprise-grade features built-in.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Security First</h4>
                <p className="text-sm text-indigo-100">HTTPS, CSP, and security headers by default</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Lightning Fast</h4>
                <p className="text-sm text-indigo-100">Optimized builds with smart caching</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Lock className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Secure by Default</h4>
                <p className="text-sm text-indigo-100">Package scanning and vulnerability detection</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
