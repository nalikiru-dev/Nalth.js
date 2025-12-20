import { useState, useEffect } from 'react'
import {
  Shield,
  Lock,
  Globe,
  Menu,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  Server,
  Activity,
  Ban,
  ShieldAlert,
} from 'lucide-react'

// --- Input Encryption Demo (Mechanism) ---
const InputEncryptionDemo = () => {
  const [input, setInput] = useState('')
  const [encrypted, setEncrypted] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!input) {
      setEncrypted('')
      return
    }
    // Simulation of AES-GCM Encryption
    const chars = '0123456789ABCDEF'
    const mockHash = input
      .split('')
      .map(() =>
        Array(2)
          .fill(0)
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join(''),
      )
      .join(' ')
    setEncrypted(mockHash)
  }, [input])

  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden group border-l-4 border-l-blue-500">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-3 h-3" /> Field-Level Encryption
          </h3>
          <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold uppercase">
            Active
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-600 uppercase mb-1.5 block">
              Data Stream Input
            </label>
            <div className="relative">
              <input
                type={isVisible ? 'text' : 'password'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Simulate sensitive payload..."
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
              />
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="absolute right-3 top-2 text-zinc-500 hover:text-white"
              >
                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-600 uppercase mb-1.5 block">
              Encrypted Output (AES-256-GCM)
            </label>
            <div className="w-full h-[40px] bg-blue-900/5 border border-blue-500/20 rounded px-3 py-2 text-[10px] text-blue-400 font-mono break-all overflow-hidden flex items-center">
              {encrypted || <span className="opacity-30">Waiting for data...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- CSP Visualizer (Prevention) ---
const CSPDemo = () => {
  const [status, setStatus] = useState<'secure' | 'blocked'>('secure')
  const [intrushionCount, setIntrusionCount] = useState(0)

  const triggerAttack = () => {
    setStatus('blocked')
    setIntrusionCount((p) => p + 1)
    setTimeout(() => setStatus('secure'), 2000)
  }

  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden group border-l-4 border-l-red-500">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> XSS Prevention Engine
          </h3>
          <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold uppercase">
            Enforcing
          </span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div
            className={`flex-1 h-24 rounded border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
              status === 'secure'
                ? 'bg-zinc-900/50 border-white/5'
                : 'bg-red-500/10 border-red-500/40'
            }`}
          >
            {status === 'secure' ? (
              <>
                <Shield className="w-6 h-6 text-zinc-600" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  Monitoring Traffic
                </span>
              </>
            ) : (
              <>
                <Ban className="w-8 h-8 text-red-500 animate-bounce" />
                <span className="text-[10px] font-bold text-red-500 uppercase">
                  Malicious Script Blocked
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerAttack}
            disabled={status === 'blocked'}
            className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/10 disabled:opacity-50 transition-all"
          >
            Test Script Injection
          </button>
          <div className="px-3 py-2 rounded bg-black/40 border border-white/10 flex flex-col items-center min-w-[60px]">
            <span className="text-[8px] text-zinc-500 uppercase font-black">Blocked</span>
            <span className="text-xs font-mono font-bold text-red-500">{intrushionCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Active Running Mechanisms List
  const mechanisms = [
    {
      name: 'Strict-Transport-Security',
      status: 'Enabled',
      val: 'max-age=31536000',
      color: 'text-green-500',
    },
    { name: 'X-Content-Type-Options', status: 'Enabled', val: 'nosniff', color: 'text-green-500' },
    { name: 'X-Frame-Options', status: 'Enabled', val: 'DENY', color: 'text-green-500' },
    { name: 'Referrer-Policy', status: 'Active', val: 'strict-origin', color: 'text-blue-500' },
    {
      name: 'Content-Security-Policy',
      status: 'Strict',
      val: "default-src 'self'",
      color: 'text-violet-500',
    },
    {
      name: 'Permissions-Policy',
      status: 'Active',
      val: 'camera=(), mic=()',
      color: 'text-blue-500',
    },
  ]

  return (
    <div className="min-h-screen relative bg-black selection:bg-blue-500/30 overflow-hidden">
      <div className="noise" />

      {/* Background Gradients */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 z-[100] w-full h-16 border-b border-white/[0.05] bg-black/80 backdrop-blur-md flex items-center justify-center">
        <div className="w-full max-w-[1400px] px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <h1 className="text-sm font-black tracking-widest text-white uppercase">
                Nalth Sample App
              </h1>
            </div>
            <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-6">
              <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                Dashboard
              </span>
              {['Config', 'Logs', 'Analysis'].map((item) => (
                <button
                  key={item}
                  className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 hover:text-zinc-400 uppercase transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded bg-green-900/10 border border-green-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                Protected
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-zinc-400"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-[1400px] px-6 pt-24 pb-12 mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
            Security Status
          </h2>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Overview of active running security mechanisms, middleware headers, and real-time
            prevention engines protecting this session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Active Mechanisms (Headers & Config) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Headers Panel */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-zinc-400" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Active Mechanisms (Middleware)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-600 uppercase">
                  Rust Core v0.9.0
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {mechanisms.map((mech, i) => (
                  <div
                    key={i}
                    className="p-3 rounded border border-white/[0.05] bg-black/40 hover:border-white/10 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`w-3.5 h-3.5 ${mech.color}`} />
                      <span className="text-[10px] font-bold text-zinc-300 font-mono">
                        {mech.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-[9px] font-bold uppercase ${mech.color}`}>
                        {mech.status}
                      </div>
                      <div className="text-[9px] font-mono text-zinc-600 opacity-60 group-hover:opacity-100 transition-opacity">
                        {mech.val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Protection Visualization */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Real-Time Data Hygiene
                  </span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputEncryptionDemo />

                <div className="p-5 rounded border border-white/[0.05] bg-black/20 text-zinc-400 text-xs leading-relaxed font-medium">
                  <h4 className="text-white font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Edge Sanitization
                  </h4>
                  <p className="mb-4 text-zinc-500">
                    All incoming requests are routed through the Nalth Edge Shield. Payloads are
                    sanitized for SQLi patterns and XSS vectors before reaching the application
                    core.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-zinc-800 text-[9px] font-mono text-zinc-300 border border-white/10">
                      Sanitization: SQLi
                    </span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-[9px] font-mono text-zinc-300 border border-white/10">
                      Sanitization: NoSQL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Active Preventions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-red-500/5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Active Prevention
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>

              <div className="p-6 space-y-6 flex-1 bg-gradient-to-b from-red-500/5 to-transparent">
                <CSPDemo />

                <div className="p-4 rounded border border-white/5 bg-black/40">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">
                    Integrity Monitor
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        label: 'File Change Detection',
                        status: 'Monitoring',
                        color: 'text-green-500',
                      },
                      { label: 'Unexpected Outbound', status: 'Clean', color: 'text-green-500' },
                      { label: 'Dependency Audit', status: 'Verified', color: 'text-blue-500' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="font-bold text-zinc-400">{item.label}</span>
                        <span className={`font-mono font-bold uppercase ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
