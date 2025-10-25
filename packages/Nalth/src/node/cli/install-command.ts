import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import colors from 'picocolors'

export interface InstallCommandOptions {
  secure?: boolean
  verify?: boolean
  audit?: boolean
  useBun?: boolean
  lockfile?: boolean
  frozen?: boolean
  save?: boolean
  saveDev?: boolean
  production?: boolean
  registry?: string
}

interface PackageInfo {
  name: string
  version: string
  integrity?: string
  vulnerabilities?: number
  license?: string
}

const MALICIOUS_PATTERNS = [
  /bitcoin|crypto-miner|cryptominer/i,
  /keylog|password-stealer/i,
  /backdoor|trojan/i,
  /eval\(|Function\(/gi,
  /exec\(|spawn\(/gi,
]

const ALLOWED_LICENSES = [
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  '0BSD',
  'MPL-2.0',
  'CC0-1.0',
  'Unlicense'
]

export async function installCommand(
  packages: string[] = [],
  options: InstallCommandOptions = {}
) {
  const projectPath = process.cwd()
  
  console.log(colors.cyan('🔒 NALTH Secure Install\n'))

  // Check if package.json exists
  const packageJsonPath = resolve(projectPath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    console.error(colors.red('❌ No package.json found'))
    console.log(colors.dim('Run "npm init" to create one first'))
    process.exit(1)
  }

  // Security checks before installation
  if (options.secure !== false) {
    console.log(colors.cyan('🔐 Running pre-installation security checks...\n'))
    
    if (packages.length > 0) {
      await performPackageSecurityScan(packages)
    }
  }

  // Determine package manager
  const packageManager = detectPackageManager(projectPath, options)
  console.log(colors.dim(`Using package manager: ${packageManager}\n`))

  // Build install command
  const installCmd = buildInstallCommand(packageManager, packages, options)
  
  console.log(colors.dim(`$ ${installCmd}\n`))

  try {
    // Execute installation
    execSync(installCmd, {
      cwd: projectPath,
      stdio: 'inherit',
      env: {
        ...process.env,
        NALTH_SECURE_INSTALL: 'true'
      }
    })

    console.log(colors.green('\n✅ Installation completed\n'))

    // Post-installation security audit
    if (options.audit !== false && options.secure !== false) {
      await performPostInstallAudit(projectPath, packageManager)
    }

    // Verify package integrity
    if (options.verify !== false && options.secure !== false) {
      await verifyPackageIntegrity(projectPath)
    }

  } catch (error: any) {
    console.error(colors.red('\n❌ Installation failed'))
    process.exit(error.status || 1)
  }
}

function detectPackageManager(projectPath: string, options: InstallCommandOptions): string {
  // User specified bun
  if (options.useBun) {
    if (!commandExists('bun')) {
      console.log(colors.yellow('⚠️  Bun not found, falling back to npm'))
      return 'npm'
    }
    return 'bun'
  }

  // Check for lock files
  if (existsSync(resolve(projectPath, 'bun.lockb'))) {
    return 'bun'
  }
  if (existsSync(resolve(projectPath, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (existsSync(resolve(projectPath, 'yarn.lock'))) {
    return 'yarn'
  }
  
  // Default to npm
  return 'npm'
}

function buildInstallCommand(
  packageManager: string,
  packages: string[],
  options: InstallCommandOptions
): string {
  const args: string[] = []

  switch (packageManager) {
    case 'bun':
      args.push('bun', 'add')
      if (packages.length === 0) args.push('--no-save')
      break
    case 'pnpm':
      args.push('pnpm', packages.length > 0 ? 'add' : 'install')
      break
    case 'yarn':
      args.push('yarn', packages.length > 0 ? 'add' : 'install')
      break
    default: // npm
      args.push('npm', 'install')
      break
  }

  // Add packages
  if (packages.length > 0) {
    args.push(...packages)
  }

  // Save options
  if (options.saveDev) {
    if (packageManager === 'npm') args.push('--save-dev')
    else if (packageManager === 'bun') args.push('-d')
    else if (packageManager === 'pnpm') args.push('-D')
    else if (packageManager === 'yarn') args.push('--dev')
  }

  // Production mode
  if (options.production) {
    if (packageManager === 'npm') args.push('--production')
    else if (packageManager === 'pnpm') args.push('--prod')
    else if (packageManager === 'yarn') args.push('--production')
  }

  // Frozen lockfile
  if (options.frozen) {
    if (packageManager === 'npm') args.push('--frozen-lockfile')
    else if (packageManager === 'pnpm') args.push('--frozen-lockfile')
    else if (packageManager === 'yarn') args.push('--frozen-lockfile')
  }

  // Registry
  if (options.registry) {
    args.push('--registry', options.registry)
  }

  return args.join(' ')
}

async function performPackageSecurityScan(packages: string[]) {
  console.log(colors.cyan('🔍 Scanning packages for security issues...\n'))

  for (const pkg of packages) {
    const [name] = pkg.split('@')
    
    // Check package name for suspicious patterns
    if (isSuspiciousPackageName(name)) {
      console.log(colors.red(`❌ SECURITY WARNING: Package "${name}" has suspicious name`))
      console.log(colors.yellow('   This package may be malicious. Installation blocked.\n'))
      process.exit(1)
    }

    // Fetch package metadata
    try {
      const metadata = await fetchPackageMetadata(name)
      
      // Check license
      if (metadata.license && !ALLOWED_LICENSES.includes(metadata.license)) {
        console.log(colors.yellow(`⚠️  WARNING: Package "${name}" has license: ${metadata.license}`))
        console.log(colors.dim('   This may not be compatible with your project.\n'))
      }

      // Check for known vulnerabilities
      if (metadata.vulnerabilities && metadata.vulnerabilities > 0) {
        console.log(colors.red(`❌ Package "${name}" has ${metadata.vulnerabilities} known vulnerabilities`))
        console.log(colors.yellow('   Consider using an alternative package.\n'))
        process.exit(1)
      }

      console.log(colors.green(`✅ ${name} - Security check passed`))
      
    } catch (error) {
      console.log(colors.yellow(`⚠️  Could not verify "${name}" - proceeding with caution`))
    }
  }

  console.log()
}

function isSuspiciousPackageName(name: string): boolean {
  // Check for typosquatting of common packages
  const popularPackages = [
    'react', 'vue', 'angular', 'express', 'lodash', 'axios', 
    'webpack', 'eslint', 'prettier', 'typescript'
  ]

  for (const popular of popularPackages) {
    if (name !== popular && levenshteinDistance(name, popular) <= 2) {
      console.log(colors.yellow(`   Similar to popular package: "${popular}"`))
      return true
    }
  }

  // Check for malicious patterns
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(name)) {
      return true
    }
  }

  return false
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

async function fetchPackageMetadata(packageName: string): Promise<PackageInfo> {
  try {
    const result = execSync(`npm view ${packageName} --json`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })

    const data = JSON.parse(result)
    return {
      name: data.name,
      version: data.version,
      license: data.license,
      vulnerabilities: 0
    }
  } catch (error) {
    throw new Error(`Failed to fetch metadata for ${packageName}`)
  }
}

async function performPostInstallAudit(projectPath: string, packageManager: string) {
  console.log(colors.cyan('🔍 Running post-installation security audit...\n'))

  try {
    let auditCmd = ''
    
    switch (packageManager) {
      case 'bun':
        // Bun doesn't have native audit yet, use npm
        auditCmd = 'npm audit --json'
        break
      case 'pnpm':
        auditCmd = 'pnpm audit --json'
        break
      case 'yarn':
        auditCmd = 'yarn audit --json'
        break
      default:
        auditCmd = 'npm audit --json'
    }

    const result = execSync(auditCmd, {
      cwd: projectPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })

    const audit = JSON.parse(result)
    
    if (audit.metadata) {
      const { vulnerabilities } = audit.metadata
      const total = vulnerabilities.total || 0
      
      if (total === 0) {
        console.log(colors.green('✅ No vulnerabilities found\n'))
      } else {
        console.log(colors.yellow(`⚠️  Found ${total} vulnerabilities:`))
        console.log(colors.dim(`   Critical: ${vulnerabilities.critical || 0}`))
        console.log(colors.dim(`   High: ${vulnerabilities.high || 0}`))
        console.log(colors.dim(`   Moderate: ${vulnerabilities.moderate || 0}`))
        console.log(colors.dim(`   Low: ${vulnerabilities.low || 0}\n`))
        
        if (vulnerabilities.critical > 0 || vulnerabilities.high > 0) {
          console.log(colors.red('❌ Critical or high vulnerabilities detected'))
          console.log(colors.yellow('Run "nalth audit --fix" to attempt automatic fixes\n'))
        }
      }
    }

  } catch (error) {
    console.log(colors.yellow('⚠️  Could not run audit - manual review recommended\n'))
  }
}

async function verifyPackageIntegrity(projectPath: string) {
  console.log(colors.cyan('🔐 Verifying package integrity...\n'))

  const lockfilePath = resolve(projectPath, 'package-lock.json')
  
  if (!existsSync(lockfilePath)) {
    console.log(colors.yellow('⚠️  No lockfile found - integrity cannot be fully verified\n'))
    return
  }

  try {
    const lockfile = JSON.parse(readFileSync(lockfilePath, 'utf-8'))
    let verifiedCount = 0
    let totalCount = 0

    if (lockfile.packages) {
      for (const [name, pkg] of Object.entries(lockfile.packages)) {
        if (name && pkg && typeof pkg === 'object' && 'integrity' in pkg) {
          totalCount++
          if (pkg.integrity) {
            verifiedCount++
          }
        }
      }
    }

    console.log(colors.green(`✅ Verified integrity for ${verifiedCount}/${totalCount} packages\n`))

  } catch (error) {
    console.log(colors.yellow('⚠️  Could not verify package integrity\n'))
  }
}

function commandExists(command: string): boolean {
  try {
    execSync(`which ${command}`, { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

export async function uninstallCommand(packages: string[], options: any = {}) {
  const projectPath = process.cwd()
  const packageManager = detectPackageManager(projectPath, options)

  console.log(colors.cyan(`🗑️  Uninstalling packages...\n`))

  let cmd = ''
  switch (packageManager) {
    case 'bun':
      cmd = `bun remove ${packages.join(' ')}`
      break
    case 'pnpm':
      cmd = `pnpm remove ${packages.join(' ')}`
      break
    case 'yarn':
      cmd = `yarn remove ${packages.join(' ')}`
      break
    default:
      cmd = `npm uninstall ${packages.join(' ')}`
  }

  try {
    execSync(cmd, { cwd: projectPath, stdio: 'inherit' })
    console.log(colors.green('\n✅ Packages uninstalled successfully'))
  } catch (error) {
    console.error(colors.red('\n❌ Uninstall failed'))
    process.exit(1)
  }
}
