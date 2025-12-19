import { useState, useEffect } from 'react'
import {
  Shield,
  Zap,
  Lock,
  Activity,
  AlertTriangle,
  Cpu,
  Globe,
  Terminal,
  ShieldAlert,
} from 'lucide-react'

interface Metric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  id: string
}

export default function Dashboard() {
  const [metrics] = useState<Metric[]>([
    {
      id: 'score',
      label: 'Security Posture',
      value: '98.5',
      change: '+2.3%',
      trend: 'up',
    },
    {
      id: 'latency',
      label: 'Avg Latency',
      value: '99.2ms',
      change: '-12%',
      trend: 'up',
    },
    {
      id: 'users',
      label: 'Secure Sessions',
      value: '2,847',
      change: '+18%',
      trend: 'up',
    },
    {
      id: 'uptime',
      label: 'System Uptime',
      value: '99.99%',
      change: '+0.01%',
      trend: 'up',
    },
  ])

  const [securityEvents] = useState([
    { type: 'success', id: 'EV-882', message: 'RSA-4096 Key Rotation Completed', time: '2m' },
    { type: 'info', id: 'EV-881', message: 'Global CSP Audit: 100% Compliance', time: '15m' },
    {
      type: 'warning',
      id: 'EV-880',
      message: 'Potential Brute-force blocked (IP: 192.168.1.1)',
      time: '1h',
    },
    { type: 'success', id: 'EV-879', message: 'Zero-JS SRI Hash Verification passed', time: '5h' },
  ])

  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#030308] text-white selection:bg-cyan-500/30">
      {/* Premium Header */}
      <header className="sticky top-4 mx-auto max-w-[1800px] px-6 z-50">
        <div className="glass-panel py-3 px-6 flex items-center justify-between border-cyan-500/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div
                className={`absolute -inset-1 bg-cyan-400/20 blur-sm rounded-full ${pulse ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight title-gradient">NALTH COMMAND</h1>
              <p className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-[0.2em]">
                Deployment: v0.9.0-BETA
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {['OVERVIEW', 'SECURITY', 'NETWORK', 'NODES'].map((item) => (
              <button
                key={item}
                className="text-[11px] font-bold tracking-widest text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-500/5 border border-cyan-500/20">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-cyan-400">ENCRYPTED</span>
            </div>
            <button className="nalth-btn primary !py-2 !px-4 text-xs">
              <Zap className="w-4 h-4" /> RE-DEPLOY
            </button>
          </div>
        </div>
      </header>

      {/* Main Command Center */}
      <main className="max-w-[1800px] mx-auto px-6 pb-20 mt-8">
        {/* Top Grid: Critical Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="glass-panel p-5 group hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  {metric.label}
                </span>
                {metric.id === 'score' ? (
                  <Shield className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Activity className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tracking-tighter text-white">
                  {metric.value}
                </span>
                <span
                  className={`text-[10px] font-bold ${metric.trend === 'up' ? 'text-cyan-400' : 'text-rose-500'}`}
                >
                  {metric.change}
                </span>
              </div>
              <div className="mt-4 h-[2px] w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] w-2/3 transition-all group-hover:w-full duration-1000" />
              </div>
            </div>
          ))}
        </div>

        {/* Central Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-time Threat Map (Visual Mockup) */}
          <div className="lg:col-span-2 glass-panel overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  Global Threat Intelligence
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] text-rose-500 font-bold">LIVE ACTIVITY</span>
              </div>
            </div>
            <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] flex items-center justify-center">
              {/* Technical Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-transparent pointer-events-none" />
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              <div className="relative z-10 text-center p-8 glass-panel !bg-black/40 border-cyan-500/20 backdrop-blur-md">
                <ShieldAlert className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-50" />
                <h4 className="text-sm font-bold tracking-widest uppercase mb-2">
                  Network Shield Active
                </h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Nalth is currently monitoring 1.2M packets/sec across 14 edge locations. No active
                  threats detected.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-cyan-400">0</div>
                    <div className="text-[8px] text-slate-500 font-bold uppercase">Critical</div>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-amber-500">2</div>
                    <div className="text-[8px] text-slate-500 font-bold uppercase">Warnings</div>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-emerald-500">14</div>
                    <div className="text-[8px] text-slate-500 font-bold uppercase">Nodes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Activity Logs & Quick Control */}
          <div className="space-y-6">
            {/* Quick Control Center */}
            <div className="glass-panel p-6">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" /> System Control
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/40 transition-all group">
                  <Shield className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 tracking-tighter">
                    HARDEN CSP
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/40 transition-all group">
                  <Lock className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 tracking-tighter">
                    ROTATION
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/40 transition-all group">
                  <Cpu className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 tracking-tighter">
                    FLUSH CACHE
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/40 transition-all group">
                  <AlertTriangle className="w-6 h-6 text-slate-500 group-hover:text-amber-500 transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 tracking-tighter">
                    DEBUG LOGS
                  </span>
                </button>
              </div>
            </div>

            {/* Technical Log Level */}
            <div className="glass-panel p-6 flex-1">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Security Feed</h3>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div
                      className={`w-1 self-stretch rounded-full ${event.type === 'success' ? 'bg-emerald-500' : event.type === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-[9px] font-mono text-slate-500">{event.id}</span>
                        <span className="text-[9px] font-mono text-slate-600">{event.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300 font-medium">
                        {event.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-[10px] font-bold tracking-[0.2em] text-cyan-400/60 hover:text-cyan-400 border border-cyan-400/20 rounded hover:bg-cyan-400/5 transition-all">
                VIEW ARCHIVE
              </button>
            </div>
          </div>
        </div>

        {/* Technical Footer Indicator */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-bold uppercase tracking-widest">Protocol</span>
              <span className="text-[10px] font-mono">NALTH/HTS-SECURE</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-bold uppercase tracking-widest">Gateway</span>
              <span className="text-[10px] font-mono">10.0.8.254</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <Shield className="w-3 h-3" />
            <span>SIG_VERIFIED: 0x882A...F92</span>
          </div>
        </div>
      </main>
    </div>
  )
}
