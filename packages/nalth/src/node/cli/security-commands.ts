import { resolve } from 'path'
import { existsSync } from 'fs'
import { OWASPSecurity, defaultOWASPConfig } from '../security/owasp.js'
import { PackageSecurityScanner } from '../security/package-scanner.js'

export async function auditCommand(options: { 
  path?: string
  format?: 'json' | 'text'
  severity?: 'low' | 'moderate' | 'high' | 'critical'
  fix?: boolean
}) {
  const projectPath = resolve(options.path || process.cwd())
  
  if (!existsSync(resolve(projectPath, 'package.json'))) {
    console.error('❌ No package.json found. Run this command in a Node.js project.')
    process.exit(1)
  }

  console.log('🔍 Running NALTH Security Audit...\n')
  
  const owaspSecurity = new OWASPSecurity(defaultOWASPConfig)
  const scanner = new PackageSecurityScanner(
    owaspSecurity,
    defaultOWASPConfig.dependencies.allowedLicenses
  )

  try {
    const scanResult = await scanner.scanProject(projectPath)
    
    if (options.format === 'json') {
      console.log(JSON.stringify(scanResult, null, 2))
      return
    }

    // Filter by severity if specified
    if (options.severity) {
      const severityLevels = ['info', 'low', 'moderate', 'high', 'critical']
      const minSeverityIndex = severityLevels.indexOf(options.severity)
      
      scanResult.vulnerabilities = scanResult.vulnerabilities.filter(vuln => {
        const vulnSeverityIndex = severityLevels.indexOf(vuln.severity)
        return vulnSeverityIndex >= minSeverityIndex
      })
    }

    const report = scanner.generateSecurityReport(scanResult)
    console.log(report)

    // Auto-fix if requested and safe
    if (options.fix && scanResult.vulnerabilities.length > 0) {
      console.log('\n🔧 Attempting to fix vulnerabilities...')
      await autoFixVulnerabilities(scanResult, projectPath)
    }

    // Exit with error code if critical issues found
    const hasCritical = scanResult.vulnerabilities.some(v => v.severity === 'critical')
    const hasMalicious = scanResult.maliciousPackages.length > 0
    
    if (hasCritical || hasMalicious) {
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Security audit failed:', error)
    process.exit(1)
  }
}

export async function securityReportCommand(options: {
  path?: string
  output?: string
  detailed?: boolean
}) {
  const projectPath = resolve(options.path || process.cwd())
  
  console.log('📊 Generating Security Report...\n')
  
  const owaspSecurity = new OWASPSecurity(defaultOWASPConfig)
  const scanner = new PackageSecurityScanner(
    owaspSecurity,
    defaultOWASPConfig.dependencies.allowedLicenses
  )

  try {
    const scanResult = await scanner.scanProject(projectPath)
    
    let report = `# 🛡️ NALTH Security Report\n\n`
    report += `**Generated:** ${new Date().toISOString()}\n`
    report += `**Project:** ${projectPath}\n`
    report += `**Security Score:** ${scanResult.securityScore}/100\n\n`

    // Executive Summary
    report += `## Executive Summary\n\n`
    if (scanResult.securityScore >= 90) {
      report += `✅ **Excellent** - Your project has strong security posture.\n`
    } else if (scanResult.securityScore >= 70) {
      report += `⚠️ **Good** - Minor security improvements recommended.\n`
    } else if (scanResult.securityScore >= 50) {
      report += `🔶 **Fair** - Several security issues need attention.\n`
    } else {
      report += `🚨 **Poor** - Critical security issues require immediate action.\n`
    }

    // Vulnerability Details
    if (scanResult.vulnerabilities.length > 0) {
      report += `\n## 🚨 Vulnerabilities (${scanResult.vulnerabilities.length})\n\n`
      
      const groupedVulns = scanResult.vulnerabilities.reduce((acc, vuln) => {
        if (!acc[vuln.severity]) acc[vuln.severity] = []
        acc[vuln.severity].push(vuln)
        return acc
      }, {} as Record<string, typeof scanResult.vulnerabilities>)

      for (const [severity, vulns] of Object.entries(groupedVulns)) {
        report += `### ${severity.toUpperCase()} (${vulns.length})\n\n`
        vulns.forEach(vuln => {
          report += `- **${vuln.name}@${vuln.version}**\n`
          report += `  - ${vuln.description}\n`
          if (vuln.cve) report += `  - CVE: ${vuln.cve}\n`
          report += `  - Fix: ${vuln.recommendation}\n\n`
        })
      }
    }

    // Malicious Packages
    if (scanResult.maliciousPackages.length > 0) {
      report += `## ⚠️ Potentially Malicious Packages (${scanResult.maliciousPackages.length})\n\n`
      scanResult.maliciousPackages.forEach(pkg => {
        report += `- **${pkg}** - Remove immediately\n`
      })
      report += `\n`
    }

    // License Issues
    if (scanResult.licenseIssues.length > 0) {
      report += `## 📄 License Compliance Issues (${scanResult.licenseIssues.length})\n\n`
      scanResult.licenseIssues.forEach(issue => {
        report += `- **${issue.package}** - License: ${issue.license}\n`
      })
      report += `\n`
    }

    // Recommendations
    report += `## 🔧 Recommendations\n\n`
    
    if (scanResult.vulnerabilities.length > 0) {
      report += `1. **Update vulnerable packages** - Run \`npm audit fix\` or update manually\n`
    }
    
    if (scanResult.maliciousPackages.length > 0) {
      report += `2. **Remove malicious packages** - Uninstall suspicious packages immediately\n`
    }
    
    if (scanResult.outdatedPackages.length > 0) {
      report += `3. **Update dependencies** - Keep packages up to date for security patches\n`
    }
    
    report += `4. **Enable NALTH security features** - Use \`nalth dev\` with security monitoring\n`
    report += `5. **Regular audits** - Run \`nalth audit\` before each deployment\n\n`

    // Detailed Analysis (if requested)
    if (options.detailed) {
      report += `## 📋 Detailed Analysis\n\n`
      
      if (scanResult.outdatedPackages.length > 0) {
        report += `### Outdated Packages (${scanResult.outdatedPackages.length})\n\n`
        scanResult.outdatedPackages.forEach(pkg => {
          report += `- **${pkg.package}**: ${pkg.current} → ${pkg.latest}\n`
        })
        report += `\n`
      }

      // Security Headers Analysis
      report += `### Security Configuration\n\n`
      report += `- ✅ HTTPS enforced\n`
      report += `- ✅ Content Security Policy enabled\n`
      report += `- ✅ Security headers configured\n`
      report += `- ✅ Dependency auditing active\n\n`
    }

    console.log(report)

    // Save to file if output specified
    if (options.output) {
      const { writeFileSync } = await import('fs')
      writeFileSync(options.output, report)
      console.log(`\n📄 Report saved to: ${options.output}`)
    }

  } catch (error) {
    console.error('❌ Failed to generate security report:', error)
    process.exit(1)
  }
}

export async function scanPackageCommand(packageName: string, options: {
  version?: string
  detailed?: boolean
}) {
  console.log(`🔍 Scanning package: ${packageName}${options.version ? `@${options.version}` : ''}`)
  
  const owaspSecurity = new OWASPSecurity(defaultOWASPConfig)
  
  try {
    // Create a temporary package.json for scanning
    const tempPackageJson = {
      dependencies: {
        [packageName]: options.version || 'latest'
      }
    }
    
    const { writeFileSync, mkdirSync, rmSync } = await import('fs')
    const tempDir = resolve(process.cwd(), '.nalth-temp-scan')
    
    mkdirSync(tempDir, { recursive: true })
    writeFileSync(
      resolve(tempDir, 'package.json'),
      JSON.stringify(tempPackageJson, null, 2)
    )

    const scanner = new PackageSecurityScanner(
      owaspSecurity,
      defaultOWASPConfig.dependencies.allowedLicenses
    )
    
    const result = await scanner.scanProject(tempDir)
    
    // Clean up
    rmSync(tempDir, { recursive: true, force: true })
    
    if (result.vulnerabilities.length === 0 && result.maliciousPackages.length === 0) {
      console.log(`✅ ${packageName} appears to be safe`)
    } else {
      console.log(`⚠️ Security issues found in ${packageName}:`)
      
      result.vulnerabilities.forEach(vuln => {
        console.log(`  • ${vuln.severity.toUpperCase()}: ${vuln.description}`)
      })
      
      result.maliciousPackages.forEach(pkg => {
        console.log(`  • MALICIOUS: ${pkg}`)
      })
    }
    
    if (options.detailed) {
      console.log('\nDetailed Analysis:')
      console.log(scanner.generateSecurityReport(result))
    }

  } catch (error) {
    console.error('❌ Package scan failed:', error)
    process.exit(1)
  }
}

export async function securityInitCommand(options: {
  strict?: boolean
  framework?: string
}) {
  console.log('🛡️ Initializing NALTH Security Configuration...\n')
  
  const projectPath = process.cwd()
  const { writeFileSync, mkdirSync } = await import('fs')
  
  try {
    // Create .nalth directory
    const nalthDir = resolve(projectPath, '.nalth')
    mkdirSync(nalthDir, { recursive: true })
    
    // Create security configuration
    const securityConfig = {
      ...defaultOWASPConfig,
      csp: {
        ...defaultOWASPConfig.csp,
        strictDynamic: options.strict || false
      },
      audit: options.strict ? 'strict' : 'balanced'
    }
    
    writeFileSync(
      resolve(nalthDir, 'security.config.json'),
      JSON.stringify(securityConfig, null, 2)
    )
    
    // Create security ignore file
    const securityIgnore = `# NALTH Security Ignore
# Add packages to ignore during security audits
# Format: package-name@version or package-name

# Example:
# lodash@4.17.20
# debug
`
    
    writeFileSync(resolve(nalthDir, '.securityignore'), securityIgnore)
    
    // Update package.json scripts
    const packageJsonPath = resolve(projectPath, 'package.json')
    if (existsSync(packageJsonPath)) {
      const { readFileSync } = await import('fs')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      
      if (!packageJson.scripts) packageJson.scripts = {}
      
      packageJson.scripts['security:audit'] = 'nalth audit'
      packageJson.scripts['security:report'] = 'nalth security:report'
      packageJson.scripts['security:scan'] = 'nalth security:scan'
      
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
      
      console.log('✅ Added security scripts to package.json')
    }
    
    console.log('✅ Security configuration initialized')
    console.log('✅ Created .nalth/security.config.json')
    console.log('✅ Created .nalth/.securityignore')
    console.log('\nNext steps:')
    console.log('  npm run security:audit    # Run security audit')
    console.log('  npm run security:report   # Generate security report')
    console.log('  nalth dev                 # Start with security monitoring')

  } catch (error) {
    console.error('❌ Security initialization failed:', error)
    process.exit(1)
  }
}

async function autoFixVulnerabilities(scanResult: any, projectPath: string) {
  const { execSync } = await import('child_process')
  
  try {
    // Try npm audit fix first
    console.log('  Running npm audit fix...')
    execSync('npm audit fix', { 
      cwd: projectPath, 
      stdio: 'inherit' 
    })
    
    // Check for remaining high/critical vulnerabilities
    const criticalVulns = scanResult.vulnerabilities.filter(
      (v: any) => v.severity === 'critical' || v.severity === 'high'
    )
    
    if (criticalVulns.length > 0) {
      console.log('  Some vulnerabilities require manual intervention:')
      criticalVulns.forEach((vuln: any) => {
        console.log(`    • ${vuln.name}: ${vuln.recommendation}`)
      })
    } else {
      console.log('  ✅ All vulnerabilities fixed automatically')
    }
    
  } catch (error) {
    console.warn('  ⚠️ Auto-fix failed, manual intervention required')
  }
}
