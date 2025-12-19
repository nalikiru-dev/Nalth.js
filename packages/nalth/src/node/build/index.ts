import { rollup, RollupOptions, OutputOptions } from 'rollup'
import { resolve, relative, join } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import type { ResolvedConfig } from '../types'
import { createRollupPlugins } from './plugins'
import { runSecurityAudit } from '../security/audit'
import { logSecurityScan } from '../logger'
import { formatBytes, formatDuration } from '../utils'
import colors from 'picocolors'

export async function build(config: ResolvedConfig): Promise<void> {
  const start = Date.now()
  
  config.logger.info(colors.cyan('🛡️ Building for production with security validation...'))

  // Run security audit before build
  if (config.security.audit?.enabled) {
    config.logger.info(colors.blue('🔍 Running pre-build security audit...'))
    
    const auditResults = await runSecurityAudit({
      root: config.root,
      failOnSeverity: config.security.audit.failOnHigh ? 'high' : 
                     config.security.audit.failOnMedium ? 'medium' : undefined
    })

    logSecurityScan('Pre-build Audit', {
      passed: auditResults.passed,
      failed: auditResults.failed,
      total: auditResults.total
    })

    if (auditResults.failed > 0 && 
        (config.security.audit.failOnHigh || config.security.audit.failOnMedium)) {
      throw new Error(`Build failed due to security audit violations`)
    }
  }

  // Create Rollup configuration
  const rollupOptions = await createRollupOptions(config)
  
  try {
    // Build with Rollup
    const bundle = await rollup(rollupOptions)
    
    // Generate output
    const outputOptions = createOutputOptions(config)
    const { output } = await bundle.generate(outputOptions)
    
    // Write bundle
    if (config.build.write !== false) {
      await bundle.write(outputOptions)
    }
    
    await bundle.close()

    // Log build results
    const duration = Date.now() - start
    const totalSize = output.reduce((size, chunk) => {
      if (chunk.type === 'chunk') {
        return size + Buffer.byteLength(chunk.code, 'utf-8')
      } else if (chunk.type === 'asset') {
        return size + Buffer.byteLength(chunk.source as string, 'utf-8')
      }
      return size
    }, 0)

    config.logger.info(
      colors.green(`✅ Build completed in ${formatDuration(duration)}`) +
      colors.dim(` (${formatBytes(totalSize)})`)
    )

    // Log chunk information
    output.forEach(chunk => {
      if (chunk.type === 'chunk') {
        const size = Buffer.byteLength(chunk.code, 'utf-8')
        config.logger.info(
          colors.dim(`  ${chunk.fileName}`) + 
          colors.cyan(` ${formatBytes(size)}`)
        )
      }
    })

    // Run post-build security validation
    await runPostBuildSecurity(config, output)

  } catch (error: any) {
    config.logger.error(colors.red('❌ Build failed:'), { error })
    throw error
  }
}

async function createRollupOptions(config: ResolvedConfig): Promise<RollupOptions> {
  const { root, build } = config
  
  // Find entry point
  const entryPoint = findEntryPoint(root)
  
  return {
    input: entryPoint,
    plugins: await createRollupPlugins(config),
    external: (id) => {
      // Mark node modules as external for SSR builds
      if (build.ssr && id.includes('node_modules')) {
        return true
      }
      return false
    },
    onwarn: (warning, warn) => {
      // Filter out certain warnings
      if (warning.code === 'UNRESOLVED_IMPORT') {
        return
      }
      warn(warning)
    },
    ...config.build.rollupOptions
  }
}

function createOutputOptions(config: ResolvedConfig): OutputOptions {
  const { build } = config
  
  return {
    dir: build.outDir,
    format: 'es',
    sourcemap: build.sourcemap,
    chunkFileNames: build.assetsDir ? `${build.assetsDir}/[name]-[hash].js` : '[name]-[hash].js',
    assetFileNames: build.assetsDir ? `${build.assetsDir}/[name]-[hash].[ext]` : '[name]-[hash].[ext]',
    manualChunks: (id) => {
      // Split vendor chunks
      if (id.includes('node_modules')) {
        return 'vendor'
      }
    },
    ...config.build.rollupOptions?.output
  }
}

function findEntryPoint(root: string): string {
  const possibleEntries = [
    'src/main.ts',
    'src/main.js',
    'src/index.ts',
    'src/index.js',
    'main.ts',
    'main.js',
    'index.ts',
    'index.js'
  ]

  for (const entry of possibleEntries) {
    const entryPath = resolve(root, entry)
    if (existsSync(entryPath)) {
      return entryPath
    }
  }

  // Check package.json for entry point
  const pkgPath = resolve(root, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      if (pkg.main) {
        const mainPath = resolve(root, pkg.main)
        if (existsSync(mainPath)) {
          return mainPath
        }
      }
    } catch {
      // Invalid package.json
    }
  }

  throw new Error('Could not find entry point. Please specify in build.rollupOptions.input')
}

async function runPostBuildSecurity(config: ResolvedConfig, output: any[]): Promise<void> {
  config.logger.info(colors.blue('🔍 Running post-build security validation...'))

  let violations = 0
  let warnings = 0

  // Analyze built files for security issues
  for (const chunk of output) {
    if (chunk.type === 'chunk') {
      const analysis = analyzeChunkSecurity(chunk.code, chunk.fileName)
      violations += analysis.violations
      warnings += analysis.warnings

      if (analysis.violations > 0) {
        config.logger.warn(
          colors.yellow(`⚠️  Security violations in ${chunk.fileName}: ${analysis.violations}`)
        )
      }
    }
  }

  logSecurityScan('Post-build Validation', {
    passed: output.length - violations,
    failed: violations,
    total: output.length
  })

  if (violations > 0 && config.security.analysis?.failOnViolations) {
    throw new Error(`Build contains ${violations} security violations`)
  }

  if (warnings > 0) {
    config.logger.warn(
      colors.yellow(`⚠️  Build completed with ${warnings} security warnings`)
    )
  } else {
    config.logger.info(colors.green('✅ Security validation passed'))
  }
}

function analyzeChunkSecurity(code: string, fileName: string): {
  violations: number
  warnings: number
  issues: string[]
} {
  const issues: string[] = []
  let violations = 0
  let warnings = 0

  // Security patterns to check
  const securityPatterns = [
    {
      pattern: /eval\s*\(/g,
      severity: 'violation',
      message: 'Use of eval() detected'
    },
    {
      pattern: /Function\s*\(/g,
      severity: 'violation', 
      message: 'Use of Function constructor detected'
    },
    {
      pattern: /innerHTML\s*=/g,
      severity: 'warning',
      message: 'Use of innerHTML detected'
    },
    {
      pattern: /document\.write\s*\(/g,
      severity: 'violation',
      message: 'Use of document.write detected'
    },
    {
      pattern: /setTimeout\s*\(\s*["'`]/g,
      severity: 'warning',
      message: 'String-based setTimeout detected'
    },
    {
      pattern: /setInterval\s*\(\s*["'`]/g,
      severity: 'warning',
      message: 'String-based setInterval detected'
    },
    {
      pattern: /javascript:/g,
      severity: 'violation',
      message: 'javascript: protocol detected'
    },
    {
      pattern: /data:.*base64/g,
      severity: 'warning',
      message: 'Base64 data URI detected'
    }
  ]

  for (const { pattern, severity, message } of securityPatterns) {
    const matches = code.match(pattern)
    if (matches) {
      issues.push(`${message} (${matches.length} occurrences)`)
      
      if (severity === 'violation') {
        violations += matches.length
      } else {
        warnings += matches.length
      }
    }
  }

  return { violations, warnings, issues }
}
