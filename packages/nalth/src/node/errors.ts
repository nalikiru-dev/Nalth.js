import colors from 'picocolors'
import type { RollupError } from 'rollup'

export interface NalthError extends Error {
  code?: string
  plugin?: string
  id?: string
  frame?: string
  loc?: {
    file?: string
    line: number
    column: number
  }
}

export class EnhancedErrorHandler {
  private errorCount = 0
  private warningCount = 0
  private errorCache = new Map<string, number>()

  formatError(error: Error | RollupError | NalthError): string {
    const err = error as NalthError
    let output = '\n'

    // Header with icon
    output += colors.red(colors.bold('❌ Build Error\n\n'))

    // Error message
    if (err.message) {
      output += colors.red(err.message) + '\n\n'
    }

    // File location
    if (err.loc?.file) {
      output += colors.cyan(`📁 File: ${err.loc.file}\n`)
      output += colors.cyan(`📍 Line ${err.loc.line}, Column ${err.loc.column}\n\n`)
    } else if (err.id) {
      output += colors.cyan(`📁 File: ${err.id}\n\n`)
    }

    // Code frame
    if (err.frame) {
      output += colors.yellow('Code:\n')
      output += err.frame + '\n\n'
    }

    // Plugin info
    if (err.plugin) {
      output += colors.magenta(`🔌 Plugin: ${err.plugin}\n\n`)
    }

    // Helpful suggestions
    output += this.getSuggestions(err)

    // Stack trace (collapsed by default)
    if (err.stack && process.env.DEBUG) {
      output += colors.dim('\nStack Trace:\n')
      output += colors.dim(err.stack) + '\n'
    } else {
      output += colors.dim('\n💡 Run with DEBUG=* to see full stack trace\n')
    }

    return output
  }

  private getSuggestions(err: NalthError): string {
    let suggestions = colors.yellow('💡 Suggestions:\n')
    const message = err.message?.toLowerCase() || ''

    // Common error patterns and suggestions
    if (message.includes('cannot find module')) {
      suggestions += colors.white('  • Check if the module is installed: npm install <module-name>\n')
      suggestions += colors.white('  • Verify the import path is correct\n')
      suggestions += colors.white('  • Try clearing node_modules and reinstalling\n')
    } else if (message.includes('unexpected token')) {
      suggestions += colors.white('  • Check for syntax errors in your code\n')
      suggestions += colors.white('  • Ensure you\'re using the correct file extension (.ts, .tsx, .js)\n')
      suggestions += colors.white('  • Verify your tsconfig.json configuration\n')
    } else if (message.includes('failed to resolve')) {
      suggestions += colors.white('  • Check if the file exists at the specified path\n')
      suggestions += colors.white('  • Verify your path aliases in nalth.config.ts\n')
      suggestions += colors.white('  • Try using absolute imports instead of relative\n')
    } else if (message.includes('esbuild')) {
      suggestions += colors.white('  • This is a transpilation error - check your TypeScript/JSX syntax\n')
      suggestions += colors.white('  • Ensure your target environment supports the features you\'re using\n')
    } else if (message.includes('circular dependency')) {
      suggestions += colors.white('  • Refactor your code to remove circular imports\n')
      suggestions += colors.white('  • Consider using dependency injection or lazy loading\n')
    } else if (message.includes('out of memory')) {
      suggestions += colors.white('  • Increase Node.js memory: NODE_OPTIONS=--max-old-space-size=4096\n')
      suggestions += colors.white('  • Check for memory leaks in your code\n')
      suggestions += colors.white('  • Consider code splitting to reduce bundle size\n')
    } else {
      suggestions += colors.white('  • Check the error message above for specific details\n')
      suggestions += colors.white('  • Search for similar issues: https://github.com/nalikiru-dev/nalth.js/issues\n')
      suggestions += colors.white('  • Join our Telegram for help: https://t.me/notrobbins')
    }

    return suggestions + '\n'
  }

  formatWarning(warning: string | RollupError): string {
    const warn = typeof warning === 'string' ? { message: warning } : warning
    let output = '\n'

    output += colors.yellow(colors.bold('⚠️  Warning\n\n'))
    output += colors.yellow(warn.message || String(warning)) + '\n'

    if ('loc' in warn && warn.loc?.file) {
      output += colors.dim(`  at ${warn.loc.file}:${warn.loc.line}:${warn.loc.column}\n`)
    }

    return output
  }

  trackError(error: Error): void {
    this.errorCount++
    const key = error.message.substring(0, 100)
    this.errorCache.set(key, (this.errorCache.get(key) || 0) + 1)
  }

  trackWarning(): void {
    this.warningCount++
  }

  getSummary(): string {
    if (this.errorCount === 0 && this.warningCount === 0) {
      return colors.green('\n✅ Build completed successfully!\n')
    }

    let summary = '\n' + colors.bold('Build Summary:\n')
    
    if (this.errorCount > 0) {
      summary += colors.red(`  ❌ ${this.errorCount} error(s)\n`)
    }
    
    if (this.warningCount > 0) {
      summary += colors.yellow(`  ⚠️  ${this.warningCount} warning(s)\n`)
    }

    return summary + '\n'
  }

  reset(): void {
    this.errorCount = 0
    this.warningCount = 0
    this.errorCache.clear()
  }
}

export const errorHandler = new EnhancedErrorHandler()

// Common error messages with better explanations
export const ERROR_MESSAGES = {
  PORT_IN_USE: (port: number) => ({
    message: `Port ${port} is already in use`,
    suggestions: [
      `Try a different port: nalth --port ${port + 1}`,
      'Kill the process using this port',
      'Use --strictPort=false to automatically find an available port',
    ],
  }),
  
  CONFIG_NOT_FOUND: (configPath: string) => ({
    message: `Configuration file not found: ${configPath}`,
    suggestions: [
      'Create a nalth.config.ts file in your project root',
      'Use npx create-nalth to scaffold a new project',
      'Check the --config flag is pointing to the correct file',
    ],
  }),
  
  HTTPS_CERT_ERROR: () => ({
    message: 'Failed to generate HTTPS certificates',
    suggestions: [
      'Check file system permissions',
      'Ensure you have write access to the .nalth directory',
      'Try running with sudo (not recommended) or fix permissions',
    ],
  }),
  
  DEPENDENCY_NOT_FOUND: (dep: string) => ({
    message: `Dependency not found: ${dep}`,
    suggestions: [
      `Install it: npm install ${dep}`,
      'Check if it\'s listed in package.json',
      'Clear node_modules and reinstall: rm -rf node_modules && npm install',
    ],
  }),
}

export function formatErrorMessage(
  type: keyof typeof ERROR_MESSAGES,
  ...args: any[]
): string {
  const error = (ERROR_MESSAGES[type] as any)(...args)
  let output = '\n' + colors.red(colors.bold('❌ ' + error.message + '\n\n'))
  
  output += colors.yellow('💡 Try these solutions:\n')
  error.suggestions.forEach((suggestion: string, i: number) => {
    output += colors.white(`  ${i + 1}. ${suggestion}\n`)
  })
  
  return output + '\n'
}
