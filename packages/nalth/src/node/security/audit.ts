import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { SecurityViolation } from '../types'
import { logSecurityViolation, logSecurityScan } from '../logger'
import colors from 'picocolors'

const execAsync = promisify(exec)

export interface AuditOptions {
  root: string
  fix?: boolean
  reportFormat?: 'json' | 'html' | 'console'
  failOnSeverity?: 'low' | 'medium' | 'high' | 'critical'
}

export interface AuditResult {
  passed: number
  failed: number
  total: number
  violations: SecurityViolation[]
  vulnerabilities: VulnerabilityReport[]
}

export interface VulnerabilityReport {
  package: string
  version: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  recommendation: string
  cve?: string
  cwe?: string
}

export async function runSecurityAudit(options: AuditOptions): Promise<AuditResult> {
  const { root, fix = false, reportFormat = 'console', failOnSeverity } = options
  
  console.log(colors.cyan('🔍 Running comprehensive security audit...'))
  
  const results: AuditResult = {
    passed: 0,
    failed: 0,
    total: 0,
    violations: [],
    vulnerabilities: []
  }

  // 1. Dependency vulnerability scan
  console.log(colors.blue('📦 Scanning dependencies for vulnerabilities...'))
  const depResults = await scanDependencies(root, fix)
  results.vulnerabilities = depResults.vulnerabilities
  results.failed += depResults.failed
  results.passed += depResults.passed
  results.total += depResults.total

  // 2. Code analysis for security patterns
  console.log(colors.blue('🔍 Analyzing code for security patterns...'))
  const codeResults = await analyzeCodeSecurity(root)
  results.violations = codeResults.violations
  results.failed += codeResults.failed
  results.passed += codeResults.passed
  results.total += codeResults.total

  // 3. Configuration security check
  console.log(colors.blue('⚙️ Checking configuration security...'))
  const configResults = await checkConfigSecurity(root)
  results.violations.push(...configResults.violations)
  results.failed += configResults.failed
  results.passed += configResults.passed
  results.total += configResults.total

  // 4. File permissions and sensitive data check
  console.log(colors.blue('🔒 Checking file permissions and sensitive data...'))
  const fileResults = await checkFileSecurity(root)
  results.violations.push(...fileResults.violations)
  results.failed += fileResults.failed
  results.passed += fileResults.passed
  results.total += fileResults.total

  // Generate report
  await generateReport(results, reportFormat, root)

  // Check if we should fail based on severity
  if (failOnSeverity && shouldFailOnSeverity(results, failOnSeverity)) {
    throw new Error(`Security audit failed: found issues with severity >= ${failOnSeverity}`)
  }

  return results
}

async function scanDependencies(root: string, fix: boolean): Promise<{
  vulnerabilities: VulnerabilityReport[]
  passed: number
  failed: number
  total: number
}> {
  const packageJsonPath = join(root, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return { vulnerabilities: [], passed: 0, failed: 0, total: 0 }
  }

  try {
    // Use npm audit for vulnerability scanning
    const auditCommand = fix ? 'npm audit fix --json' : 'npm audit --json'
    const { stdout } = await execAsync(auditCommand, { cwd: root })
    const auditData = JSON.parse(stdout)

    const vulnerabilities: VulnerabilityReport[] = []
    let failed = 0
    let total = 0

    if (auditData.vulnerabilities) {
      for (const [packageName, vulnData] of Object.entries(auditData.vulnerabilities as any)) {
        total++
        
        const vuln: VulnerabilityReport = {
          package: packageName,
          version: vulnData.via?.[0]?.range || 'unknown',
          severity: vulnData.severity || 'medium',
          title: vulnData.via?.[0]?.title || 'Security vulnerability',
          description: vulnData.via?.[0]?.url || 'No description available',
          recommendation: `Update ${packageName} to a secure version`,
          cve: vulnData.via?.[0]?.cve,
          cwe: vulnData.via?.[0]?.cwe
        }

        vulnerabilities.push(vuln)
        failed++

        logSecurityViolation('audit', vuln.severity, `${vuln.package}: ${vuln.title}`, {
          package: vuln.package,
          version: vuln.version,
          cve: vuln.cve
        })
      }
    }

    return {
      vulnerabilities,
      passed: total - failed,
      failed,
      total
    }
  } catch (error) {
    console.warn(colors.yellow('⚠️ Could not run npm audit, skipping dependency scan'))
    return { vulnerabilities: [], passed: 0, failed: 0, total: 0 }
  }
}

async function analyzeCodeSecurity(root: string): Promise<{
  violations: SecurityViolation[]
  passed: number
  failed: number
  total: number
}> {
  const violations: SecurityViolation[] = []
  const securityPatterns = [
    {
      pattern: /eval\s*\(/g,
      severity: 'high' as const,
      message: 'Use of eval() detected - potential code injection vulnerability',
      cwe: 'CWE-95'
    },
    {
      pattern: /Function\s*\(/g,
      severity: 'high' as const,
      message: 'Use of Function constructor - potential code injection vulnerability',
      cwe: 'CWE-95'
    },
    {
      pattern: /innerHTML\s*=/g,
      severity: 'medium' as const,
      message: 'Use of innerHTML - potential XSS vulnerability',
      cwe: 'CWE-79'
    },
    {
      pattern: /document\.write\s*\(/g,
      severity: 'high' as const,
      message: 'Use of document.write - potential XSS vulnerability',
      cwe: 'CWE-79'
    },
    {
      pattern: /setTimeout\s*\(\s*["'`]/g,
      severity: 'medium' as const,
      message: 'String-based setTimeout - potential code injection',
      cwe: 'CWE-95'
    },
    {
      pattern: /setInterval\s*\(\s*["'`]/g,
      severity: 'medium' as const,
      message: 'String-based setInterval - potential code injection',
      cwe: 'CWE-95'
    },
    {
      pattern: /javascript:/g,
      severity: 'high' as const,
      message: 'javascript: protocol usage - potential XSS',
      cwe: 'CWE-79'
    },
    {
      pattern: /\.postMessage\s*\(/g,
      severity: 'medium' as const,
      message: 'postMessage usage - ensure proper origin validation',
      cwe: 'CWE-346'
    },
    {
      pattern: /localStorage\.|sessionStorage\./g,
      severity: 'low' as const,
      message: 'Web storage usage - ensure no sensitive data is stored',
      cwe: 'CWE-312'
    },
    {
      pattern: /crypto\.createHash\s*\(\s*["']md5["']/g,
      severity: 'medium' as const,
      message: 'MD5 hash usage - use stronger hashing algorithms',
      cwe: 'CWE-327'
    }
  ]

  let totalFiles = 0
  let filesWithViolations = 0

  function scanDirectory(dir: string) {
    const items = readdirSync(dir)
    
    for (const item of items) {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        // Skip node_modules and other common directories
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          scanDirectory(fullPath)
        }
      } else if (stat.isFile()) {
        const ext = extname(fullPath)
        
        // Only scan relevant file types
        if (['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'].includes(ext)) {
          totalFiles++
          const fileViolations = scanFile(fullPath, securityPatterns)
          if (fileViolations.length > 0) {
            violations.push(...fileViolations)
            filesWithViolations++
          }
        }
      }
    }
  }

  scanDirectory(root)

  return {
    violations,
    passed: totalFiles - filesWithViolations,
    failed: filesWithViolations,
    total: totalFiles
  }
}

function scanFile(filePath: string, patterns: Array<{
  pattern: RegExp
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  cwe: string
}>): SecurityViolation[] {
  const violations: SecurityViolation[] = []
  
  try {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    
    for (const { pattern, severity, message, cwe } of patterns) {
      let match
      pattern.lastIndex = 0 // Reset regex
      
      while ((match = pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length
        
        violations.push({
          type: 'analysis',
          severity,
          message,
          file: filePath,
          line: lineNumber,
          column: match.index - content.lastIndexOf('\n', match.index - 1),
          rule: cwe,
          timestamp: Date.now()
        })
      }
    }
  } catch (error) {
    // Skip files that can't be read
  }
  
  return violations
}

async function checkConfigSecurity(root: string): Promise<{
  violations: SecurityViolation[]
  passed: number
  failed: number
  total: number
}> {
  const violations: SecurityViolation[] = []
  const configFiles = [
    'package.json',
    '.env',
    '.env.local',
    '.env.production',
    'nalth.config.js',
    'nalth.config.ts',
    'vite.config.js',
    'vite.config.ts'
  ]

  let total = 0
  let failed = 0

  for (const configFile of configFiles) {
    const filePath = join(root, configFile)
    if (existsSync(filePath)) {
      total++
      const configViolations = await checkConfigFile(filePath)
      if (configViolations.length > 0) {
        violations.push(...configViolations)
        failed++
      }
    }
  }

  return {
    violations,
    passed: total - failed,
    failed,
    total
  }
}

async function checkConfigFile(filePath: string): Promise<SecurityViolation[]> {
  const violations: SecurityViolation[] = []
  const fileName = filePath.split('/').pop() || ''
  
  try {
    const content = readFileSync(filePath, 'utf-8')
    
    // Check for exposed secrets
    const secretPatterns = [
      /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/gi,
      /secret[_-]?key\s*[:=]\s*["'][^"']{10,}["']/gi,
      /password\s*[:=]\s*["'][^"']{3,}["']/gi,
      /token\s*[:=]\s*["'][^"']{10,}["']/gi,
      /private[_-]?key\s*[:=]\s*["'][^"']{10,}["']/gi
    ]

    for (const pattern of secretPatterns) {
      if (pattern.test(content)) {
        violations.push({
          type: 'analysis',
          severity: 'high',
          message: `Potential secret exposed in ${fileName}`,
          file: filePath,
          rule: 'CWE-312',
          timestamp: Date.now()
        })
      }
    }

    // Check package.json for security issues
    if (fileName === 'package.json') {
      try {
        const pkg = JSON.parse(content)
        
        // Check for scripts that might be dangerous
        if (pkg.scripts) {
          for (const [scriptName, script] of Object.entries(pkg.scripts)) {
            if (typeof script === 'string' && script.includes('rm -rf')) {
              violations.push({
                type: 'analysis',
                severity: 'medium',
                message: `Potentially dangerous script "${scriptName}" uses rm -rf`,
                file: filePath,
                rule: 'dangerous-script',
                timestamp: Date.now()
              })
            }
          }
        }
      } catch {
        // Invalid JSON
      }
    }
  } catch (error) {
    // Skip files that can't be read
  }

  return violations
}

async function checkFileSecurity(root: string): Promise<{
  violations: SecurityViolation[]
  passed: number
  failed: number
  total: number
}> {
  const violations: SecurityViolation[] = []
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'id_rsa',
    'id_dsa',
    'id_ecdsa',
    'id_ed25519',
    '.ssh/id_rsa',
    '.ssh/id_dsa',
    'private.key',
    'server.key'
  ]

  let total = 0
  let failed = 0

  for (const sensitiveFile of sensitiveFiles) {
    const filePath = join(root, sensitiveFile)
    if (existsSync(filePath)) {
      total++
      
      try {
        const stat = statSync(filePath)
        const mode = stat.mode & parseInt('777', 8)
        
        // Check if file is world-readable
        if (mode & parseInt('044', 8)) {
          violations.push({
            type: 'analysis',
            severity: 'high',
            message: `Sensitive file ${sensitiveFile} has overly permissive permissions`,
            file: filePath,
            rule: 'CWE-732',
            timestamp: Date.now()
          })
          failed++
        }
      } catch (error) {
        // Skip if can't check permissions
      }
    }
  }

  return {
    violations,
    passed: total - failed,
    failed,
    total
  }
}

async function generateReport(
  results: AuditResult,
  format: 'json' | 'html' | 'console',
  root: string
): Promise<void> {
  switch (format) {
    case 'json':
      const jsonReport = JSON.stringify(results, null, 2)
      require('fs').writeFileSync(join(root, 'security-audit.json'), jsonReport)
      console.log(colors.green('📄 JSON report saved to security-audit.json'))
      break
      
    case 'html':
      const htmlReport = generateHTMLReport(results)
      require('fs').writeFileSync(join(root, 'security-audit.html'), htmlReport)
      console.log(colors.green('📄 HTML report saved to security-audit.html'))
      break
      
    case 'console':
    default:
      printConsoleReport(results)
      break
  }
}

function generateHTMLReport(results: AuditResult): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Nalth Security Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
    .header { text-align: center; margin-bottom: 40px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .metric { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; }
    .metric-value { font-size: 2rem; font-weight: bold; }
    .passed { color: #22c55e; }
    .failed { color: #ef4444; }
    .violation { margin: 10px 0; padding: 15px; border-left: 4px solid #ef4444; background: #fef2f2; }
    .severity-high { border-left-color: #dc2626; }
    .severity-medium { border-left-color: #f59e0b; }
    .severity-low { border-left-color: #3b82f6; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ Nalth Security Audit Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="summary">
    <div class="metric">
      <div class="metric-value passed">${results.passed}</div>
      <div>Passed</div>
    </div>
    <div class="metric">
      <div class="metric-value failed">${results.failed}</div>
      <div>Failed</div>
    </div>
    <div class="metric">
      <div class="metric-value">${results.total}</div>
      <div>Total</div>
    </div>
  </div>

  <h2>Violations</h2>
  ${results.violations.map(v => `
    <div class="violation severity-${v.severity}">
      <strong>${v.message}</strong><br>
      <small>File: ${v.file} ${v.line ? `(Line ${v.line})` : ''}</small><br>
      <small>Severity: ${v.severity.toUpperCase()} | Rule: ${v.rule || 'N/A'}</small>
    </div>
  `).join('')}

  <h2>Vulnerabilities</h2>
  ${results.vulnerabilities.map(v => `
    <div class="violation severity-${v.severity}">
      <strong>${v.package}: ${v.title}</strong><br>
      <small>Version: ${v.version} | Severity: ${v.severity.toUpperCase()}</small><br>
      <p>${v.description}</p>
      <p><strong>Recommendation:</strong> ${v.recommendation}</p>
    </div>
  `).join('')}
</body>
</html>
  `
}

function printConsoleReport(results: AuditResult): void {
  console.log('\n' + colors.cyan('🛡️ Security Audit Summary'))
  console.log(colors.green(`✅ Passed: ${results.passed}`))
  console.log(colors.red(`❌ Failed: ${results.failed}`))
  console.log(colors.blue(`📊 Total: ${results.total}`))
  
  if (results.violations.length > 0) {
    console.log('\n' + colors.yellow('⚠️ Code Violations:'))
    results.violations.forEach(violation => {
      const icon = getSeverityIcon(violation.severity)
      console.log(`${icon} ${violation.message}`)
      if (violation.file) {
        console.log(colors.dim(`   ${violation.file}${violation.line ? `:${violation.line}` : ''}`))
      }
    })
  }
  
  if (results.vulnerabilities.length > 0) {
    console.log('\n' + colors.red('🚨 Dependency Vulnerabilities:'))
    results.vulnerabilities.forEach(vuln => {
      const icon = getSeverityIcon(vuln.severity)
      console.log(`${icon} ${vuln.package}: ${vuln.title}`)
      console.log(colors.dim(`   Version: ${vuln.version} | Severity: ${vuln.severity.toUpperCase()}`))
    })
  }
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical': return '🚨'
    case 'high': return '⚠️'
    case 'medium': return '⚡'
    case 'low': return 'ℹ️'
    default: return '🔍'
  }
}

function shouldFailOnSeverity(results: AuditResult, threshold: string): boolean {
  const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 }
  const thresholdLevel = severityLevels[threshold as keyof typeof severityLevels]
  
  return [...results.violations, ...results.vulnerabilities].some(item => {
    const itemLevel = severityLevels[item.severity as keyof typeof severityLevels]
    return itemLevel >= thresholdLevel
  })
}
