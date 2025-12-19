import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import colors from 'picocolors'
import { createSpinner } from './cli-helpers'

interface PackageMetadata {
  name: string
  version: string
  description?: string
  author?: string | { name: string; email?: string }
  maintainers?: Array<{ name: string; email?: string }>
  repository?: { type: string; url: string }
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  license?: string
  downloads?: number
  publishedDate?: string
}

interface SecurityThreat {
  level: 'critical' | 'high' | 'medium' | 'low'
  type: string
  description: string
  evidence?: string
}

interface PackageAnalysis {
  package: string
  version: string
  safe: boolean
  threats: SecurityThreat[]
  score: number
  metadata?: PackageMetadata
  recommendations?: string[]
}

export class SecurePackageInstaller {
  private root: string
  private packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'
  private cache = new Map<string, PackageAnalysis>()
  private maliciousPatterns: RegExp[]
  private suspiciousScripts: string[]
  private typosquattingDatabase: Map<string, string[]>

  constructor(root: string = process.cwd(), packageManager?: 'npm' | 'yarn' | 'pnpm' | 'bun') {
    this.root = root
    this.packageManager = packageManager || this.detectPackageManager()
    this.maliciousPatterns = this.initializeMaliciousPatterns()
    this.suspiciousScripts = this.initializeSuspiciousScripts()
    this.typosquattingDatabase = this.initializeTyposquattingDB()
  }

  /**
   * Securely install packages with deep analysis
   */
  async install(packages: string[], options: {
    dev?: boolean
    exact?: boolean
    force?: boolean
    skipAnalysis?: boolean
  } = {}): Promise<void> {
    console.log(colors.cyan('\n Nalth.JS Secure Install\n'))

    // Skip analysis if no packages specified (installing from package.json)
    if (packages.length === 0) {
      console.log(colors.dim('Installing dependencies from package.json...\n'))
      await this.performInstall(packages, options)
      return
    }

    // Analyze each package before installation
    const analyses: PackageAnalysis[] = []
    
    for (const pkg of packages) {
      const spinner = createSpinner()
      spinner.start(`Analyzing ${colors.bold(pkg)}...`)

      try {
        const analysis = await this.analyzePackage(pkg, options.skipAnalysis)
        analyses.push(analysis)

        if (analysis.safe) {
          spinner.succeed(`${colors.bold(pkg)} - ${colors.green('SAFE')} (Score: ${analysis.score}/100)`)
        } else {
          spinner.fail(`${colors.bold(pkg)} - ${colors.red('THREATS DETECTED')}`)
        }
      } catch (error) {
        spinner.fail(`Failed to analyze ${pkg}: ${(error as Error).message}`)
        throw error
      }
    }

    // Display security report
    this.displaySecurityReport(analyses)

    // Check for critical threats
    const criticalThreats = analyses.filter(a => 
      a.threats.some(t => t.level === 'critical')
    )

    if (criticalThreats.length > 0 && !options.force) {
      console.log(colors.red('\n❌ Installation blocked due to critical security threats!\n'))
      console.log(colors.yellow('Packages with critical threats:'))
      criticalThreats.forEach(a => {
        console.log(colors.red(`  • ${a.package}`))
        a.threats.filter(t => t.level === 'critical').forEach(t => {
          console.log(colors.dim(`    - ${t.description}`))
        })
      })
      console.log(colors.dim('\nUse --force to install anyway (not recommended)\n'))
      process.exit(1)
    }

    // Check for high-risk packages
    const highRiskPackages = analyses.filter(a => 
      a.threats.some(t => t.level === 'high') || a.score < 50
    )

    if (highRiskPackages.length > 0 && !options.force) {
      console.log(colors.yellow('\n⚠️  High-risk packages detected:\n'))
      highRiskPackages.forEach(a => {
        console.log(colors.yellow(`  • ${a.package} (Score: ${a.score}/100)`))
      })
      
      // Ask for confirmation
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const answer = await new Promise<string>((resolve) => {
        readline.question(colors.cyan('\nContinue with installation? [y/N]: '), resolve)
      })
      readline.close()

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log(colors.yellow('\n⚠️  Installation cancelled\n'))
        process.exit(0)
      }
    }

    // Proceed with installation
    await this.performInstall(packages, options)

    // Post-install security check
    await this.postInstallCheck(packages)

    console.log(colors.green('\n✅ Secure installation completed!\n'))
  }

  /**
   * Deep package analysis
   */
  private async analyzePackage(packageSpec: string, skipAnalysis = false): Promise<PackageAnalysis> {
    const [name, version] = this.parsePackageSpec(packageSpec)
    const cacheKey = `${name}@${version || 'latest'}`

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const analysis: PackageAnalysis = {
      package: name,
      version: version || 'latest',
      safe: true,
      threats: [],
      score: 100,
      recommendations: [],
    }

    if (skipAnalysis) {
      this.cache.set(cacheKey, analysis)
      return analysis
    }

    // 1. Check typosquatting
    const typosquatThreat = this.checkTyposquatting(name)
    if (typosquatThreat) {
      analysis.threats.push(typosquatThreat)
      analysis.score -= 50
    }

    // 2. Fetch package metadata
    try {
      const metadata = await this.fetchPackageMetadata(name, version)
      analysis.metadata = metadata

      // 3. Analyze package metadata
      const metadataThreats = this.analyzeMetadata(metadata)
      analysis.threats.push(...metadataThreats)

      // 4. Check for suspicious scripts
      const scriptThreats = this.analyzeScripts(metadata.scripts || {})
      analysis.threats.push(...scriptThreats)

      // 5. Check dependencies for known vulnerabilities
      const depThreats = await this.analyzeDependencies(metadata)
      analysis.threats.push(...depThreats)

      // 6. Check package reputation
      const reputationScore = this.calculateReputationScore(metadata)
      analysis.score = Math.min(analysis.score, reputationScore)

      // 7. Check for malicious patterns in package name
      const nameThreats = this.analyzePackageName(name)
      analysis.threats.push(...nameThreats)

    } catch (error) {
      analysis.threats.push({
        level: 'medium',
        type: 'metadata_fetch_failed',
        description: 'Could not fetch package metadata for security analysis',
        evidence: (error as Error).message,
      })
      analysis.score -= 20
    }

    // Calculate final safety
    analysis.safe = analysis.score >= 60 && 
                    !analysis.threats.some(t => t.level === 'critical')

    // Add recommendations
    if (analysis.score < 80) {
      analysis.recommendations = this.generateRecommendations(analysis)
    }

    this.cache.set(cacheKey, analysis)
    return analysis
  }

  /**
   * Check for typosquatting attempts
   */
  private checkTyposquatting(packageName: string): SecurityThreat | null {
    // Check against known popular packages
    for (const [popular, variants] of this.typosquattingDatabase) {
      if (variants.includes(packageName.toLowerCase())) {
        return {
          level: 'critical',
          type: 'typosquatting',
          description: `Possible typosquatting attempt! Did you mean "${popular}"?`,
          evidence: `Package name "${packageName}" is similar to popular package "${popular}"`,
        }
      }
    }

    // Check for common typosquatting patterns
    const suspiciousPatterns = [
      /^node-/,  // node-* packages that mimic core modules
      /^npm-/,   // npm-* packages
      /-js$/,    // *-js packages
      /^@types\//,  // fake @types packages
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(packageName)) {
        // Additional validation needed
        return {
          level: 'medium',
          type: 'suspicious_naming',
          description: 'Package name follows suspicious pattern',
          evidence: `Matches pattern: ${pattern}`,
        }
      }
    }

    return null
  }

  /**
   * Analyze package metadata for threats
   */
  private analyzeMetadata(metadata: PackageMetadata): SecurityThreat[] {
    const threats: SecurityThreat[] = []

    // Check for missing critical fields
    if (!metadata.author && !metadata.maintainers?.length) {
      threats.push({
        level: 'medium',
        type: 'no_author',
        description: 'Package has no identifiable author or maintainers',
      })
    }

    // Check for missing license
    if (!metadata.license) {
      threats.push({
        level: 'low',
        type: 'no_license',
        description: 'Package has no license specified',
      })
    }

    // Check for suspicious repository
    if (metadata.repository) {
      const repoUrl = typeof metadata.repository === 'string' 
        ? metadata.repository 
        : metadata.repository.url

      if (!repoUrl.includes('github.com') && 
          !repoUrl.includes('gitlab.com') && 
          !repoUrl.includes('bitbucket.org')) {
        threats.push({
          level: 'medium',
          type: 'suspicious_repository',
          description: 'Package repository is not on a known platform',
          evidence: repoUrl,
        })
      }
    }

    // Check for very new packages (less than 30 days old)
    if (metadata.publishedDate) {
      const publishDate = new Date(metadata.publishedDate)
      const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSincePublish < 30) {
        threats.push({
          level: 'low',
          type: 'new_package',
          description: `Package is very new (${Math.floor(daysSincePublish)} days old)`,
        })
      }
    }

    return threats
  }

  /**
   * Analyze package scripts for malicious code
   */
  private analyzeScripts(scripts: Record<string, string>): SecurityThreat[] {
    const threats: SecurityThreat[] = []

    for (const [scriptName, scriptContent] of Object.entries(scripts)) {
      // Check for suspicious patterns
      for (const pattern of this.maliciousPatterns) {
        if (pattern.test(scriptContent)) {
          threats.push({
            level: 'high',
            type: 'malicious_script',
            description: `Suspicious code detected in "${scriptName}" script`,
            evidence: scriptContent,
          })
        }
      }

      // Check for suspicious script names
      if (this.suspiciousScripts.includes(scriptName)) {
        if (scriptName === 'preinstall' || scriptName === 'postinstall') {
          // These are high-risk as they run automatically
          threats.push({
            level: 'high',
            type: 'auto_run_script',
            description: `Package has ${scriptName} script that runs automatically`,
            evidence: scriptContent,
          })
        }
      }

      // Check for network requests in install scripts
      if ((scriptName.includes('install') || scriptName.includes('prepare')) &&
          (scriptContent.includes('curl') || scriptContent.includes('wget') || 
           scriptContent.includes('http://') || scriptContent.includes('https://'))) {
        threats.push({
          level: 'critical',
          type: 'network_in_install',
          description: 'Install script makes network requests',
          evidence: scriptContent,
        })
      }
    }

    return threats
  }

  /**
   * Analyze dependencies for known vulnerabilities
   */
  private async analyzeDependencies(metadata: PackageMetadata): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = []
    const allDeps = {
      ...metadata.dependencies,
      ...metadata.devDependencies,
    }

    // Check for excessive dependencies
    const depCount = Object.keys(allDeps).length
    if (depCount > 50) {
      threats.push({
        level: 'low',
        type: 'excessive_dependencies',
        description: `Package has ${depCount} dependencies (potential supply chain risk)`,
      })
    }

    // Check for deprecated or known vulnerable packages
    const knownVulnerable = [
      'event-stream',
      'flatmap-stream',
      'eslint-scope',
      'getcookies',
    ]

    for (const dep of Object.keys(allDeps)) {
      if (knownVulnerable.includes(dep)) {
        threats.push({
          level: 'critical',
          type: 'known_vulnerable_dependency',
          description: `Depends on known vulnerable package: ${dep}`,
        })
      }
    }

    return threats
  }

  /**
   * Calculate package reputation score
   */
  private calculateReputationScore(metadata: PackageMetadata): number {
    let score = 100

    // Downloads (if available)
    if (metadata.downloads !== undefined) {
      if (metadata.downloads < 100) score -= 30
      else if (metadata.downloads < 1000) score -= 15
      else if (metadata.downloads < 10000) score -= 5
    }

    // Age
    if (metadata.publishedDate) {
      const age = (Date.now() - new Date(metadata.publishedDate).getTime()) / (1000 * 60 * 60 * 24)
      if (age < 7) score -= 20
      else if (age < 30) score -= 10
    }

    // Author/Maintainers
    if (!metadata.author && !metadata.maintainers?.length) {
      score -= 15
    }

    // Repository
    if (!metadata.repository) {
      score -= 10
    }

    // License
    if (!metadata.license) {
      score -= 5
    }

    return Math.max(0, score)
  }

  /**
   * Analyze package name for suspicious patterns
   */
  private analyzePackageName(name: string): SecurityThreat[] {
    const threats: SecurityThreat[] = []

    // Check for obfuscated names
    if (/[0O1Il]{3,}/.test(name)) {
      threats.push({
        level: 'high',
        type: 'obfuscated_name',
        description: 'Package name contains confusing characters (0O1Il)',
      })
    }

    // Check for hidden Unicode characters
    if (/[\u200B-\u200D\uFEFF]/.test(name)) {
      threats.push({
        level: 'critical',
        type: 'hidden_unicode',
        description: 'Package name contains hidden Unicode characters',
      })
    }

    // Check for very long names (potential obfuscation)
    if (name.length > 50) {
      threats.push({
        level: 'medium',
        type: 'long_name',
        description: 'Package name is unusually long',
      })
    }

    return threats
  }

  /**
   * Fetch package metadata from registry
   */
  private async fetchPackageMetadata(name: string, version?: string): Promise<PackageMetadata> {
    const registry = 'https://registry.npmjs.org'
    const url = version ? `${registry}/${name}/${version}` : `${registry}/${name}/latest`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch package metadata: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      name: data.name,
      version: data.version,
      description: data.description,
      author: data.author,
      maintainers: data.maintainers,
      repository: data.repository,
      scripts: data.scripts,
      dependencies: data.dependencies,
      devDependencies: data.devDependencies,
      license: data.license,
    }
  }

  /**
   * Perform actual package installation
   */
  private async performInstall(packages: string[], options: any): Promise<void> {
    const spinner = createSpinner()
    
    let args = this.buildInstallCommand(packages, options)

    return new Promise((resolve, reject) => {
      const attemptInstall = (retryWithForce = false) => {
        // Add --legacy-peer-deps for npm by default, or --force on retry
        if (this.packageManager === 'npm') {
          if (retryWithForce) {
            if (!args.includes('--force')) {
              args.push('--force')
            }
          } else if (!args.includes('--legacy-peer-deps') && !args.includes('--force')) {
            args.push('--legacy-peer-deps')
          }
        }

        // Show command being run
        const cmdDisplay = `${this.packageManager} ${args.join(' ')}`
        spinner.start(`Running: ${colors.dim(cmdDisplay)}`)
        
        if (process.env.NALTH_VERBOSE) {
          console.log(colors.dim(`\nCommand: ${cmdDisplay}\n`))
        }

        const child = spawn(this.packageManager, args, {
          cwd: this.root,
          stdio: 'pipe',
        })

        let output = ''
        let errorOutput = ''

        child.stdout?.on('data', (data) => {
          output += data.toString()
        })

        child.stderr?.on('data', (data) => {
          errorOutput += data.toString()
        })

        child.on('close', (code) => {
          if (code === 0) {
            spinner.succeed('Packages installed successfully')
            resolve()
          } else {
            // Check if it's a peer dependency issue and we haven't tried --force yet
            const isPeerDepIssue = errorOutput.includes('ERESOLVE') || 
                                   errorOutput.includes('peer dep') ||
                                   errorOutput.includes('unable to resolve dependency tree')
            
            if (isPeerDepIssue && !retryWithForce && this.packageManager === 'npm') {
              spinner.warn('Peer dependency conflict detected, retrying with --force...')
              attemptInstall(true)
            } else {
              spinner.fail('Installation failed')
              if (errorOutput) console.error(errorOutput)
              if (output) console.log(output)
              reject(new Error(`Installation failed with code ${code}`))
            }
          }
        })

        child.on('error', (error) => {
          spinner.fail('Installation failed')
          reject(error)
        })
      }

      attemptInstall(false)
    })
  }

  /**
   * Post-install security check
   */
  private async postInstallCheck(packages: string[]): Promise<void> {
    const spinner = createSpinner()
    spinner.start('Running post-install security check...')

    try {
      // Check for suspicious files in node_modules
      for (const pkg of packages) {
        const [name] = this.parsePackageSpec(pkg)
        const pkgPath = path.join(this.root, 'node_modules', name)

        if (fs.existsSync(pkgPath)) {
          await this.scanPackageFiles(pkgPath)
        }
      }

      spinner.succeed('Post-install security check passed')
    } catch (error) {
      spinner.warn('Post-install security check found issues')
      console.warn(colors.yellow((error as Error).message))
    }
  }

  /**
   * Scan package files for malicious content
   */
  private async scanPackageFiles(pkgPath: string): Promise<void> {
    const suspiciousFiles = [
      '.env',
      'credentials',
      'password',
      'token',
      'secret',
    ]

    const files = this.getAllFiles(pkgPath)

    for (const file of files) {
      const basename = path.basename(file).toLowerCase()

      // Check for suspicious filenames
      if (suspiciousFiles.some(s => basename.includes(s))) {
        throw new Error(`Suspicious file found: ${file}`)
      }

      // Check for executable scripts
      if (file.endsWith('.sh') || file.endsWith('.bat') || file.endsWith('.exe')) {
        console.warn(colors.yellow(`⚠️  Executable file found: ${file}`))
      }
    }
  }

  /**
   * Get all files recursively
   */
  private getAllFiles(dir: string, files: string[] = []): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') {
          this.getAllFiles(fullPath, files)
        }
      } else {
        files.push(fullPath)
      }
    }

    return files
  }

  /**
   * Display security report
   */
  private displaySecurityReport(analyses: PackageAnalysis[]): void {
    console.log(colors.cyan('\n📊 Security Analysis Report\n'))

    const safe = analyses.filter(a => a.safe).length
    const unsafe = analyses.length - safe

    console.log(colors.white(`  Total packages: ${analyses.length}`))
    console.log(colors.green(`  Safe: ${safe}`))
    if (unsafe > 0) {
      console.log(colors.red(`  Unsafe: ${unsafe}`))
    }

    // Show threats
    const allThreats = analyses.flatMap(a => 
      a.threats.map(t => ({ package: a.package, ...t }))
    )

    if (allThreats.length > 0) {
      console.log(colors.yellow('\n⚠️  Threats detected:\n'))

      const critical = allThreats.filter(t => t.level === 'critical')
      const high = allThreats.filter(t => t.level === 'high')
      const medium = allThreats.filter(t => t.level === 'medium')
      const low = allThreats.filter(t => t.level === 'low')

      if (critical.length > 0) {
        console.log(colors.red(`  Critical: ${critical.length}`))
        critical.forEach(t => {
          console.log(colors.red(`    • ${t.package}: ${t.description}`))
        })
      }

      if (high.length > 0) {
        console.log(colors.red(`  High: ${high.length}`))
        high.forEach(t => {
          console.log(colors.red(`    • ${t.package}: ${t.description}`))
        })
      }

      if (medium.length > 0) {
        console.log(colors.yellow(`  Medium: ${medium.length}`))
      }

      if (low.length > 0) {
        console.log(colors.dim(`  Low: ${low.length}`))
      }
    }

    console.log()
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(analysis: PackageAnalysis): string[] {
    const recommendations: string[] = []

    if (analysis.score < 50) {
      recommendations.push('Consider using a more established alternative')
    }

    if (analysis.threats.some(t => t.type === 'typosquatting')) {
      recommendations.push('Verify the package name is correct')
    }

    if (analysis.threats.some(t => t.type === 'malicious_script')) {
      recommendations.push('Review package scripts before installation')
    }

    if (analysis.threats.some(t => t.type === 'no_author')) {
      recommendations.push('Research the package maintainers')
    }

    return recommendations
  }

  /**
   * Initialize malicious patterns
   */
  private initializeMaliciousPatterns(): RegExp[] {
    return [
      /eval\s*\(/,
      /Function\s*\(/,
      /child_process/,
      /exec\s*\(/,
      /spawn\s*\(/,
      /\.env/,
      /process\.env/,
      /btoa|atob/,
      /Buffer\.from.*base64/,
      /require\(['"]https?:/,
      /import\(['"]https?:/,
      /XMLHttpRequest/,
      /fetch\(['"]https?:\/\/(?!registry\.npmjs\.org)/,
    ]
  }

  /**
   * Initialize suspicious scripts
   */
  private initializeSuspiciousScripts(): string[] {
    return [
      'preinstall',
      'postinstall',
      'preuninstall',
      'postuninstall',
    ]
  }

  /**
   * Initialize typosquatting database
   */
  private initializeTyposquattingDB(): Map<string, string[]> {
    const db = new Map<string, string[]>()

    // Popular packages and their common typos
    db.set('react', ['raect', 'recat', 'reactt', 'react-js', 'reactjs'])
    db.set('vue', ['veu', 'vuee', 'vue-js', 'vuejs'])
    db.set('angular', ['angualr', 'anglar', 'angular-js'])
    db.set('lodash', ['loadsh', 'lodahs', 'lodash-es'])
    db.set('express', ['expres', 'expresss', 'express-js'])
    db.set('axios', ['axois', 'axioss', 'axios-http'])
    db.set('webpack', ['webpak', 'webpackk', 'webpack-cli'])
    db.set('typescript', ['typscript', 'typescript-js'])
    db.set('eslint', ['esslint', 'es-lint'])
    db.set('prettier', ['pretier', 'prettier-js'])

    return db
  }

  /**
   * Parse package specification
   */
  private parsePackageSpec(spec: string): [string, string | undefined] {
    const parts = spec.split('@')
    if (spec.startsWith('@')) {
      // Scoped package
      return [`@${parts[1]}`, parts[2]]
    }
    return [parts[0], parts[1]]
  }

  /**
   * Build install command
   */
  private buildInstallCommand(packages: string[], options: any): string[] {
    const args: string[] = []

    switch (this.packageManager) {
      case 'npm':
        args.push('install')
        if (packages.length > 0) {
          if (options.dev) args.push('--save-dev')
          if (options.exact) args.push('--save-exact')
        }
        break
      case 'yarn':
        if (packages.length > 0) {
          args.push('add')
          if (options.dev) args.push('--dev')
          if (options.exact) args.push('--exact')
        } else {
          args.push('install')
        }
        break
      case 'pnpm':
        if (packages.length > 0) {
          args.push('add')
          if (options.dev) args.push('--save-dev')
          if (options.exact) args.push('--save-exact')
        } else {
          args.push('install')
        }
        break
      case 'bun':
        if (packages.length > 0) {
          args.push('add')
          if (options.dev) args.push('--dev')
          if (options.exact) args.push('--exact')
        } else {
          args.push('install')
        }
        break
    }

    if (packages.length > 0) {
      args.push(...packages)
    }
    
    return args
  }

  /**
   * Detect package manager
   */
  private detectPackageManager(): 'npm' | 'yarn' | 'pnpm' | 'bun' {
    if (fs.existsSync(path.join(this.root, 'bun.lockb'))) return 'bun'
    if (fs.existsSync(path.join(this.root, 'pnpm-lock.yaml'))) return 'pnpm'
    if (fs.existsSync(path.join(this.root, 'yarn.lock'))) return 'yarn'
    return 'npm'
  }
}

/**
 * Create secure installer instance
 */
export function createSecureInstaller(root?: string, packageManager?: 'npm' | 'yarn' | 'pnpm' | 'bun'): SecurePackageInstaller {
  return new SecurePackageInstaller(root, packageManager)
}
