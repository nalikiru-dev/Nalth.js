import fs from 'node:fs'
import path from 'node:path'
import colors from 'picocolors'
import type { UserConfig } from './config'

export interface ProjectDetection {
  framework: 'react' | 'vue' | 'svelte' | 'solid' | 'preact' | 'vanilla' | 'unknown'
  hasTypeScript: boolean
  hasTailwind: boolean
  hasESLint: boolean
  hasPrettier: boolean
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'
  dependencies: Record<string, string>
}

export class SmartConfigGenerator {
  private root: string
  private detection: ProjectDetection | null = null

  constructor(root: string = process.cwd()) {
    this.root = root
  }

  /**
   * Detect project setup and dependencies
   */
  detectProject(): ProjectDetection {
    if (this.detection) return this.detection

    const pkgPath = path.join(this.root, 'package.json')
    let pkg: any = {}

    if (fs.existsSync(pkgPath)) {
      try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      } catch {}
    }

    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    }

    this.detection = {
      framework: this.detectFramework(allDeps),
      hasTypeScript: this.hasTypeScript(),
      hasTailwind: 'tailwindcss' in allDeps,
      hasESLint: 'eslint' in allDeps || fs.existsSync(path.join(this.root, '.eslintrc.js')),
      hasPrettier: 'prettier' in allDeps || fs.existsSync(path.join(this.root, '.prettierrc')),
      packageManager: this.detectPackageManager(),
      dependencies: allDeps,
    }

    return this.detection
  }

  /**
   * Generate smart configuration based on project detection
   */
  generateSmartConfig(): UserConfig {
    const detection = this.detectProject()
    const config: UserConfig = {
      // Smart defaults based on framework
      plugins: this.getRecommendedPlugins(detection),
      
      // Optimized build settings
      build: {
        target: detection.hasTypeScript ? 'esnext' : 'es2015',
        sourcemap: true,
        rollupOptions: {
          output: {
            manualChunks: this.getSmartChunking(detection),
          },
        },
      },

      // Development optimizations
      server: {
        port: 5173,
        strictPort: false,
        open: true,
        cors: true,
        // Smart HMR configuration
        hmr: {
          overlay: true,
        },
      },

      // Optimized dependency pre-bundling
      optimizeDeps: {
        include: this.getOptimizeDepsInclude(detection),
        exclude: ['@nalth/client'],
      },

      // CSS handling
      css: {
        devSourcemap: true,
        ...(detection.hasTailwind && {
          postcss: path.join(this.root, 'postcss.config.js'),
        }),
      },
    }

    return config
  }

  /**
   * Detect framework from dependencies
   */
  private detectFramework(deps: Record<string, string>): ProjectDetection['framework'] {
    if ('react' in deps || 'react-dom' in deps) return 'react'
    if ('vue' in deps) return 'vue'
    if ('svelte' in deps) return 'svelte'
    if ('solid-js' in deps) return 'solid'
    if ('preact' in deps) return 'preact'
    return 'vanilla'
  }

  /**
   * Check if project uses TypeScript
   */
  private hasTypeScript(): boolean {
    return (
      fs.existsSync(path.join(this.root, 'tsconfig.json')) ||
      fs.existsSync(path.join(this.root, 'tsconfig.app.json'))
    )
  }

  /**
   * Detect package manager
   */
  private detectPackageManager(): ProjectDetection['packageManager'] {
    if (fs.existsSync(path.join(this.root, 'bun.lockb'))) return 'bun'
    if (fs.existsSync(path.join(this.root, 'pnpm-lock.yaml'))) return 'pnpm'
    if (fs.existsSync(path.join(this.root, 'yarn.lock'))) return 'yarn'
    return 'npm'
  }

  /**
   * Get recommended plugins based on project
   */
  private getRecommendedPlugins(detection: ProjectDetection): any[] {
    const plugins: any[] = []

    // Framework-specific plugins would be added here
    // This is a placeholder for the actual plugin imports

    return plugins
  }

  /**
   * Smart code splitting strategy
   */
  private getSmartChunking(detection: ProjectDetection) {
    return (id: string) => {
      // Vendor chunks
      if (id.includes('node_modules')) {
        // Framework chunks
        if (id.includes('react') || id.includes('react-dom')) {
          return 'vendor-react'
        }
        if (id.includes('vue')) {
          return 'vendor-vue'
        }
        if (id.includes('@mui') || id.includes('@material-ui')) {
          return 'vendor-ui'
        }
        // Large libraries
        if (id.includes('lodash') || id.includes('moment') || id.includes('date-fns')) {
          return 'vendor-utils'
        }
        return 'vendor'
      }
    }
  }

  /**
   * Dependencies to pre-bundle
   */
  private getOptimizeDepsInclude(detection: ProjectDetection): string[] {
    const include: string[] = []

    // Framework-specific optimizations
    if (detection.framework === 'react') {
      include.push('react', 'react-dom')
    } else if (detection.framework === 'vue') {
      include.push('vue')
    }

    // Common libraries that benefit from pre-bundling
    const commonLibs = ['lodash-es', 'axios', 'date-fns']
    for (const lib of commonLibs) {
      if (lib in detection.dependencies) {
        include.push(lib)
      }
    }

    return include
  }

  /**
   * Print configuration suggestions
   */
  printSuggestions(): void {
    const detection = this.detectProject()
    
    console.log(colors.cyan('\n🔍 Project Detection:\n'))
    console.log(colors.white(`  Framework: ${colors.bold(detection.framework)}`))
    console.log(colors.white(`  TypeScript: ${detection.hasTypeScript ? colors.green('✓') : colors.red('✗')}`))
    console.log(colors.white(`  Tailwind: ${detection.hasTailwind ? colors.green('✓') : colors.red('✗')}`))
    console.log(colors.white(`  Package Manager: ${colors.bold(detection.packageManager)}`))

    console.log(colors.cyan('\n💡 Recommendations:\n'))

    if (!detection.hasTypeScript) {
      console.log(colors.yellow('  • Consider adding TypeScript for better type safety'))
      console.log(colors.dim('    Run: npx nalth add typescript\n'))
    }

    if (!detection.hasESLint) {
      console.log(colors.yellow('  • Add ESLint for code quality'))
      console.log(colors.dim('    Run: npx nalth lint:init\n'))
    }

    if (!detection.hasPrettier) {
      console.log(colors.yellow('  • Add Prettier for consistent formatting'))
      console.log(colors.dim('    Run: npx nalth fmt:init\n'))
    }

    if (detection.framework === 'unknown') {
      console.log(colors.yellow('  • No framework detected - using vanilla configuration'))
      console.log(colors.dim('    Consider using React, Vue, or Svelte for better DX\n'))
    }
  }
}

/**
 * Auto-configure Nalth based on project detection
 */
export async function autoConfigureNalth(root: string = process.cwd()): Promise<UserConfig> {
  const generator = new SmartConfigGenerator(root)
  const config = generator.generateSmartConfig()
  
  if (process.env.NALTH_VERBOSE) {
    generator.printSuggestions()
  }
  
  return config
}
