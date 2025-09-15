import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { OWASPSecurity } from './owasp.js'

export interface PackageVulnerability {
  name: string
  version: string
  severity: 'info' | 'low' | 'moderate' | 'high' | 'critical'
  cve?: string
  description: string
  recommendation: string
  patchedVersions?: string[]
}

export interface SecurityScanResult {
  vulnerabilities: PackageVulnerability[]
  licenseIssues: Array<{ package: string; license: string; allowed: boolean }>
  maliciousPackages: string[]
  outdatedPackages: Array<{ package: string; current: string; latest: string }>
  securityScore: number
}

export class PackageSecurityScanner {
  private owaspSecurity: OWASPSecurity
  private allowedLicenses: Set<string>
  private knownMaliciousPatterns: RegExp[]

  constructor(owaspSecurity: OWASPSecurity, allowedLicenses: string[] = []) {
    this.owaspSecurity = owaspSecurity
    this.allowedLicenses = new Set(allowedLicenses)
    this.knownMaliciousPatterns = [
      /^(.*-)?malware$/i,
      /^(.*-)?trojan$/i,
      /^(.*-)?virus$/i,
      /^test-package-please-ignore$/i,
      /^discord\.js-selfbot/i,
      /^node-sass-backdoor/i
    ]
  }

  async scanProject(projectPath: string): Promise<SecurityScanResult> {
    const packageJsonPath = resolve(projectPath, 'package.json')
    
    if (!existsSync(packageJsonPath)) {
      throw new Error('package.json not found in project')
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    const dependencies = { 
      ...packageJson.dependencies, 
      ...packageJson.devDependencies 
    }

    const result: SecurityScanResult = {
      vulnerabilities: [],
      licenseIssues: [],
      maliciousPackages: [],
      outdatedPackages: [],
      securityScore: 100
    }

    // Scan for vulnerabilities using npm audit
    await this.scanVulnerabilities(projectPath, result)
    
    // Check licenses
    await this.checkLicenses(dependencies, result)
    
    // Detect malicious packages
    this.detectMaliciousPackages(dependencies, result)
    
    // Check for outdated packages
    await this.checkOutdatedPackages(dependencies, result)
    
    // Calculate security score
    result.securityScore = this.calculateSecurityScore(result)
    
    return result
  }

  private async scanVulnerabilities(projectPath: string, result: SecurityScanResult) {
    try {
      const auditOutput = execSync('npm audit --json', { 
        cwd: projectPath,
        encoding: 'utf-8',
        stdio: 'pipe'
      })
      
      const auditData = JSON.parse(auditOutput)
      
      if (auditData.vulnerabilities) {
        for (const [packageName, vulnData] of Object.entries(auditData.vulnerabilities)) {
          const vuln = vulnData as any
          
          result.vulnerabilities.push({
            name: packageName,
            version: vuln.via?.[0]?.range || 'unknown',
            severity: vuln.severity,
            cve: vuln.via?.[0]?.source,
            description: vuln.via?.[0]?.title || 'Security vulnerability detected',
            recommendation: `Update to ${vuln.fixAvailable ? 'available fix' : 'latest version'}`,
            patchedVersions: vuln.fixAvailable ? [vuln.fixAvailable] : []
          })
        }
      }
    } catch (error) {
      // npm audit might fail if no vulnerabilities or network issues
      console.warn('npm audit failed, using fallback vulnerability detection')
      
      // Fallback to OWASP detection
      const owaspResult = await this.owaspSecurity.auditDependencies(
        resolve(projectPath, 'package.json')
      )
      
      result.vulnerabilities.push(...owaspResult.vulnerabilities.map(v => ({
        name: v.package.split('@')[0],
        version: v.package.split('@')[1] || 'unknown',
        severity: v.severity,
        description: v.description,
        recommendation: v.recommendation
      })))
    }
  }

  private async checkLicenses(dependencies: Record<string, string>, result: SecurityScanResult) {
    for (const [packageName, version] of Object.entries(dependencies)) {
      try {
        // Get package info
        const packageInfo = execSync(`npm view ${packageName}@${version} license --json`, {
          encoding: 'utf-8',
          stdio: 'pipe'
        })
        
        const license = JSON.parse(packageInfo)
        const licenseString = typeof license === 'string' ? license : license?.type || 'unknown'
        
        const allowed = this.allowedLicenses.size === 0 || this.allowedLicenses.has(licenseString)
        
        if (!allowed) {
          result.licenseIssues.push({
            package: packageName,
            license: licenseString,
            allowed: false
          })
        }
      } catch (error) {
        result.licenseIssues.push({
          package: packageName,
          license: 'unknown',
          allowed: false
        })
      }
    }
  }

  private detectMaliciousPackages(dependencies: Record<string, string>, result: SecurityScanResult) {
    for (const packageName of Object.keys(dependencies)) {
      // Check against known malicious patterns
      for (const pattern of this.knownMaliciousPatterns) {
        if (pattern.test(packageName)) {
          result.maliciousPackages.push(packageName)
          break
        }
      }
      
      // Check for typosquatting (simplified detection)
      if (this.isLikelyTyposquat(packageName)) {
        result.maliciousPackages.push(packageName)
      }
    }
  }

  private isLikelyTyposquat(packageName: string): boolean {
    const popularPackages = [
      'react', 'vue', 'angular', 'lodash', 'express', 'axios', 'moment',
      'jquery', 'bootstrap', 'webpack', 'babel', 'typescript', 'eslint'
    ]
    
    // Simple Levenshtein distance check
    for (const popular of popularPackages) {
      if (this.levenshteinDistance(packageName, popular) === 1 && packageName !== popular) {
        return true
      }
    }
    
    return false
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  private async checkOutdatedPackages(dependencies: Record<string, string>, result: SecurityScanResult) {
    for (const [packageName, currentVersion] of Object.entries(dependencies)) {
      try {
        const latestVersion = execSync(`npm view ${packageName} version`, {
          encoding: 'utf-8',
          stdio: 'pipe'
        }).trim()
        
        if (currentVersion.replace(/[\^~]/, '') !== latestVersion) {
          result.outdatedPackages.push({
            package: packageName,
            current: currentVersion,
            latest: latestVersion
          })
        }
      } catch (error) {
        // Package might not exist or network issues
      }
    }
  }

  private calculateSecurityScore(result: SecurityScanResult): number {
    let score = 100
    
    // Deduct points for vulnerabilities
    result.vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical': score -= 25; break
        case 'high': score -= 15; break
        case 'moderate': score -= 10; break
        case 'low': score -= 5; break
        case 'info': score -= 1; break
      }
    })
    
    // Deduct points for license issues
    score -= result.licenseIssues.length * 5
    
    // Deduct points for malicious packages
    score -= result.maliciousPackages.length * 30
    
    // Deduct points for outdated packages
    score -= result.outdatedPackages.length * 2
    
    return Math.max(0, score)
  }

  generateSecurityReport(result: SecurityScanResult): string {
    let report = `🛡️ NALTH Security Scan Report\n`
    report += `================================\n\n`
    report += `Security Score: ${result.securityScore}/100\n\n`
    
    if (result.vulnerabilities.length > 0) {
      report += `🚨 Vulnerabilities Found (${result.vulnerabilities.length}):\n`
      result.vulnerabilities.forEach(vuln => {
        report += `  • ${vuln.name}@${vuln.version} - ${vuln.severity.toUpperCase()}\n`
        report += `    ${vuln.description}\n`
        report += `    Fix: ${vuln.recommendation}\n\n`
      })
    }
    
    if (result.maliciousPackages.length > 0) {
      report += `⚠️ Potentially Malicious Packages (${result.maliciousPackages.length}):\n`
      result.maliciousPackages.forEach(pkg => {
        report += `  • ${pkg} - Remove immediately\n`
      })
      report += `\n`
    }
    
    if (result.licenseIssues.length > 0) {
      report += `📄 License Issues (${result.licenseIssues.length}):\n`
      result.licenseIssues.forEach(issue => {
        report += `  • ${issue.package} - License: ${issue.license}\n`
      })
      report += `\n`
    }
    
    if (result.outdatedPackages.length > 0) {
      report += `📦 Outdated Packages (${result.outdatedPackages.length}):\n`
      result.outdatedPackages.forEach(pkg => {
        report += `  • ${pkg.package}: ${pkg.current} → ${pkg.latest}\n`
      })
      report += `\n`
    }
    
    if (result.securityScore === 100) {
      report += `✅ No security issues detected! Your project is secure.\n`
    } else if (result.securityScore >= 80) {
      report += `✅ Good security posture with minor issues to address.\n`
    } else if (result.securityScore >= 60) {
      report += `⚠️ Moderate security concerns - please address the issues above.\n`
    } else {
      report += `🚨 Critical security issues detected - immediate action required!\n`
    }
    
    return report
  }
}
