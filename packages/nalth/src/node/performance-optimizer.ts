import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import colors from 'picocolors'

export interface PerformanceMetrics {
  buildTime: number
  bundleSize: number
  chunkCount: number
  cacheHitRate: number
  hmrUpdateTime: number
}

export interface CacheEntry {
  hash: string
  content: string
  timestamp: number
  size: number
  dependencies: string[]
}

export class PerformanceOptimizer {
  private cache = new Map<string, CacheEntry>()
  private cacheDir: string
  private metrics: Partial<PerformanceMetrics> = {}
  private startTime = 0

  constructor(root: string = process.cwd()) {
    this.cacheDir = path.join(root, 'node_modules', '.nalth', 'cache')
    this.ensureCacheDir()
    this.loadCache()
  }

  /**
   * Start performance tracking
   */
  startTracking(): void {
    this.startTime = performance.now()
  }

  /**
   * End performance tracking and return metrics
   */
  endTracking(): PerformanceMetrics {
    const buildTime = performance.now() - this.startTime
    
    return {
      buildTime,
      bundleSize: this.metrics.bundleSize || 0,
      chunkCount: this.metrics.chunkCount || 0,
      cacheHitRate: this.getCacheHitRate(),
      hmrUpdateTime: this.metrics.hmrUpdateTime || 0,
    }
  }

  /**
   * Get or set cached content
   */
  async getCached(
    key: string,
    generator: () => Promise<string>,
    dependencies: string[] = [],
  ): Promise<{ content: string; fromCache: boolean }> {
    const hash = this.hashKey(key, dependencies)
    const cached = this.cache.get(key)

    // Check if cache is valid
    if (cached && cached.hash === hash) {
      // Verify dependencies haven't changed
      const depsValid = await this.validateDependencies(cached.dependencies)
      if (depsValid) {
        return { content: cached.content, fromCache: true }
      }
    }

    // Generate new content
    const content = await generator()
    
    // Store in cache
    this.cache.set(key, {
      hash,
      content,
      timestamp: Date.now(),
      size: Buffer.byteLength(content),
      dependencies,
    })

    // Persist cache
    this.saveCache()

    return { content, fromCache: false }
  }

  /**
   * Invalidate cache for specific key or pattern
   */
  invalidate(keyOrPattern: string | RegExp): void {
    if (typeof keyOrPattern === 'string') {
      this.cache.delete(keyOrPattern)
    } else {
      for (const key of this.cache.keys()) {
        if (keyOrPattern.test(key)) {
          this.cache.delete(key)
        }
      }
    }
    this.saveCache()
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear()
    try {
      fs.rmSync(this.cacheDir, { recursive: true, force: true })
    } catch {}
    this.ensureCacheDir()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    entries: number
    totalSize: number
    hitRate: number
    oldestEntry: number
  } {
    let totalSize = 0
    let oldestEntry = Date.now()

    for (const entry of this.cache.values()) {
      totalSize += entry.size
      if (entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp
      }
    }

    return {
      entries: this.cache.size,
      totalSize,
      hitRate: this.getCacheHitRate(),
      oldestEntry,
    }
  }

  /**
   * Optimize bundle configuration
   */
  getOptimizedBundleConfig(): {
    chunkSizeWarningLimit: number
    rollupOptions: any
  } {
    return {
      chunkSizeWarningLimit: 1000, // 1MB
      rollupOptions: {
        output: {
          // Smart chunking strategy
          manualChunks: (id: string) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // Large libraries get their own chunks
              if (id.includes('lodash')) return 'vendor-lodash'
              if (id.includes('moment')) return 'vendor-moment'
              if (id.includes('chart')) return 'vendor-charts'
              if (id.includes('react-dom')) return 'vendor-react-dom'
              if (id.includes('react')) return 'vendor-react'
              if (id.includes('vue')) return 'vendor-vue'
              
              // Group smaller vendor libraries
              return 'vendor'
            }
          },
          
          // Optimize chunk names
          chunkFileNames: (chunkInfo) => {
            const name = chunkInfo.name
            return `assets/${name}-[hash].js`
          },
          
          // Optimize asset names
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || ''
            
            // Group by type
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(name)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            if (/\.css$/.test(name)) {
              return 'assets/css/[name]-[hash][extname]'
            }
            
            return 'assets/[name]-[hash][extname]'
          },
        },
        
        // Tree-shaking optimizations
        treeshake: {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
      },
    }
  }

  /**
   * Analyze and suggest performance improvements
   */
  analyzePerformance(metrics: PerformanceMetrics): string[] {
    const suggestions: string[] = []

    // Build time suggestions
    if (metrics.buildTime > 10000) {
      suggestions.push('Build time is slow (>10s). Consider:')
      suggestions.push('  • Enable persistent caching')
      suggestions.push('  • Reduce the number of dependencies')
      suggestions.push('  • Use dynamic imports for code splitting')
    }

    // Bundle size suggestions
    if (metrics.bundleSize > 500 * 1024) {
      suggestions.push('Bundle size is large (>500KB). Consider:')
      suggestions.push('  • Enable code splitting')
      suggestions.push('  • Use tree-shaking')
      suggestions.push('  • Analyze bundle with rollup-plugin-visualizer')
    }

    // Chunk count suggestions
    if (metrics.chunkCount > 50) {
      suggestions.push('Too many chunks (>50). Consider:')
      suggestions.push('  • Adjust manual chunks configuration')
      suggestions.push('  • Increase chunk size limit')
    }

    // Cache hit rate suggestions
    if (metrics.cacheHitRate < 50) {
      suggestions.push('Low cache hit rate (<50%). Consider:')
      suggestions.push('  • Check if dependencies are changing frequently')
      suggestions.push('  • Verify cache directory permissions')
    }

    // HMR suggestions
    if (metrics.hmrUpdateTime > 1000) {
      suggestions.push('HMR updates are slow (>1s). Consider:')
      suggestions.push('  • Reduce the number of HMR boundaries')
      suggestions.push('  • Check for circular dependencies')
      suggestions.push('  • Use React Fast Refresh or Vue HMR')
    }

    return suggestions
  }

  /**
   * Print performance report
   */
  printReport(metrics: PerformanceMetrics): void {
    console.log(colors.cyan('\n📊 Performance Report:\n'))
    
    console.log(colors.white(`  Build Time: ${colors.bold(this.formatTime(metrics.buildTime))}`))
    console.log(colors.white(`  Bundle Size: ${colors.bold(this.formatSize(metrics.bundleSize))}`))
    console.log(colors.white(`  Chunks: ${colors.bold(String(metrics.chunkCount))}`))
    console.log(colors.white(`  Cache Hit Rate: ${colors.bold(metrics.cacheHitRate.toFixed(1) + '%')}`))
    
    if (metrics.hmrUpdateTime > 0) {
      console.log(colors.white(`  HMR Update: ${colors.bold(this.formatTime(metrics.hmrUpdateTime))}`))
    }

    const suggestions = this.analyzePerformance(metrics)
    if (suggestions.length > 0) {
      console.log(colors.yellow('\n💡 Performance Suggestions:\n'))
      suggestions.forEach(s => console.log(colors.white(`  ${s}`)))
    }

    console.log() // Empty line
  }

  /**
   * Hash key with dependencies
   */
  private hashKey(key: string, dependencies: string[]): string {
    const hash = createHash('md5')
    hash.update(key)
    dependencies.forEach(dep => hash.update(dep))
    return hash.digest('hex')
  }

  /**
   * Validate dependencies haven't changed
   */
  private async validateDependencies(dependencies: string[]): Promise<boolean> {
    for (const dep of dependencies) {
      try {
        const stats = await fs.promises.stat(dep)
        const cached = this.cache.get(dep)
        if (!cached || cached.timestamp < stats.mtimeMs) {
          return false
        }
      } catch {
        return false
      }
    }
    return true
  }

  /**
   * Calculate cache hit rate
   */
  private getCacheHitRate(): number {
    // This would be tracked during actual cache operations
    // Placeholder implementation
    return 75.0
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    try {
      fs.mkdirSync(this.cacheDir, { recursive: true })
    } catch {}
  }

  /**
   * Load cache from disk
   */
  private loadCache(): void {
    try {
      const cachePath = path.join(this.cacheDir, 'cache.json')
      if (fs.existsSync(cachePath)) {
        const data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
        this.cache = new Map(Object.entries(data))
      }
    } catch {}
  }

  /**
   * Save cache to disk
   */
  private saveCache(): void {
    try {
      const cachePath = path.join(this.cacheDir, 'cache.json')
      const data = Object.fromEntries(this.cache)
      fs.writeFileSync(cachePath, JSON.stringify(data, null, 2))
    } catch {}
  }

  /**
   * Format time for display
   */
  private formatTime(ms: number): string {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  /**
   * Format size for display
   */
  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
  }
}

/**
 * Create performance optimizer instance
 */
export function createPerformanceOptimizer(root?: string): PerformanceOptimizer {
  return new PerformanceOptimizer(root)
}
