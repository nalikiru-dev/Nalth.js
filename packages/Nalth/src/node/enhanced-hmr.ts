import colors from 'picocolors'
import type { Update } from '../types/hmrPayload'
import type { ModuleNode } from './server/moduleGraph'

export interface HMROptions {
  /**
   * Enable automatic error recovery
   * @default true
   */
  autoRecover?: boolean

  /**
   * Show detailed HMR logs
   * @default false
   */
  verbose?: boolean

  /**
   * Maximum number of HMR retries before full reload
   * @default 3
   */
  maxRetries?: number

  /**
   * Delay between HMR retries (ms)
   * @default 100
   */
  retryDelay?: number

  /**
   * Enable HMR overlay for errors
   * @default true
   */
  overlay?: boolean
}

export class EnhancedHMRManager {
  private retryCount = new Map<string, number>()
  private failedModules = new Set<string>()
  private lastUpdateTime = Date.now()
  private updateQueue: Update[] = []
  private isProcessing = false

  constructor(private options: HMROptions = {}) {
    this.options = {
      autoRecover: true,
      verbose: false,
      maxRetries: 3,
      retryDelay: 100,
      overlay: true,
      ...options,
    }
  }

  /**
   * Handle HMR update with enhanced error recovery
   */
  async handleUpdate(update: Update): Promise<boolean> {
    const { path, acceptedPath } = update

    try {
      // Check if module has failed too many times
      const retries = this.retryCount.get(acceptedPath) || 0
      if (retries >= this.options.maxRetries!) {
        this.log('error', `Module ${acceptedPath} failed ${retries} times, triggering full reload`)
        this.failedModules.add(acceptedPath)
        return false
      }

      // Queue update to prevent race conditions
      this.updateQueue.push(update)
      
      if (!this.isProcessing) {
        await this.processQueue()
      }

      // Reset retry count on success
      this.retryCount.delete(acceptedPath)
      this.failedModules.delete(acceptedPath)
      
      this.log('success', `✓ Hot updated: ${this.formatPath(path)}`)
      return true

    } catch (error) {
      return this.handleUpdateError(update, error as Error)
    }
  }

  /**
   * Process queued updates in order
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true

    while (this.updateQueue.length > 0) {
      const update = this.updateQueue.shift()!
      
      // Small delay to batch rapid updates
      const timeSinceLastUpdate = Date.now() - this.lastUpdateTime
      if (timeSinceLastUpdate < 50 && this.updateQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 50 - timeSinceLastUpdate))
      }

      this.lastUpdateTime = Date.now()
    }

    this.isProcessing = false
  }

  /**
   * Handle HMR update errors with retry logic
   */
  private async handleUpdateError(update: Update, error: Error): Promise<boolean> {
    const { acceptedPath } = update
    const retries = (this.retryCount.get(acceptedPath) || 0) + 1
    this.retryCount.set(acceptedPath, retries)

    this.log('error', `✗ HMR update failed for ${acceptedPath} (attempt ${retries}/${this.options.maxRetries})`)
    this.log('error', error.message)

    if (this.options.autoRecover && retries < this.options.maxRetries!) {
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, this.options.retryDelay! * retries))
      
      this.log('info', `Retrying HMR update for ${acceptedPath}...`)
      return this.handleUpdate(update)
    }

    return false
  }

  /**
   * Analyze module dependencies for better HMR
   */
  analyzeModuleDependencies(module: ModuleNode): {
    canHMR: boolean
    reason?: string
    suggestions?: string[]
  } {
    // Check if module accepts HMR
    if (module.isSelfAccepting) {
      return { canHMR: true }
    }

    // Check if any importer accepts HMR
    const acceptingImporter = this.findAcceptingImporter(module)
    if (acceptingImporter) {
      return { 
        canHMR: true,
        reason: `Accepted by ${acceptingImporter.url}`,
      }
    }

    // Module cannot HMR - provide suggestions
    return {
      canHMR: false,
      reason: 'No HMR boundary found',
      suggestions: [
        'Add import.meta.hot.accept() to this module',
        'Add HMR acceptance in a parent component',
        'Check if the module exports are used correctly',
      ],
    }
  }

  /**
   * Find the nearest importer that accepts HMR
   */
  private findAcceptingImporter(
    module: ModuleNode,
    visited = new Set<ModuleNode>(),
  ): ModuleNode | null {
    if (visited.has(module)) return null
    visited.add(module)

    for (const importer of module.importers) {
      if (importer.isSelfAccepting) {
        return importer
      }
      
      const accepting = this.findAcceptingImporter(importer, visited)
      if (accepting) return accepting
    }

    return null
  }

  /**
   * Get HMR statistics
   */
  getStats(): {
    totalRetries: number
    failedModules: string[]
    successRate: number
  } {
    const totalRetries = Array.from(this.retryCount.values()).reduce((a, b) => a + b, 0)
    const failedModules = Array.from(this.failedModules)
    const totalAttempts = totalRetries + failedModules.length
    const successRate = totalAttempts > 0 
      ? ((totalAttempts - failedModules.length) / totalAttempts) * 100 
      : 100

    return {
      totalRetries,
      failedModules,
      successRate,
    }
  }

  /**
   * Reset HMR state
   */
  reset(): void {
    this.retryCount.clear()
    this.failedModules.clear()
    this.updateQueue = []
    this.isProcessing = false
  }

  /**
   * Format module path for display
   */
  private formatPath(path: string): string {
    // Remove query params and hash
    const cleanPath = path.split('?')[0].split('#')[0]
    
    // Shorten long paths
    if (cleanPath.length > 60) {
      const parts = cleanPath.split('/')
      return '.../' + parts.slice(-2).join('/')
    }
    
    return cleanPath
  }

  /**
   * Log HMR messages
   */
  private log(level: 'info' | 'success' | 'error', message: string): void {
    if (!this.options.verbose && level === 'info') return

    const prefix = '[HMR]'
    const timestamp = new Date().toLocaleTimeString()

    switch (level) {
      case 'success':
        console.log(colors.green(`${prefix} ${timestamp}`), message)
        break
      case 'error':
        console.error(colors.red(`${prefix} ${timestamp}`), message)
        break
      case 'info':
        console.log(colors.cyan(`${prefix} ${timestamp}`), message)
        break
    }
  }
}

/**
 * Smart HMR boundary detection
 */
export function detectHMRBoundaries(code: string): {
  hasHMR: boolean
  acceptsSelf: boolean
  acceptsDeps: string[]
} {
  const hasHMR = code.includes('import.meta.hot')
  const acceptsSelf = /import\.meta\.hot\.accept\(\s*\)/.test(code) ||
                      /import\.meta\.hot\.accept\(\s*\(\s*\)\s*=>\s*/.test(code)
  
  // Extract accepted dependencies
  const acceptsDeps: string[] = []
  const depsRegex = /import\.meta\.hot\.accept\(\s*['"`]([^'"`]+)['"`]/g
  let match
  while ((match = depsRegex.exec(code)) !== null) {
    acceptsDeps.push(match[1])
  }

  return {
    hasHMR,
    acceptsSelf,
    acceptsDeps,
  }
}

/**
 * Generate HMR boilerplate code
 */
export function generateHMRBoilerplate(options: {
  acceptSelf?: boolean
  acceptDeps?: string[]
  disposeCallback?: string
}): string {
  const lines: string[] = []

  lines.push('if (import.meta.hot) {')

  if (options.acceptSelf) {
    lines.push('  import.meta.hot.accept((newModule) => {')
    lines.push('    // Handle hot update')
    lines.push('    console.log("[HMR] Self-accepting module updated")')
    lines.push('  })')
  }

  if (options.acceptDeps && options.acceptDeps.length > 0) {
    for (const dep of options.acceptDeps) {
      lines.push(`  import.meta.hot.accept('${dep}', (newModule) => {`)
      lines.push(`    console.log("[HMR] Dependency '${dep}' updated")`)
      lines.push('  })')
    }
  }

  if (options.disposeCallback) {
    lines.push('  import.meta.hot.dispose(() => {')
    lines.push(`    ${options.disposeCallback}`)
    lines.push('  })')
  }

  lines.push('}')

  return lines.join('\n')
}
