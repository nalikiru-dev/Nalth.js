import { resolve } from 'path'
import { existsSync } from 'fs'
import colors from 'picocolors'
import { createSecureInstaller } from '../secure-install'

export interface InstallCommandOptions {
  // Security options
  secure?: boolean
  verify?: boolean
  audit?: boolean
  force?: boolean
  skipAnalysis?: boolean
  securityLevel?: 'strict' | 'normal' | 'permissive'
  allowScripts?: boolean
  ignoreScripts?: boolean
  
  // Package manager options
  pm?: 'npm' | 'yarn' | 'pnpm' | 'bun'
  useNpm?: boolean
  useYarn?: boolean
  usePnpm?: boolean
  useBun?: boolean
  
  // Save options
  saveDev?: boolean
  saveProd?: boolean
  saveExact?: boolean
  save?: boolean
  
  // Install modes
  production?: boolean
  frozenLockfile?: boolean
  preferOffline?: boolean
  offline?: boolean
  
  // Registry
  registry?: string
  scope?: string
  
  // Output
  verbose?: boolean
  quiet?: boolean
  json?: boolean
}


export async function installCommand(
  packages: string[] = [],
  options: InstallCommandOptions = {}
) {
  const projectPath = process.cwd()

  // Set output level
  if (options.verbose) {
    process.env.NALTH_VERBOSE = 'true'
  }

  // Show help if no packages and no package.json
  const packageJsonPath = resolve(projectPath, 'package.json')
  if (packages.length === 0 && !existsSync(packageJsonPath)) {
    console.error(colors.red('❌ No package.json found'))
    console.log(colors.dim('Run "npm init" to create one first'))
    console.log()
    console.log(colors.cyan('Usage:'))
    console.log(colors.white('  nalth install [packages...]'))
    console.log()
    console.log(colors.cyan('Examples:'))
    console.log(colors.white('  nalth install react react-dom'))
    console.log(colors.white('  nalth install lodash -D'))
    console.log(colors.white('  nalth install --pm pnpm'))
    console.log(colors.white('  nalth install --use-bun'))
    console.log()
    console.log(colors.cyan('Options:'))
    console.log(colors.white('  --pm <manager>        Use specific package manager (npm|yarn|pnpm|bun)'))
    console.log(colors.white('  --use-npm             Use npm'))
    console.log(colors.white('  --use-yarn            Use Yarn'))
    console.log(colors.white('  --use-pnpm            Use pnpm'))
    console.log(colors.white('  --use-bun             Use Bun'))
    console.log(colors.white('  -D, --save-dev        Save as dev dependency'))
    console.log(colors.white('  --force               Force install (bypass security)'))
    console.log(colors.white('  --no-secure           Disable security checks'))
    console.log(colors.white('  --verbose             Verbose output'))
    console.log()
    process.exit(1)
  }

  // Determine package manager
  let packageManager = options.pm
  if (options.useNpm) packageManager = 'npm'
  else if (options.useYarn) packageManager = 'yarn'
  else if (options.usePnpm) packageManager = 'pnpm'
  else if (options.useBun) packageManager = 'bun'

  if (!options.quiet) {
    if (packageManager) {
      console.log(colors.dim(`Using package manager: ${packageManager}\n`))
    }
  }

  // Use the advanced secure installer with specified package manager
  const installer = createSecureInstaller(projectPath, packageManager)

  try {
    await installer.install(packages, {
      dev: options.saveDev,
      exact: options.saveExact,
      force: options.force,
      skipAnalysis: options.secure === false || options.skipAnalysis,
    })

    if (!options.quiet) {
      console.log(colors.green('\n✅ Installation completed successfully!\n'))
      
      if (packages.length > 0) {
        console.log(colors.cyan('Installed packages:'))
        packages.forEach(pkg => {
          console.log(colors.white(`  • ${pkg}`))
        })
        console.log()
      }
    }

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        packages,
        packageManager: packageManager || 'auto-detected',
      }, null, 2))
    }

  } catch (error: any) {
    if (!options.quiet) {
      console.error(colors.red('\n❌ Installation failed'))
      console.error(colors.dim(error.message))
    }
    
    if (options.json) {
      console.log(JSON.stringify({
        success: false,
        error: error.message,
        packages,
      }, null, 2))
    }
    
    process.exit(1)
  }
}


export async function uninstallCommand(packages: string[], _options: any = {}) {
  console.log(colors.cyan(`🗑️  Uninstalling packages...\n`))
  console.log(colors.yellow('Uninstall command will be implemented with secure verification'))
  console.log(colors.dim(`Packages to remove: ${packages.join(', ')}`))
}
