import { useState } from 'react'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Code, ExternalLink, GitBranch, Sparkles, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecurityDashboard } from '@/components/SecurityDashboard'
import reactLogo from './assets/react.svg'
import nalthLogo from '/nalth.svg'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const securityFeatures = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "HTTPS by Default",
      description: "All connections secured with TLS 1.3 encryption",
      status: "Active",
      color: "success" as const
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Content Security Policy",
      description: "Strict CSP with nonce-based script loading",
      status: "Enforced",
      color: "success" as const
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Real-time Monitoring",
      description: "Live security monitoring and threat detection",
      status: "Monitoring",
      color: "security" as const
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Dependency Auditing",
      description: "Continuous vulnerability scanning of packages",
      status: "Scanning",
      color: "success" as const
    }
  ]

  const quickStartSteps = [
    {
      icon: <Code className="h-5 w-5" />,
      title: "Edit src/App.tsx",
      description: "Start building your secure application"
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      title: "Run Security Audit",
      description: "Check for vulnerabilities in your dependencies"
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Deploy Securely",
      description: "Deploy with HTTPS and security headers enabled"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-6 mb-6">
            <a href="https://nalth.dev" target="_blank" rel="noopener noreferrer" className="group">
              <img 
                src={nalthLogo} 
                className="h-20 w-20 hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" 
                alt="Nalth logo" 
              />
            </a>
            <div className="text-5xl font-bold text-slate-400 animate-pulse">+</div>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="group">
              <img 
                src={reactLogo} 
                className="h-20 w-20 hover:scale-110 transition-transform duration-300 animate-spin-slow group-hover:drop-shadow-lg" 
                alt="React logo" 
              />
            </a>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-3 mb-2">
              <Badge variant="security" className="text-xs px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                v2.1.0
              </Badge>
              <Badge variant="success" className="text-xs px-3 py-1">
                Enterprise Ready
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              🛡️ NALTH + React
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Security-first web development with enterprise-grade protection,
              <br className="hidden sm:block" />
              modern UI components, and zero-config HTTPS
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="text-sm font-medium">
              <Eye className="w-4 h-4 mr-2" />
              Security Dashboard
            </TabsTrigger>
            <TabsTrigger value="quickstart" className="text-sm font-medium">
              <Code className="w-4 h-4 mr-2" />
              Quick Start
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Security Features Grid */}
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">
                🔒 Security Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-blue-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                          {feature.icon}
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                        <Badge variant={feature.color}>{feature.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-6">
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  <Shield className="mr-2 h-4 w-4" />
                  Run Security Audit
                </Button>
                
                <Button variant="outline" size="lg" className="border-2 hover:bg-blue-50 dark:hover:bg-blue-950">
                  <Eye className="mr-2 h-4 w-4" />
                  Open Dashboard
                </Button>
                
                <Button variant="secondary" size="lg" className="hover:bg-slate-200 dark:hover:bg-slate-700">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Documentation
                </Button>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  🔥 <strong>Hot Module Replacement:</strong> Edit any file and see changes instantly
                </p>
                <code className="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded text-sm font-mono">
                  src/App.tsx
                </code>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  All changes are monitored for security violations in real-time
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="quickstart" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                🚀 Quick Start Guide
              </h2>
              <p className="text-muted-foreground">
                Get your secure application running in minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      {step.icon}
                    </div>
                    <CardTitle className="text-lg">
                      Step {index + 1}: {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-center text-xl">
                  🌐 Your Secure Development Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">✓ Development Server</h4>
                    <p>https://localhost:3000 (SSL enabled)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">✓ Security Dashboard</h4>
                    <p>https://localhost:3000/__nalth</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">✓ Hot Module Replacement</h4>
                    <p>Real-time updates with security monitoring</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">✓ Built-in Auditing</h4>
                    <p>Automatic vulnerability scanning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center border-t border-slate-200 dark:border-slate-700 pt-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <img src={nalthLogo} className="h-6 w-6" alt="Nalth" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Built with ❤️ using NALTH's security-first approach
            </span>
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <a 
              href="https://docs.nalth.dev" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              📚 Documentation
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://github.com/nalth/nalth" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔧 GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://nalth.dev/security" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              🛡️ Security Guide
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
