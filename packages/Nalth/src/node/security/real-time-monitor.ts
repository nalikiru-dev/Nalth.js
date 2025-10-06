import { EventEmitter } from 'events'
import { watch } from 'chokidar'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { OWASPSecurity } from './owasp.js'
import { PackageSecurityScanner } from './package-scanner.js'

export interface SecurityEvent {
  type: 'vulnerability' | 'malicious_package' | 'license_violation' | 'csp_violation' | 'xss_attempt'
  severity: 'info' | 'low' | 'moderate' | 'high' | 'critical'
  timestamp: Date
  details: any
  source: string
}

export class RealTimeSecurityMonitor extends EventEmitter {
  private isMonitoring = false
  private watchers: any[] = []
  private owaspSecurity: OWASPSecurity
  private scanner: PackageSecurityScanner
  private projectPath: string
  private securityEvents: SecurityEvent[] = []

  constructor(projectPath: string, owaspSecurity: OWASPSecurity) {
    super()
    this.projectPath = projectPath
    this.owaspSecurity = owaspSecurity
    this.scanner = new PackageSecurityScanner(owaspSecurity, [])
  }

  start(): void {
    if (this.isMonitoring) return

    console.log('🛡️ Starting real-time security monitoring...')
    this.isMonitoring = true

    // Monitor package.json changes
    this.watchPackageJson()
    
    // Monitor source code changes
    this.watchSourceFiles()
    
    // Monitor configuration changes
    this.watchConfigFiles()

    // Start periodic security scans
    this.startPeriodicScans()

    console.log('✅ Security monitoring active')
  }

  stop(): void {
    if (!this.isMonitoring) return

    console.log('🛡️ Stopping security monitoring...')
    this.isMonitoring = false

    this.watchers.forEach(watcher => watcher.close())
    this.watchers = []

    console.log('✅ Security monitoring stopped')
  }

  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents]
  }

  getSecurityDashboard(): {
    status: 'secure' | 'warning' | 'critical'
    score: number
    recentEvents: SecurityEvent[]
    recommendations: string[]
  } {
    const recentEvents = this.securityEvents
      .filter(event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000) // Last 24 hours
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    const criticalEvents = recentEvents.filter(e => e.severity === 'critical')
    const highEvents = recentEvents.filter(e => e.severity === 'high')

    let status: 'secure' | 'warning' | 'critical' = 'secure'
    let score = 100

    if (criticalEvents.length > 0) {
      status = 'critical'
      score -= criticalEvents.length * 25
    } else if (highEvents.length > 0) {
      status = 'warning'
      score -= highEvents.length * 15
    }

    score -= recentEvents.filter(e => e.severity === 'moderate').length * 10
    score -= recentEvents.filter(e => e.severity === 'low').length * 5
    score = Math.max(0, score)

    const recommendations = this.generateRecommendations(recentEvents)

    return {
      status,
      score,
      recentEvents: recentEvents.slice(0, 10),
      recommendations
    }
  }

  private watchPackageJson(): void {
    const packageJsonPath = resolve(this.projectPath, 'package.json')
    
    if (!existsSync(packageJsonPath)) return

    const watcher = watch(packageJsonPath, { persistent: true })
    
    watcher.on('change', async () => {
      console.log('📦 package.json changed, scanning for new vulnerabilities...')
      
      try {
        const scanResult = await this.scanner.scanProject(this.projectPath)
        
        if (scanResult.vulnerabilities.length > 0) {
          scanResult.vulnerabilities.forEach(vuln => {
            this.addSecurityEvent({
              type: 'vulnerability',
              severity: vuln.severity,
              timestamp: new Date(),
              details: vuln,
              source: 'package.json'
            })
          })
        }

        if (scanResult.maliciousPackages.length > 0) {
          scanResult.maliciousPackages.forEach(pkg => {
            this.addSecurityEvent({
              type: 'malicious_package',
              severity: 'critical',
              timestamp: new Date(),
              details: { package: pkg },
              source: 'package.json'
            })
          })
        }

      } catch (error) {
        console.error('Security scan failed:', error)
      }
    })

    this.watchers.push(watcher)
  }

  private watchSourceFiles(): void {
    const srcWatcher = watch(resolve(this.projectPath, 'src/**/*.{js,ts,jsx,tsx}'), {
      persistent: true,
      ignored: /node_modules/
    })

    srcWatcher.on('change', (filePath) => {
      this.scanFileForSecurityIssues(filePath)
    })

    this.watchers.push(srcWatcher)
  }

  private watchConfigFiles(): void {
    const configFiles = [
      'nalth.config.ts',
      'vite.config.ts',
      '.nalth/security.config.json',
      'tailwind.config.ts'
    ]

    configFiles.forEach(configFile => {
      const configPath = resolve(this.projectPath, configFile)
      
      if (existsSync(configPath)) {
        const watcher = watch(configPath, { persistent: true })
        
        watcher.on('change', () => {
          console.log(`⚙️ ${configFile} changed, validating security configuration...`)
          this.validateSecurityConfig(configPath)
        })

        this.watchers.push(watcher)
      }
    })
  }

  private scanFileForSecurityIssues(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8')
      
      // Check for common security anti-patterns
      const securityPatterns: Array<{
        pattern: RegExp
        type: SecurityEvent['type']
        severity: SecurityEvent['severity']
        message: string
      }> = [
        {
          pattern: /eval\s*\(/g,
          type: 'xss_attempt',
          severity: 'high',
          message: 'Use of eval() detected - potential XSS vulnerability'
        },
        {
          pattern: /innerHTML\s*=/g,
          type: 'xss_attempt',
          severity: 'moderate',
          message: 'Direct innerHTML assignment - potential XSS vulnerability'
        },
        {
          pattern: /document\.write\s*\(/g,
          type: 'xss_attempt',
          severity: 'moderate',
          message: 'Use of document.write() - potential XSS vulnerability'
        },
        {
          pattern: /dangerouslySetInnerHTML/g,
          type: 'xss_attempt',
          severity: 'moderate',
          message: 'dangerouslySetInnerHTML usage - ensure content is sanitized'
        },
        {
          pattern: /process\.env\.[A-Z_]+/g,
          type: 'vulnerability',
          severity: 'low',
          message: 'Environment variable usage - ensure no secrets in client code'
        }
      ]

      securityPatterns.forEach(({ pattern, type, severity, message }) => {
        const matches = content.match(pattern)
        if (matches) {
          matches.forEach(() => {
            this.addSecurityEvent({
              type,
              severity,
              timestamp: new Date(),
              details: { 
                file: filePath, 
                message,
                pattern: pattern.source 
              },
              source: 'source_code'
            })
          })
        }
      })

    } catch (error) {
      // File might be deleted or inaccessible
    }
  }

  private validateSecurityConfig(configPath: string): void {
    try {
      const content = readFileSync(configPath, 'utf-8')
      
      // Check for insecure configurations
      if (content.includes('https: false')) {
        this.addSecurityEvent({
          type: 'vulnerability',
          severity: 'high',
          timestamp: new Date(),
          details: {
            file: configPath,
            message: 'HTTPS disabled in configuration'
          },
          source: 'configuration'
        })
      }

      if (content.includes("'unsafe-inline'") && !content.includes('nonce')) {
        this.addSecurityEvent({
          type: 'csp_violation',
          severity: 'moderate',
          timestamp: new Date(),
          details: {
            file: configPath,
            message: 'unsafe-inline CSP directive without nonce'
          },
          source: 'configuration'
        })
      }

    } catch (error) {
      // Configuration file might be invalid
    }
  }

  private startPeriodicScans(): void {
    // Run full security scan every hour
    const scanInterval = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(scanInterval)
        return
      }

      console.log('🔍 Running periodic security scan...')
      
      try {
        const scanResult = await this.scanner.scanProject(this.projectPath)
        
        // Only report new issues to avoid spam
        const existingVulns = new Set(
          this.securityEvents
            .filter(e => e.type === 'vulnerability')
            .map(e => `${e.details.name}@${e.details.version}`)
        )

        scanResult.vulnerabilities.forEach(vuln => {
          const vulnKey = `${vuln.name}@${vuln.version}`
          if (!existingVulns.has(vulnKey)) {
            this.addSecurityEvent({
              type: 'vulnerability',
              severity: vuln.severity,
              timestamp: new Date(),
              details: vuln,
              source: 'periodic_scan'
            })
          }
        })

      } catch (error) {
        console.error('Periodic security scan failed:', error)
      }
    }, 60 * 60 * 1000) // 1 hour
  }

  private addSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event)
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000)
    }

    // Emit event for real-time updates
    this.emit('securityEvent', event)

    // Log critical events immediately
    if (event.severity === 'critical') {
      console.error(`🚨 CRITICAL SECURITY EVENT: ${event.details.message || event.type}`)
    } else if (event.severity === 'high') {
      console.warn(`⚠️ HIGH SECURITY EVENT: ${event.details.message || event.type}`)
    }
  }

  private generateRecommendations(events: SecurityEvent[]): string[] {
    const recommendations: string[] = []
    
    const vulnEvents = events.filter(e => e.type === 'vulnerability')
    const xssEvents = events.filter(e => e.type === 'xss_attempt')
    const maliciousEvents = events.filter(e => e.type === 'malicious_package')
    
    if (vulnEvents.length > 0) {
      recommendations.push('Update vulnerable dependencies with `npm audit fix`')
    }
    
    if (xssEvents.length > 0) {
      recommendations.push('Review and sanitize user input handling in your code')
      recommendations.push('Consider using Content Security Policy with nonces')
    }
    
    if (maliciousEvents.length > 0) {
      recommendations.push('Remove potentially malicious packages immediately')
      recommendations.push('Review package sources and maintainers before installation')
    }
    
    if (events.some(e => e.source === 'configuration')) {
      recommendations.push('Review security configuration settings')
    }
    
    // General recommendations
    recommendations.push('Run `nalth audit` before each deployment')
    recommendations.push('Enable automated security monitoring in CI/CD')
    
    return recommendations
  }
}
