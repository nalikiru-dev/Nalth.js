import { useState } from 'react'
import { Shield, Terminal, Lock, ChevronRight, Fingerprint, Cpu } from 'lucide-react'

function App() {
  const [bootSequence, setBootSequence] = useState<string[]>([])
  const [isBooting, setIsBooting] = useState(false)

  const handleLogin = () => {
    setIsBooting(true)
    const steps = [
      'Initializing Nalth Core v0.9.0...',
      'Verifying Environment Integrity...',
      'Loading Security Policies [STRICT]...',
      'Connecting to Edge Node [FRA-SEC-01]...',
      'Handshake Complete. Session Secure.',
    ]

    let delay = 0
    steps.forEach((step, index) => {
      delay += Math.random() * 600 + 200
      setTimeout(() => {
        setBootSequence((prev) => [...prev, step])
        // If last step, redirect
        if (index === steps.length - 1) {
          setTimeout(() => (window.location.href = '/dashboard'), 800)
        }
      }, delay)
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black selection:bg-blue-500/30 flex flex-col items-center justify-center p-6">
      <div className="noise" />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Identity Header */}
        <div className="text-center mb-10 animate-float">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-transparent border border-white/5 mb-6 shadow-2xl shadow-blue-500/10">
            <Shield className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">
            Nalth Console
          </h1>
          <p className="text-blue-500/60 font-mono text-xs uppercase tracking-[0.2em] font-bold">
            Secure Infrastructure Sample v0.9.0
          </p>
        </div>

        {/* Gateway Card */}
        <div className="glass-card p-1 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-black/40 rounded-xl p-8 border border-white/5 backdrop-blur-xl">
            {!isBooting ? (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                    Gateway Access
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Authenticate to access the active environment.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Fingerprint className="h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value="admin_user_01"
                      className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded bg-white/5 text-zinc-300 text-xs font-mono focus:ring-0 focus:border-blue-500 transition-colors cursor-not-allowed opacity-70"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-[10px] text-green-500 font-bold uppercase">
                        Verified
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full group relative flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Initialize Session{' '}
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                  </button>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-600 font-mono">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    <span>TLS 1.3 ENCRYPTED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3" />
                    <span>EDGE: FRA-01</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping absolute inset-0 opacity-75" />
                    <div className="w-3 h-3 rounded-full bg-blue-500 relative" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Establishing Connection...
                  </span>
                </div>

                <div className="font-mono text-[10px] space-y-2 h-[120px] flex flex-col justify-end">
                  {bootSequence.map((log, i) => (
                    <div
                      key={i}
                      className="text-zinc-400 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                    >
                      <span className="text-blue-500/50">&gt;</span>
                      <span className={i === bootSequence.length - 1 ? 'text-white' : ''}>
                        {log}
                      </span>
                      {i === bootSequence.length - 1 && (
                        <span className="w-1.5 h-3 bg-blue-500 animate-pulse ml-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest flex items-center gap-2 justify-center">
          <Terminal className="w-3 h-3" />
          Nalth Sample Application
        </p>
      </div>
    </div>
  )
}

export default App
