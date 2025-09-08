import { resolve, extname } from 'node:path'
import type { ModuleGraph, ModuleNode, TransformResult } from '../types'
import { normalizePath } from '../utils'

export function createModuleGraph(): ModuleGraph {
  const urlToModuleMap = new Map<string, ModuleNode>()
  const idToModuleMap = new Map<string, ModuleNode>()
  const fileToModulesMap = new Map<string, Set<ModuleNode>>()

  function ensureEntryFromUrl(rawUrl: string): ModuleNode {
    const [url] = rawUrl.split('?', 2)
    let mod = urlToModuleMap.get(url)
    if (!mod) {
      mod = createModuleNode(url)
      urlToModuleMap.set(url, mod)
    }
    return mod
  }

  function createModuleNode(url: string): ModuleNode {
    const mod: ModuleNode = {
      id: null,
      file: null,
      type: getModuleType(url),
      info: undefined,
      meta: undefined,
      importers: new Set(),
      importedModules: new Set(),
      acceptedHmrDeps: new Set(),
      acceptedHmrExports: null,
      importedBindings: null,
      isSelfAccepting: false,
      transformResult: null,
      ssrTransformResult: null,
      ssrModule: null,
      ssrError: null,
      lastHMRTimestamp: 0,
      lastInvalidationTimestamp: 0,
      invalidate() {
        mod.lastInvalidationTimestamp = Date.now()
        mod.transformResult = null
        mod.ssrTransformResult = null
        
        // Invalidate importers
        mod.importers.forEach(importer => {
          if (importer !== mod) {
            importer.invalidate()
          }
        })
      }
    }

    // Set file path if it's a file URL
    if (!url.includes('?') && !url.startsWith('virtual:')) {
      mod.file = normalizePath(resolve(url))
      mod.id = mod.file
    } else {
      mod.id = url
    }

    return mod
  }

  function getModuleType(url: string): 'js' | 'css' {
    const ext = extname(url.split('?')[0])
    return ['.css', '.scss', '.sass', '.less', '.styl', '.stylus'].includes(ext) ? 'css' : 'js'
  }

  const moduleGraph: ModuleGraph = {
    getModuleById(id: string) {
      return idToModuleMap.get(id)
    },

    getModulesByFile(file: string) {
      return fileToModulesMap.get(file)
    },

    onFileChange(file: string) {
      const mods = moduleGraph.getModulesByFile(file)
      if (mods) {
        mods.forEach(mod => {
          moduleGraph.invalidateModule(mod)
        })
      }
    },

    invalidateModule(mod: ModuleNode) {
      mod.invalidate()
      
      // Remove from maps if needed
      if (mod.file) {
        const modules = fileToModulesMap.get(mod.file)
        if (modules) {
          modules.delete(mod)
          if (modules.size === 0) {
            fileToModulesMap.delete(mod.file)
          }
        }
      }
    },

    invalidateAll() {
      urlToModuleMap.forEach(mod => {
        moduleGraph.invalidateModule(mod)
      })
      urlToModuleMap.clear()
      idToModuleMap.clear()
      fileToModulesMap.clear()
    },

    updateModuleInfo(
      mod: ModuleNode,
      importedModules: Set<string | ModuleNode>
    ) {
      const prevImports = mod.importedModules
      const nextImports = new Set<ModuleNode>()

      for (const imported of importedModules) {
        const dep = typeof imported === 'string' 
          ? ensureEntryFromUrl(imported)
          : imported

        dep.importers.add(mod)
        nextImports.add(dep)
      }

      // Remove old imports
      prevImports.forEach(dep => {
        if (!nextImports.has(dep)) {
          dep.importers.delete(mod)
        }
      })

      mod.importedModules = nextImports

      // Update file mapping
      if (mod.file) {
        let modules = fileToModulesMap.get(mod.file)
        if (!modules) {
          modules = new Set()
          fileToModulesMap.set(mod.file, modules)
        }
        modules.add(mod)
      }

      // Update id mapping
      if (mod.id) {
        idToModuleMap.set(mod.id, mod)
      }

      return nextImports
    }
  }

  return moduleGraph
}
