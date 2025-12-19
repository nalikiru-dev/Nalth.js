import { useState, useEffect } from 'react'
import { Shield, Lock, GitBranch, Terminal, ShieldCheck, Activity, Cpu } from 'lucide-react'
import reactLogo from './assets/react.svg'

function App() {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000)
    return () => clearInterval(interval)
  }, [])

  const navigateToDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-[#030308] text-white selection:bg-cyan-500/30">
      {/* Elite Technical Header */}
      <header className="sticky top-4 mx-auto max-w-[1400px] px-6 z-50">
        <div className="glass-panel py-3 px-6 flex items-center justify-between border-cyan-500/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div
                className={`absolute -inset-1 bg-cyan-400/20 blur-sm rounded-full ${pulse ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
              />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight title-gradient">NALTH</h1>
              <span className="text-slate-600 font-light translate-y-[-1px]">/</span>
              <img
                src={reactLogo}
                className="w-5 h-5 animate-[spin_10s_linear_infinite]"
                alt="React Logo"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">
                System Secure
              </span>
            </div>
            <a
              href="https://github.com/nalikiru-dev/nalth.js"
              target="_blank"
              className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <GitBranch className="w-3 h-3" /> GITHUB
            </a>
          </div>
        </div>
      </header>

      {/* Hero: Build Unbreakable */}
      <main className="max-w-[1400px] mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Enterprise Security Framework
            </span>
          </div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            BUILD <span className="title-gradient">UNBREAKABLE</span>
            <br />
            APPLICATIONS
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed font-light mb-12">
            Nalth combines rust-based tooling with enterprise-grade security defaults. Zero-config
            policies, automated audits, and instant deployments for high-stakes web environments.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={navigateToDashboard}
              className="nalth-btn primary !py-4 !px-8 text-sm group"
            >
              <Activity className="w-4 h-4 group-hover:rotate-12 transition-transform" /> COMMAND
              CENTER
            </button>
            <button className="nalth-btn secondary !py-4 !px-8 text-sm">DOCUMENTATION</button>
          </div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] -z-10 pointer-events-none" />
        </div>

        {/* Feature Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 group hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Security Score</h3>
            <div className="text-4xl font-mono font-black text-white mb-4">
              98<span className="text-xl text-slate-600">/100</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time heuristic analysis and automated compliance auditing out of the box.
            </p>
          </div>

          <div className="glass-panel p-8 group hover:border-purple-500/40">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Encryption</h3>
            <div className="text-4xl font-mono font-black text-purple-400 mb-4 uppercase tracking-tighter">
              TLS 1.3
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Zero-config automated certificate generation and end-to-end traffic protection.
            </p>
          </div>

          <div className="glass-panel p-8 group hover:border-emerald-500/40">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Active Policies</h3>
            <div className="text-4xl font-mono font-black text-emerald-400 mb-4">
              12<span className="text-xl text-slate-600 uppercase ml-2 tracking-widest">Live</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hardened CSP, HSTS, and Frame-Options enforced at the edge by default.
            </p>
          </div>
        </div>
      </main>

      {/* Functional Footer */}
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[10px] font-bold tracking-widest text-slate-500 hover:text-cyan-400 transition-colors uppercase"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-[10px] font-bold tracking-widest text-slate-500 hover:text-cyan-400 transition-colors uppercase"
            >
              Security Guide
            </a>
            <a
              href="#"
              className="text-[10px] font-bold tracking-widest text-slate-500 hover:text-cyan-400 transition-colors uppercase"
            >
              API Reference
            </a>
          </div>

          <div className="text-[10px] font-mono text-slate-600 flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span>&copy; {new Date().getFullYear()} NALTH MANAGEMENT SYSTEM // OPEN_SOURCE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
