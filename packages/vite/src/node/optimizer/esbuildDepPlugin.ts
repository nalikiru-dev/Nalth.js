import path from 'path'
import { Plugin } from 'esbuild'
import { knownAssetTypes } from '../constants'
import { ResolvedConfig } from '..'
import chalk from 'chalk'
import { deepImportRE, isBuiltin } from '../utils'
import { tryNodeResolve } from '../plugins/resolve'

const externalTypes = ['css', 'vue', 'svelte', ...knownAssetTypes]

export function esbuildDepPlugin(
  qualified: Record<string, string>,
  config: ResolvedConfig,
  transitiveOptimized: Record<string, true>
): Plugin {
  return {
    name: 'vite:dep-pre-bundle',
    setup(build) {
      // externalize assets and commonly known non-js file types
      build.onResolve(
        {
          filter: new RegExp(`\\.(` + externalTypes.join('|') + `)(\\?.*)?$`)
        },
        ({ path: _path, importer }) => {
          if (_path.startsWith('.')) {
            const dir = path.dirname(importer)
            return {
              path: path.resolve(dir, _path),
              external: true
            }
          }
        }
      )

      build.onResolve({ filter: /^[\w@]/ }, ({ path: id, importer }) => {
        // ensure esbuild uses our resolved entires of optimized deps in all
        // cases
        if (id in qualified) {
          return {
            path: path.resolve(qualified[id])
          }
        } else if (!isBuiltin(id)) {
          // record transitive deps
          const deepMatch = id.match(deepImportRE)
          const pkgId = deepMatch ? deepMatch[1] || deepMatch[2] : id
          transitiveOptimized[pkgId] = true
          const resolved = tryNodeResolve(
            id,
            path.dirname(importer),
            false,
            true,
            config.dedupe,
            config.root
          )
          if (resolved) {
            return {
              path: resolved.id
            }
          }
        } else {
          // redirect node-builtins to empty module for browser
          config.logger.warn(
            chalk.yellow(
              `externalized node built-in "${id}" to empty module. ` +
                `(imported by: ${chalk.white.dim(importer)})`
            )
          )
          return {
            path: id,
            namespace: 'browser-external'
          }
        }
      })

      build.onLoad(
        { filter: /.*/, namespace: 'browser-external' },
        ({ path: id }) => {
          return {
            contents:
              `export default new Proxy({}, {
  get() {
    throw new Error('Module "${id}" has been externalized for ` +
              `browser compatibility and cannot be accessed in client code.')
  }
})`
          }
        }
      )
    }
  }
}
