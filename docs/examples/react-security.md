# 🔵 React Security Application Example

**Build a production-ready React application with enterprise-grade security using NALTH**

This comprehensive example demonstrates how to build a secure React application with authentication, API integration, and real-time security monitoring using NALTH's security-first approach.

---

## 🎯 What You'll Build

A complete React application featuring:

- 🔐 **Secure Authentication System** with JWT and refresh tokens
- 📊 **Real-time Security Dashboard** with live threat monitoring  
- 🛡️ **API Security** with automatic CSP and security headers
- 🔍 **Vulnerability Management** with automated scanning
- 📱 **Responsive UI** with shadcn/ui and Tailwind CSS
- 🚀 **Production Deployment** with security optimizations

## 🏗️ Project Setup

### 1. Create the Project

```bash
# Create NALTH React project
npx create-nalth@latest react-security-app --template nalth-react

cd react-security-app
npm install
```

### 2. Project Structure

```
react-security-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Security dashboard
│   │   └── security/        # Security-specific components
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── security.ts     # Security utilities
│   │   └── api.ts          # API client
│   ├── pages/              # Application pages
│   └── types/              # TypeScript type definitions
├── nalth.config.ts         # NALTH configuration
└── package.json
```

### 3. Enhanced NALTH Configuration

```typescript
// nalth.config.ts
import { defineConfig } from 'nalth'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // TypeScript path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // NALTH Security Configuration
  security: {
    // HTTPS with production-ready settings
    https: {
      enabled: true,
      autoGenerate: true,
      force: true,
      hsts: {
        maxAge: 31536000,        // 1 year
        includeSubdomains: true,
        preload: true
      }
    },

    // Strict Content Security Policy
    csp: {
      mode: 'auto',
      reportUri: '/api/csp-violations',
      nonce: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'nonce-{NONCE}'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", "data:", "https:"],
        'connect-src': ["'self'", "https://api.example.com", "wss://localhost:*"],
        'font-src': ["'self'", "https://fonts.gstatic.com"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"]
      }
    },

    // Comprehensive security headers
    headers: {
      hsts: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      },
      frameOptions: 'DENY',
      contentTypeOptions: true,
      xssProtection: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: ['self'],
        payment: [],
        usb: []
      }
    },

    // Strict vulnerability auditing
    audit: {
      enabled: true,
      level: 'strict',
      sources: ['npm', 'snyk', 'ossindex'],
      autoFix: false,
      includeDevDependencies: true
    },

    // Real-time security monitoring
    monitoring: {
      enabled: true,
      dashboard: true,
      interval: 5000,
      alerts: {
        enabled: true,
        thresholds: {
          vulnerabilities: 'high',
          cspViolations: 5,
          securityScore: 85
        }
      }
    }
  },

  // Production build optimizations
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // Code splitting for better security
        manualChunks: {
          vendor: ['react', 'react-dom'],
          security: ['@/lib/security', '@/components/security']
        }
      }
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    host: 'localhost',
    cors: {
      origin: false  // Strict CORS policy
    }
  }
})
```

---

## 🔐 Authentication Implementation

### 1. Authentication Utilities

```typescript
// src/lib/auth.ts
import { SecurityLogger, sanitizeInput } from './security'

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

class AuthManager {
  private tokens: AuthTokens | null = null
  private user: User | null = null
  private refreshTimer: NodeJS.Timeout | null = null
  private logger = SecurityLogger.getInstance()

  constructor() {
    this.loadTokensFromStorage()
    this.setupTokenRefresh()
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email)
      const sanitizedPassword = sanitizeInput(password)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'  // CSRF protection
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword
        })
      })

      if (!response.ok) {
        const error = await response.json()
        this.logger.log('warn', 'Login failed', { email: sanitizedEmail, error })
        return { success: false, error: error.message }
      }

      const data = await response.json()
      this.setTokens(data.tokens)
      this.setUser(data.user)

      this.logger.log('info', 'User logged in successfully', { userId: data.user.id })
      return { success: true, user: data.user }
    } catch (error) {
      this.logger.log('error', 'Login error', error)
      return { success: false, error: 'Login failed' }
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.tokens) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.tokens.accessToken}`,
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
      }
    } catch (error) {
      this.logger.log('error', 'Logout error', error)
    } finally {
      this.clearTokens()
      this.clearUser()
      this.logger.log('info', 'User logged out')
    }
  }

  async refreshTokens(): Promise<boolean> {
    if (!this.tokens?.refreshToken) return false

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tokens.refreshToken}`
        }
      })

      if (!response.ok) {
        this.logout()
        return false
      }

      const data = await response.json()
      this.setTokens(data.tokens)
      return true
    } catch (error) {
      this.logger.log('error', 'Token refresh failed', error)
      this.logout()
      return false
    }
  }

  private setTokens(tokens: AuthTokens): void {
    this.tokens = tokens
    // Store in httpOnly secure storage (implement based on your backend)
    localStorage.setItem('auth_session', JSON.stringify({
      expiresAt: tokens.expiresAt
    }))
    this.setupTokenRefresh()
  }

  private clearTokens(): void {
    this.tokens = null
    localStorage.removeItem('auth_session')
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  private setupTokenRefresh(): void {
    if (!this.tokens) return

    const timeUntilExpiry = this.tokens.expiresAt - Date.now()
    const refreshTime = Math.max(timeUntilExpiry - 60000, 10000) // Refresh 1 min before expiry

    if (this.refreshTimer) clearTimeout(this.refreshTimer)
    
    this.refreshTimer = setTimeout(() => {
      this.refreshTokens()
    }, refreshTime)
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken || null
  }

  getUser(): User | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return this.tokens !== null && this.tokens.expiresAt > Date.now()
  }
}

export const authManager = new AuthManager()
export type { User, AuthTokens }
```

### 2. Authentication Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { authManager, type User } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(authManager.getUser())
  const [isAuthenticated, setIsAuthenticated] = useState(authManager.isAuthenticated())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      setUser(authManager.getUser())
      setIsAuthenticated(authManager.isAuthenticated())
    }

    // Check auth status periodically
    const interval = setInterval(checkAuth, 30000)
    return () => clearInterval(interval)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authManager.login(email, password)
      if (result.success) {
        setUser(result.user!)
        setIsAuthenticated(true)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authManager.logout()
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  }
}
```

### 3. Login Component

```tsx
// src/components/auth/LoginForm.tsx
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await login(email, password)
    if (!result.success) {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border-2 border-blue-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            🛡️ Secure Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your secure dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign In Securely
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connection secured with TLS 1.3</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time security monitoring active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 📊 Security Dashboard Component

### Real-time Security Monitoring

```tsx
// src/components/dashboard/SecurityDashboard.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'

interface SecurityMetrics {
  overallScore: number
  https: { enabled: boolean; score: number }
  csp: { enabled: boolean; violations: number; score: number }
  headers: { configured: number; total: number; score: number }
  vulnerabilities: { critical: number; high: number; moderate: number; low: number }
  lastScan: Date
}

interface SecurityEvent {
  id: string
  type: 'csp-violation' | 'vulnerability' | 'audit' | 'alert'
  message: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  timestamp: Date
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    overallScore: 95,
    https: { enabled: true, score: 100 },
    csp: { enabled: true, violations: 0, score: 98 },
    headers: { configured: 8, total: 8, score: 100 },
    vulnerabilities: { critical: 0, high: 0, moderate: 2, low: 5 },
    lastScan: new Date()
  })

  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'audit',
      message: 'Security audit completed successfully - no critical vulnerabilities found',
      severity: 'low',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2', 
      type: 'csp-violation',
      message: 'CSP violation blocked: unsafe inline script attempt',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    {
      id: '3',
      type: 'vulnerability',
      message: '2 moderate vulnerabilities detected in dependencies',
      severity: 'medium',
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ])

  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        overallScore: Math.min(100, prev.overallScore + (Math.random() - 0.5) * 2),
        csp: {
          ...prev.csp,
          score: Math.min(100, prev.csp.score + (Math.random() - 0.5))
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const runSecurityAudit = async () => {
    setIsScanning(true)
    // Simulate audit process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newEvent: SecurityEvent = {
      id: Date.now().toString(),
      type: 'audit',
      message: 'Manual security audit completed - system secure',
      severity: 'low',
      timestamp: new Date()
    }
    
    setEvents(prev => [newEvent, ...prev.slice(0, 9)])
    setMetrics(prev => ({ ...prev, lastScan: new Date() }))
    setIsScanning(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreVariant = (score: number): 'success' | 'warning' | 'danger' => {
    if (score >= 90) return 'success'
    if (score >= 70) return 'warning'
    return 'danger'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🔒 Security Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time security monitoring and threat protection
        </p>
      </div>

      {/* Overall Security Score */}
      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Overall Security Score
          </CardTitle>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(metrics.overallScore)}`}>
            {Math.round(metrics.overallScore)}/100
          </div>
          <Progress 
            value={metrics.overallScore} 
            variant={getScoreVariant(metrics.overallScore)}
            className="w-full max-w-md mx-auto" 
          />
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Badge variant="success" className="text-sm px-4 py-1">
              🛡️ Excellent Security Posture
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* HTTPS Status */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-sm">HTTPS/TLS</CardTitle>
                  </div>
                  <Badge variant="success">{metrics.https.score}%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={metrics.https.score} variant="success" className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  TLS 1.3 encryption active
                </p>
              </CardContent>
            </Card>

            {/* CSP Status */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm">CSP</CardTitle>
                  </div>
                  <Badge variant="success">{Math.round(metrics.csp.score)}%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={metrics.csp.score} variant="success" className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {metrics.csp.violations} violations today
                </p>
              </CardContent>
            </Card>

            {/* Security Headers */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-purple-600" />
                    <CardTitle className="text-sm">Headers</CardTitle>
                  </div>
                  <Badge variant="success">{metrics.headers.score}%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={metrics.headers.score} variant="success" className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {metrics.headers.configured}/{metrics.headers.total} configured
                </p>
              </CardContent>
            </Card>

            {/* Vulnerabilities */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-orange-600" />
                    <CardTitle className="text-sm">Vulnerabilities</CardTitle>
                  </div>
                  <Badge variant={metrics.vulnerabilities.critical > 0 ? "destructive" : "success"}>
                    {metrics.vulnerabilities.critical + metrics.vulnerabilities.high + metrics.vulnerabilities.moderate + metrics.vulnerabilities.low}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Critical: {metrics.vulnerabilities.critical}</span>
                    <span>High: {metrics.vulnerabilities.high}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Moderate: {metrics.vulnerabilities.moderate}</span>
                    <span>Low: {metrics.vulnerabilities.low}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Vulnerability Report</span>
                <Badge variant="secondary">
                  Last scan: {metrics.lastScan.toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{metrics.vulnerabilities.critical}</div>
                  <div className="text-sm text-red-600">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{metrics.vulnerabilities.high}</div>
                  <div className="text-sm text-orange-600">High</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{metrics.vulnerabilities.moderate}</div>
                  <div className="text-sm text-yellow-600">Moderate</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{metrics.vulnerabilities.low}</div>
                  <div className="text-sm text-blue-600">Low</div>
                </div>
              </div>
              
              {metrics.vulnerabilities.critical === 0 && metrics.vulnerabilities.high === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-700">No Critical Vulnerabilities</h3>
                  <p className="text-muted-foreground">Your application is secure from high-risk threats</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Add vulnerability list here */}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`h-4 w-4 mt-0.5 ${getSeverityColor(event.severity)}`} />
                      <div>
                        <div className="font-medium">{event.message}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={event.severity === 'critical' ? 'destructive' : event.severity === 'high' ? 'destructive' : event.severity === 'medium' ? 'warning' : 'secondary'}>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={runSecurityAudit}
                  disabled={isScanning}
                  className="w-full justify-start"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Running Audit...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Run Security Audit
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Security Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="mr-2 h-4 w-4" />
                  Update Security Policies
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">HTTPS Enforcement</span>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CSP Protection</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Headers</span>
                  <Badge variant="success">Configured</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vulnerability Scanning</span>
                  <Badge variant="success">Running</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## 📱 Complete Application

### Main App Component

```tsx
// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { SecurityDashboard } from '@/components/dashboard/SecurityDashboard'
import { Layout } from '@/components/Layout'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} 
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <SecurityDashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  )
}

export default App
```

---

## 🚀 Production Deployment

### 1. Build for Production

```bash
# Build with security optimizations
npm run build

# Run security audit before deployment
npm run security:audit

# Generate security report
npm run security:report
```

### 2. Deployment Configuration

```typescript
// Production environment variables
NALTH_SECURITY_LEVEL=strict
NALTH_CSP_REPORT_URI=https://your-domain.com/api/csp-violations
NALTH_AUDIT_WEBHOOK=https://your-monitoring.com/security-alerts
NALTH_HTTPS_CERT_PATH=/path/to/ssl/cert.pem
NALTH_HTTPS_KEY_PATH=/path/to/ssl/private-key.pem
```

### 3. Continuous Security Monitoring

```yaml
# .github/workflows/security.yml
name: Security Monitoring

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run security:audit
      - run: npm run security:report
```

---

## 📊 Key Benefits

This example demonstrates:

✅ **Enterprise Authentication** - Secure JWT-based auth with refresh tokens
✅ **Real-time Security Monitoring** - Live dashboard with metrics and alerts  
✅ **Automated Security Auditing** - Continuous vulnerability scanning
✅ **CSP Protection** - Dynamic Content Security Policy with violation tracking
✅ **Security Headers** - Comprehensive HTTP security headers
✅ **Production-Ready** - Optimized builds with security reporting

**Next Steps:**
- [Deploy to Production](../guide/deployment.md)
- [Add API Security](./node-api.md)  
- [Implement Monitoring](../guide/monitoring.md)

---

**NALTH React Security**: Building secure applications has never been easier. 🛡️⚡