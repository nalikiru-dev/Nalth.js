#!/usr/bin/env node

/**
 * CSP Template Validation Script
 * Ensures all create-nalth templates have consistent and proper CSP configurations
 */

import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import colors from 'picocolors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const TEMPLATES_DIR = join(__dirname, '../packages/create-nalth')
const REQUIRED_CSP_DIRECTIVES = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'media-src',
  'object-src',
  'child-src',
  'worker-src',
  'frame-ancestors',
  'form-action',
  'base-uri',
  'manifest-src',
  'upgrade-insecure-requests',
]

const REQUIRED_SECURITY_FEATURES = ['https', 'csp', 'sri', 'audit', 'headers']

function validateTemplate(templateName) {
  const configPath = join(TEMPLATES_DIR, templateName, 'nalth.config.ts')

  try {
    const configContent = readFileSync(configPath, 'utf-8')
    const results = {
      template: templateName,
      hasEnhancedCSP: false,
      hasAllDirectives: false,
      hasSecurityFeatures: false,
      hasReportUri: false,
      issues: [],
    }

    // Check for enhanced CSP configuration
    if (configContent.includes('Enhanced CSP Configuration')) {
      results.hasEnhancedCSP = true
    } else {
      results.issues.push('Missing enhanced CSP configuration comment')
    }

    // Check for all required CSP directives
    const missingDirectives = REQUIRED_CSP_DIRECTIVES.filter(
      (directive) => !configContent.includes(`'${directive}'`),
    )

    if (missingDirectives.length === 0) {
      results.hasAllDirectives = true
    } else {
      results.issues.push(
        `Missing CSP directives: ${missingDirectives.join(', ')}`,
      )
    }

    // Check for all security features
    const missingFeatures = REQUIRED_SECURITY_FEATURES.filter((feature) => {
      if (feature === 'https') {
        return !configContent.includes('https: {')
      }
      if (feature === 'csp') {
        return !configContent.includes('csp: {')
      }
      return !configContent.includes(`${feature}: {`)
    })

    if (missingFeatures.length === 0) {
      results.hasSecurityFeatures = true
    } else {
      results.issues.push(
        `Missing security features: ${missingFeatures.join(', ')}`,
      )
    }

    // Check for CSP report URI
    if (configContent.includes("reportUri: '/__nalth/csp-report'")) {
      results.hasReportUri = true
    } else {
      results.issues.push('Missing CSP report URI')
    }

    // Check for framework-specific optimizations
    const frameworkOptimizations = {
      'nalth-react': ['React development', 'React DevTools'],
      'nalth-vue': ['Vue development', 'Vue SFC'],
      'nalth-svelte': ['Svelte development', 'Svelte component'],
      'nalth-solid': ['SolidJS development'],
      'nalth-preact': ['Preact development'],
      'nalth-qwik': ['Qwik development'],
      'nalth-lit': ['Lit development'],
      'nalth-vanilla': ['vanilla JS development'],
    }

    const expectedOptimizations = frameworkOptimizations[templateName]
    if (expectedOptimizations) {
      const hasOptimizations = expectedOptimizations.some((opt) =>
        configContent.includes(opt),
      )
      if (!hasOptimizations) {
        results.issues.push(
          `Missing framework-specific optimizations for ${templateName}`,
        )
      }
    }

    return results
  } catch (error) {
    return {
      template: templateName,
      error: error.message,
      issues: [`Failed to read config file: ${error.message}`],
    }
  }
}

function generateReport(results) {
  console.log(`\n${colors.bold('🛡️  Nalth CSP Template Validation Report')}\n`)
  console.log(`${colors.gray('=')}`.repeat(60))

  let totalTemplates = results.length
  let validTemplates = 0
  let totalIssues = 0

  results.forEach((result) => {
    const isValid =
      result.hasEnhancedCSP &&
      result.hasAllDirectives &&
      result.hasSecurityFeatures &&
      result.hasReportUri &&
      result.issues.length === 0

    if (isValid) {
      validTemplates++
      console.log(`\n${colors.green('✅')} ${colors.bold(result.template)}`)
      console.log(
        `   ${colors.green('All security features properly configured')}`,
      )
    } else {
      console.log(`\n${colors.red('❌')} ${colors.bold(result.template)}`)

      if (result.error) {
        console.log(`   ${colors.red('ERROR:')} ${result.error}`)
      }

      result.issues.forEach((issue) => {
        console.log(`   ${colors.yellow('⚠️ ')} ${issue}`)
        totalIssues++
      })

      // Show what's working
      const working = []
      if (result.hasEnhancedCSP) working.push('Enhanced CSP')
      if (result.hasAllDirectives) working.push('All directives')
      if (result.hasSecurityFeatures) working.push('Security features')
      if (result.hasReportUri) working.push('Report URI')

      if (working.length > 0) {
        console.log(`   ${colors.cyan('✓')} Working: ${working.join(', ')}`)
      }
    }
  })

  // Summary
  console.log(`\n${colors.gray('=')}`.repeat(60))
  console.log(`\n${colors.bold('📊 Summary:')}`)
  console.log(`   Templates validated: ${totalTemplates}`)
  console.log(`   ${colors.green('Valid templates:')} ${validTemplates}`)
  console.log(
    `   ${colors.red('Templates with issues:')} ${totalTemplates - validTemplates}`,
  )
  console.log(`   ${colors.yellow('Total issues found:')} ${totalIssues}`)

  const successRate = ((validTemplates / totalTemplates) * 100).toFixed(1)
  const rateColor =
    successRate >= 90
      ? colors.green
      : successRate >= 70
        ? colors.yellow
        : colors.red

  console.log(
    `   ${colors.bold('Success rate:')} ${rateColor(successRate + '%')}`,
  )

  if (validTemplates === totalTemplates) {
    console.log(
      `\n${colors.green('🎉 All templates have proper CSP configurations!')}`,
    )
    return true
  } else {
    console.log(`\n${colors.red('🚨 Some templates need attention')}`)
    return false
  }
}

function main() {
  console.log(
    colors.cyan('🔍 Validating CSP configurations across all templates...'),
  )

  try {
    // Get all template directories
    const templates = readdirSync(TEMPLATES_DIR, { withFileTypes: true })
      .filter(
        (dirent) => dirent.isDirectory() && dirent.name.startsWith('nalth-'),
      )
      .map((dirent) => dirent.name)

    console.log(`Found ${templates.length} templates: ${templates.join(', ')}`)

    // Validate each template
    const results = templates.map(validateTemplate)

    // Generate report
    const allValid = generateReport(results)

    // Exit with appropriate code
    process.exit(allValid ? 0 : 1)
  } catch (error) {
    console.error(colors.red('❌ Validation failed:'), error.message)
    process.exit(1)
  }
}

// Run validation
main()
