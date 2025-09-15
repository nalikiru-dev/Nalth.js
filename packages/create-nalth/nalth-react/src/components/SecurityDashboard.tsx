import React, { useState, useEffect } from 'react'
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, Clock, Zap, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

interface SecurityMetric {
  id: string
  name: string
  value: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  description: string
  icon: React.ReactNode
}

export function SecurityDashboard() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      id: 'https',
      name: 'HTTPS/TLS',
      value: 100,
      status: 'excellent',
      description: 'All connections encrypted with TLS 1.3',
      icon: <Lock className="h-4 w-4" />
    },
    {
      id: 'csp',
      name: 'Content Security Policy',
      value: 98,
      status: 'excellent',
      description: 'Strict CSP with nonce-based script loading',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'headers',
      name: 'Security Headers',
      value: 96,
      status: 'excellent',
      description: 'All recommended security headers active',
      icon: <Server className="h-4 w-4" />
    },
    {
      id: 'monitoring',
      name: 'Real-time Monitoring',
      value: 94,
      status: 'excellent',
      description: 'Active threat detection and logging',
      icon: <Eye className="h-4 w-4" />
    }
  ])

  const [recentEvents] = useState([
    { id: 1, type: 'security', message: 'CSP violation blocked malicious script', time: '2 minutes ago', severity: 'high' },
    { id: 2, type: 'audit', message: 'Security audit completed successfully', time: '15 minutes ago', severity: 'info' },
    { id: 3, type: 'ssl', message: 'SSL certificate validated', time: '1 hour ago', severity: 'info' },
    { id: 4, type: 'rate-limit', message: 'Rate limiting activated for suspicious IP', time: '2 hours ago', severity: 'medium' }
  ])

  const [overallScore, setOverallScore] = useState(0)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSecurityMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.min(100, metric.value + Math.random() * 2 - 1)
      })))
    }, 5000)

    // Calculate overall score
    const avgScore = securityMetrics.reduce((sum, metric) => sum + metric.value, 0) / securityMetrics.length
    setOverallScore(Math.round(avgScore))

    return () => clearInterval(interval)
  }, [securityMetrics])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success'
      case 'good': return 'default'
      case 'warning': return 'warning'
      case 'critical': return 'destructive'
      default: return 'secondary'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🔒 Security Dashboard
        </h2>
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
          <div className="text-4xl font-bold text-green-600 mb-2">
            {overallScore}/100
          </div>
          <Progress value={overallScore} variant="success" className="w-full max-w-md mx-auto" />
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
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {securityMetrics.map((metric) => (
              <Card key={metric.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {metric.icon}
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                    </div>
                    <Badge variant={getStatusColor(metric.status) as any}>
                      {Math.round(metric.value)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress 
                    value={metric.value} 
                    variant={metric.status === 'excellent' ? 'success' : 'default'}
                  />
                  <CardDescription>{metric.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Security Events
              </CardTitle>
              <CardDescription>
                Live monitoring of security-related activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-4 w-4 ${getSeverityColor(event.severity)}`} />
                      <div>
                        <div className="font-medium">{event.message}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      </div>
                    </div>
                    <Badge variant={event.severity === 'high' ? 'destructive' : event.severity === 'medium' ? 'warning' : 'secondary'}>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Run Security Audit
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Renew SSL Certificate
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Generate Security Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Security Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">HTTPS Enforcement</span>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CSP Enforcement</span>
                  <Badge variant="success">Strict</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rate Limiting</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Threat Detection</span>
                  <Badge variant="success">Monitoring</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}