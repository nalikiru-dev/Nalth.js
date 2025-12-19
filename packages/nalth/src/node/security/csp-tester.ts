import colors from 'picocolors'
import type { SecurityConfig } from '../security.config'

export interface CSPTestResult {
  directive: string
  passed: boolean
  message: string
  severity: 'info' | 'warning' | 'error'
}

export interface CSPTestSuite {
  name: string
  results: CSPTestResult[]
  passed: boolean
  score: number
}

/**
 * Comprehensive CSP Testing and Validation Utility
 */
export class CSPTester {
  private config: SecurityConfig['csp']

  constructor(config: SecurityConfig['csp']) {
    this.config = config
  }

  /**
   * Run comprehensive CSP tests
   */
  async runTests(): Promise<CSPTestSuite> {
    const results: CSPTestResult[] = []

    // Test basic security directives
    results.push(...this.testBasicSecurity())

    // Test development compatibility
    results.push(...this.testDevelopmentCompatibility())

    // Test production readiness
    results.push(...this.testProductionReadiness())

    // Test common vulnerabilities
    results.push(...this.testVulnerabilities())

    const passed = results.every((r) => r.severity !== 'error')
    const score = this.calculateScore(results)

    return {
      name: 'CSP Security Test Suite',
      results,
      passed,
      score,
    }
  }

  /**
   * Test basic security directives
   */
  private testBasicSecurity(): CSPTestResult[] {
    const results: CSPTestResult[] = []

    // Check if CSP is enabled
    results.push({
      directive: 'csp-enabled',
      passed: !!this.config?.enabled,
      message: this.config?.enabled
        ? 'CSP is enabled'
        : 'CSP is disabled - security risk',
      severity: this.config?.enabled ? 'info' : 'error',
    })

    // Check default-src
    const defaultSrc = this.config?.directives?.['default-src']
    results.push({
      directive: 'default-src',
      passed: Array.isArray(defaultSrc) && defaultSrc.includes("'self'"),
      message: defaultSrc
        ? 'default-src properly configured'
        : 'default-src missing or misconfigured',
      severity:
        Array.isArray(defaultSrc) && defaultSrc.includes("'self'")
          ? 'info'
          : 'error',
    })

    // Check object-src
    const objectSrc = this.config?.directives?.['object-src']
    results.push({
      directive: 'object-src',
      passed: Array.isArray(objectSrc) && objectSrc.includes("'none'"),
      message: objectSrc?.includes("'none'")
        ? 'object-src properly restricted'
        : 'object-src should be set to none',
      severity:
        Array.isArray(objectSrc) && objectSrc.includes("'none'")
          ? 'info'
          : 'warning',
    })

    // Check frame-ancestors
    const frameAncestors = this.config?.directives?.['frame-ancestors']
    results.push({
      directive: 'frame-ancestors',
      passed:
        Array.isArray(frameAncestors) && frameAncestors.includes("'none'"),
      message: frameAncestors?.includes("'none'")
        ? 'frame-ancestors properly restricted'
        : 'frame-ancestors should restrict framing',
      severity:
        Array.isArray(frameAncestors) && frameAncestors.includes("'none'")
          ? 'info'
          : 'warning',
    })

    return results
  }

  /**
   * Test development compatibility
   */
  private testDevelopmentCompatibility(): CSPTestResult[] {
    const results: CSPTestResult[] = []

    // Check script-src for development needs
    const scriptSrc = this.config?.directives?.['script-src'] as string[]
    const hasUnsafeInline = scriptSrc?.includes("'unsafe-inline'")
    const hasUnsafeEval = scriptSrc?.includes("'unsafe-eval'")
    const hasLocalhost = scriptSrc?.some((src) => src.includes('localhost'))
    const hasWebSocket =
      scriptSrc?.includes('ws:') || scriptSrc?.includes('wss:')

    results.push({
      directive: 'script-src-dev',
      passed: hasUnsafeInline && hasUnsafeEval && hasLocalhost && hasWebSocket,
      message: 'script-src configured for development (HMR, eval, localhost)',
      severity: 'info',
    })

    // Check style-src for development needs
    const styleSrc = this.config?.directives?.['style-src'] as string[]
    const hasStyleUnsafeInline = styleSrc?.includes("'unsafe-inline'")

    results.push({
      directive: 'style-src-dev',
      passed: hasStyleUnsafeInline,
      message: hasStyleUnsafeInline
        ? 'style-src allows inline styles for development'
        : 'style-src may block development styles',
      severity: hasStyleUnsafeInline ? 'info' : 'warning',
    })

    // Check connect-src for development
    const connectSrc = this.config?.directives?.['connect-src'] as string[]
    const hasConnectLocalhost = connectSrc?.some((src) =>
      src.includes('localhost'),
    )
    const hasConnectWS =
      connectSrc?.includes('ws:') || connectSrc?.includes('wss:')

    results.push({
      directive: 'connect-src-dev',
      passed: hasConnectLocalhost && hasConnectWS,
      message: 'connect-src configured for development (localhost, WebSocket)',
      severity: 'info',
    })

    return results
  }

  /**
   * Test production readiness
   */
  private testProductionReadiness(): CSPTestResult[] {
    const results: CSPTestResult[] = []

    // Check for upgrade-insecure-requests
    const hasUpgradeInsecure =
      this.config?.directives?.['upgrade-insecure-requests'] !== undefined

    results.push({
      directive: 'upgrade-insecure-requests',
      passed: hasUpgradeInsecure,
      message: hasUpgradeInsecure
        ? 'upgrade-insecure-requests directive present'
        : 'Consider adding upgrade-insecure-requests for production',
      severity: hasUpgradeInsecure ? 'info' : 'warning',
    })

    // Check for report-uri
    results.push({
      directive: 'report-uri',
      passed: !!this.config?.reportUri,
      message: this.config?.reportUri
        ? 'CSP violation reporting configured'
        : 'Consider adding CSP violation reporting',
      severity: this.config?.reportUri ? 'info' : 'warning',
    })

    // Check base-uri restriction
    const baseUri = this.config?.directives?.['base-uri']
    results.push({
      directive: 'base-uri',
      passed: Array.isArray(baseUri) && baseUri.includes("'self'"),
      message: baseUri?.includes("'self'")
        ? 'base-uri properly restricted'
        : 'base-uri should be restricted to self',
      severity:
        Array.isArray(baseUri) && baseUri.includes("'self'")
          ? 'info'
          : 'warning',
    })

    return results
  }

  /**
   * Test for common vulnerabilities
   */
  private testVulnerabilities(): CSPTestResult[] {
    const results: CSPTestResult[] = []

    // Check for unsafe-inline in production context
    const scriptSrc = this.config?.directives?.['script-src'] as string[]
    const hasUnsafeInline = scriptSrc?.includes("'unsafe-inline'")

    results.push({
      directive: 'unsafe-inline-risk',
      passed: !hasUnsafeInline || process.env.NODE_ENV === 'development',
      message: hasUnsafeInline
        ? 'unsafe-inline detected - consider using nonces in production'
        : 'No unsafe-inline detected',
      severity:
        hasUnsafeInline && process.env.NODE_ENV === 'production'
          ? 'warning'
          : 'info',
    })

    // Check for unsafe-eval
    const hasUnsafeEval = scriptSrc?.includes("'unsafe-eval'")

    results.push({
      directive: 'unsafe-eval-risk',
      passed: !hasUnsafeEval || process.env.NODE_ENV === 'development',
      message: hasUnsafeEval
        ? 'unsafe-eval detected - remove in production if possible'
        : 'No unsafe-eval detected',
      severity:
        hasUnsafeEval && process.env.NODE_ENV === 'production'
          ? 'warning'
          : 'info',
    })

    // Check for wildcard sources
    const allDirectives = Object.values(this.config?.directives || {}).flat()
    const hasWildcard = allDirectives.some(
      (directive) =>
        typeof directive === 'string' &&
        directive.includes('*') &&
        !directive.includes('localhost:*'),
    )

    results.push({
      directive: 'wildcard-sources',
      passed: !hasWildcard,
      message: hasWildcard
        ? 'Wildcard sources detected - be cautious'
        : 'No problematic wildcards detected',
      severity: hasWildcard ? 'warning' : 'info',
    })

    return results
  }

  /**
   * Calculate security score based on test results
   */
  private calculateScore(results: CSPTestResult[]): number {
    const totalTests = results.length
    const passedTests = results.filter((r) => r.passed).length
    const errorCount = results.filter((r) => r.severity === 'error').length
    const warningCount = results.filter((r) => r.severity === 'warning').length

    let score = (passedTests / totalTests) * 100

    // Penalize errors more heavily
    score -= errorCount * 15
    score -= warningCount * 5

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Generate a detailed report
   */
  generateReport(testSuite: CSPTestSuite): string {
    let report = `\n${colors.bold('🛡️  Nalth CSP Security Report')}\n`
    report += `${colors.gray('=')}`.repeat(50) + '\n\n'

    // Overall status
    const statusColor = testSuite.passed ? colors.green : colors.red
    const statusIcon = testSuite.passed ? '✅' : '❌'
    report += `${statusIcon} Overall Status: ${statusColor(testSuite.passed ? 'PASSED' : 'FAILED')}\n`
    report += `📊 Security Score: ${this.getScoreColor(testSuite.score)}${testSuite.score.toFixed(1)}/100${colors.reset()}\n\n`

    // Group results by severity
    const errors = testSuite.results.filter((r) => r.severity === 'error')
    const warnings = testSuite.results.filter((r) => r.severity === 'warning')
    const info = testSuite.results.filter((r) => r.severity === 'info')

    if (errors.length > 0) {
      report += `${colors.red('🚨 Critical Issues:')}\n`
      errors.forEach((result) => {
        report += `  ${result.passed ? '✅' : '❌'} ${result.directive}: ${result.message}\n`
      })
      report += '\n'
    }

    if (warnings.length > 0) {
      report += `${colors.yellow('⚠️  Warnings:')}\n`
      warnings.forEach((result) => {
        report += `  ${result.passed ? '✅' : '⚠️ '} ${result.directive}: ${result.message}\n`
      })
      report += '\n'
    }

    if (info.length > 0) {
      report += `${colors.cyan('ℹ️  Information:')}\n`
      info.forEach((result) => {
        report += `  ${result.passed ? '✅' : 'ℹ️ '} ${result.directive}: ${result.message}\n`
      })
      report += '\n'
    }

    // Recommendations
    report += `${colors.bold('📋 Recommendations:')}\n`
    if (testSuite.score < 70) {
      report += `  • ${colors.red('Critical')}: Address security issues immediately\n`
    }
    if (warnings.length > 0) {
      report += `  • ${colors.yellow('Important')}: Review and fix warnings for production\n`
    }
    if (testSuite.score >= 90) {
      report += `  • ${colors.green('Excellent')}: CSP configuration is well-secured\n`
    }

    report += `\n${colors.gray('Report generated at:')} ${new Date().toISOString()}\n`

    return report
  }

  /**
   * Get color for security score
   */
  private getScoreColor(score: number): (str: string) => string {
    if (score >= 90) return colors.green
    if (score >= 70) return colors.yellow
    return colors.red
  }
}

/**
 * Quick CSP validation function
 */
export function validateCSP(config: SecurityConfig['csp']): boolean {
  const tester = new CSPTester(config)
  return tester.runTests().then((suite) => suite.passed)
}

/**
 * Generate CSP test report
 */
export async function generateCSPReport(
  config: SecurityConfig['csp'],
): Promise<string> {
  const tester = new CSPTester(config)
  const testSuite = await tester.runTests()
  return tester.generateReport(testSuite)
}
