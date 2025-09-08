import type { PluginContainer, ResolvedConfig, ModuleGraph, TransformResult, NalthPlugin } from '../types'
import { normalizePath } from '../utils'

export function createPluginContainer(
  config: ResolvedConfig,
  moduleGraph: ModuleGraph
): PluginContainer {
  const plugins = config.plugins
  
  const container: PluginContainer = {
    async resolveId(id: string, importer?: string) {
      let resolved: string | null = null
      
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          const result = await plugin.resolveId(id, importer)
          if (result) {
            resolved = typeof result === 'string' ? result : result
            break
          }
        }
      }
      
      // Default resolution
      if (!resolved) {
        if (id.startsWith('/')) {
          resolved = normalizePath(id)
        } else if (importer && !id.startsWith('.')) {
          // External module
          resolved = id
        } else if (importer) {
          // Relative import
          const { resolve } = await import('node:path')
          const { dirname } = await import('node:path')
          resolved = normalizePath(resolve(dirname(importer), id))
        }
      }
      
      return resolved
    },

    async load(id: string) {
      for (const plugin of plugins) {
        if (plugin.load) {
          const result = await plugin.load(id)
          if (result !== null && result !== undefined) {
            return typeof result === 'string' ? result : result
          }
        }
      }
      
      // Default file loading
      try {
        const { readFileSync, existsSync } = await import('node:fs')
        if (existsSync(id)) {
          return readFileSync(id, 'utf-8')
        }
      } catch {
        // File doesn't exist or can't be read
      }
      
      return null
    },

    async transform(code: string, id: string) {
      let result: TransformResult = { code }
      
      for (const plugin of plugins) {
        if (plugin.transform) {
          const transformResult = await plugin.transform(result.code, id)
          if (transformResult) {
            if (typeof transformResult === 'string') {
              result.code = transformResult
            } else {
              result = { ...result, ...transformResult }
            }
          }
        }
      }
      
      // Update module graph
      const mod = moduleGraph.getModuleById(id)
      if (mod) {
        mod.transformResult = result
      }
      
      return result
    },

    async close() {
      await Promise.all(
        plugins.map(plugin => plugin.buildEnd?.())
      )
    }
  }

  return container
}
