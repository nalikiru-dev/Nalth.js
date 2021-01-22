import fs from 'fs'
import path from 'path'
import { Plugin } from '../plugin'
import { ResolvedConfig } from '../config'
import chalk from 'chalk'
import MagicString from 'magic-string'
import { init, parse as parseImports, ImportSpecifier } from 'es-module-lexer'
import { isCSSRequest, isDirectCSSRequest } from './css'
import {
  isBuiltin,
  cleanUrl,
  createDebugger,
  generateCodeFrame,
  injectQuery,
  isDataUrl,
  isExternalUrl,
  isJSRequest,
  prettifyUrl,
  timeFrom,
  normalizePath
} from '../utils'
import {
  debugHmr,
  handlePrunedModules,
  lexAcceptedHmrDeps
} from '../server/hmr'
import {
  FS_PREFIX,
  CLIENT_DIR,
  CLIENT_PUBLIC_PATH,
  DEP_VERSION_RE,
  VALID_ID_PREFIX,
  NULL_BYTE_PLACEHOLDER,
  OPTIMIZED_PREFIX
} from '../constants'
import { ViteDevServer } from '..'
import { checkPublicFile } from './asset'
import { parse as parseJS } from 'acorn'
import type { ImportDeclaration, Node } from 'estree'
import { makeLegalIdentifier } from '@rollup/pluginutils'
import { transformImportGlob } from '../importGlob'

const isDebug = !!process.env.DEBUG
const debugRewrite = createDebugger('vite:rewrite')

const clientDir = normalizePath(CLIENT_DIR)

const skipRE = /\.(map|json)$/
const canSkip = (id: string) => skipRE.test(id) || isDirectCSSRequest(id)

function markExplicitImport(url: string) {
  if (!isJSRequest(cleanUrl(url)) && !isCSSRequest(url)) {
    return injectQuery(url, 'import')
  }
  return url
}

/**
 * Server-only plugin that lexes, resolves, rewrites and analyzes url imports.
 *
 * - Imports are resolved to ensure they exist on disk
 *
 * - Lexes HMR accept calls and updates import relationships in the module graph
 *
 * - Bare module imports are resolved (by @rollup-plugin/node-resolve) to
 * absolute file paths, e.g.
 *
 *     ```js
 *     import 'foo'
 *     ```
 *     is rewritten to
 *     ```js
 *     import '/@fs//project/node_modules/foo/dist/foo.js'
 *     ```
 *
 * - CSS imports are appended with `.js` since both the js module and the actual
 * css (referenced via <link>) may go through the transform pipeline:
 *
 *     ```js
 *     import './style.css'
 *     ```
 *     is rewritten to
 *     ```js
 *     import './style.css.js'
 *     ```
 */
export function importAnalysisPlugin(config: ResolvedConfig): Plugin {
  let server: ViteDevServer
  let optimizedSource: string | undefined

  return {
    name: 'vite:import-analysis',

    configureServer(_server) {
      server = _server
    },

    async transform(source, importer, ssr) {
      const prettyImporter = prettifyUrl(importer, config.root)

      if (canSkip(importer)) {
        isDebug && debugRewrite(chalk.dim(`[skipped] ${prettyImporter}`))
        return null
      }

      const rewriteStart = Date.now()
      await init
      let imports: ImportSpecifier[] = []
      try {
        imports = parseImports(source)[0]
      } catch (e) {
        const isVue = importer.endsWith('.vue')
        const maybeJSX = !isVue && isJSRequest(importer)

        const msg = isVue
          ? `Install @vitejs/plugin-vue to handle .vue files.`
          : maybeJSX
          ? `If you are using JSX, make sure to name the file with the .jsx or .tsx extension.`
          : `You may need to install appropriate plugins to handle the ${path.extname(
              importer
            )} file format.`

        this.error(
          `Failed to parse source for import analysis because the content ` +
            `contains invalid JS syntax. ` +
            msg,
          e.idx
        )
      }

      if (!imports.length) {
        isDebug &&
          debugRewrite(
            `${timeFrom(rewriteStart)} ${chalk.dim(
              `[no imports] ${prettyImporter}`
            )}`
          )
        return source
      }

      let hasHMR = false
      let isSelfAccepting = false
      let hasEnv = false
      let needQueryInjectHelper = false
      let s: MagicString | undefined
      const str = () => s || (s = new MagicString(source))
      // vite-only server context
      const { moduleGraph } = server
      // since we are already in the transform phase of the importer, it must
      // have been loaded so its entry is guaranteed in the module graph.
      const importerModule = moduleGraph.getModuleById(importer)!
      const importedUrls = new Set<string>()
      const acceptedUrls = new Set<{
        url: string
        start: number
        end: number
      }>()
      const toAbsoluteUrl = (url: string) =>
        path.posix.resolve(path.posix.dirname(importerModule.url), url)

      const normalizeUrl = async (
        url: string,
        pos: number
      ): Promise<[string, string]> => {
        const resolved = await this.resolve(url, importer)

        if (!resolved) {
          this.error(
            `Failed to resolve import "${url}". Does the file exist?`,
            pos
          )
        }

        const isRelative = url.startsWith('.')

        // normalize all imports into resolved URLs
        // e.g. `import 'foo'` -> `import '/@fs/.../node_modules/foo/index.js`
        if (resolved.id.startsWith(config.root + '/')) {
          // in root: infer short absolute path from root
          url = resolved.id.slice(config.root.length)
        } else if (fs.existsSync(cleanUrl(resolved.id))) {
          // exists but out of root: rewrite to absolute /@fs/ paths
          url = FS_PREFIX + resolved.id
        } else {
          url = resolved.id
        }

        if (isExternalUrl(url)) {
          return [url, url]
        }

        // if the resolved id is not a valid browser import specifier,
        // prefix it to make it valid. We will strip this before feeding it
        // back into the transform pipeline
        if (!url.startsWith('.') && !url.startsWith('/')) {
          url =
            VALID_ID_PREFIX + resolved.id.replace('\0', NULL_BYTE_PLACEHOLDER)
        }

        // mark non-js/css imports with `?import`
        url = markExplicitImport(url)

        // for relative js/css imports, inherit importer's version query
        // do not do this for unknown type imports, otherwise the appended
        // query can break 3rd party plugin's extension checks.
        if (isRelative && !/[\?&]import\b/.test(url)) {
          const versionMatch = importer.match(DEP_VERSION_RE)
          if (versionMatch) {
            url = injectQuery(url, versionMatch[1])
          }
        }

        // check if the dep has been hmr updated. If yes, we need to attach
        // its last updated timestamp to force the browser to fetch the most
        // up-to-date version of this module.
        try {
          const depModule = await moduleGraph.ensureEntryFromUrl(url)
          if (depModule.lastHMRTimestamp > 0) {
            url = injectQuery(url, `t=${depModule.lastHMRTimestamp}`)
          }
        } catch (e) {
          // it's possible that the dep fails to resolve (non-existent import)
          // attach location to the missing import
          e.pos = pos
          throw e
        }

        return [url, resolved.id]
      }

      for (let index = 0; index < imports.length; index++) {
        const {
          s: start,
          e: end,
          ss: expStart,
          se: expEnd,
          d: dynamicIndex
        } = imports[index]

        const rawUrl = source.slice(start, end)
        let url = rawUrl

        // check import.meta usage
        if (url === 'import.meta') {
          const prop = source.slice(end, end + 4)
          if (prop === '.hot') {
            hasHMR = true
            if (source.slice(end + 4, end + 11) === '.accept') {
              // further analyze accepted modules
              if (
                lexAcceptedHmrDeps(
                  source,
                  source.indexOf('(', end + 11) + 1,
                  acceptedUrls
                )
              ) {
                isSelfAccepting = true
              }
            }
          } else if (prop === '.env') {
            hasEnv = true
          } else if (prop === '.glo' && source[end + 4] === 'b') {
            // transform import.meta.glob()
            // e.g. `import.meta.glob('glob:./dir/*.js')`
            const {
              imports,
              importsString,
              exp,
              endIndex,
              base,
              pattern
            } = await transformImportGlob(
              source,
              start,
              importer,
              index,
              normalizeUrl
            )
            str().prepend(importsString)
            str().overwrite(expStart, endIndex, exp)
            imports.forEach((url) => importedUrls.add(url))
            server._globImporters[importerModule.file!] = {
              module: importerModule,
              base,
              pattern
            }
          }
          continue
        }

        // For dynamic id, check if it's a literal that we can resolve
        let hasViteIgnore = false
        let isLiteralDynamicId = false
        if (dynamicIndex >= 0) {
          // check @vite-ignore which suppresses dynamic import warning
          hasViteIgnore = /\/\*\s*@vite-ignore\s*\*\//.test(url)
          // #998 remove comment
          url = url.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '').trim()
          const literalIdMatch = url.match(/^'([^']+)'|"([^"]+)"$/)
          if (literalIdMatch) {
            isLiteralDynamicId = true
            url = literalIdMatch[1] || literalIdMatch[2]
          }
        }

        // If resolvable, let's resolve it
        if (dynamicIndex === -1 || isLiteralDynamicId) {
          // skip external / data uri
          if (isExternalUrl(url) || isDataUrl(url)) {
            continue
          }
          // skip ssr external
          if (ssr) {
            if (
              server._ssrExternals?.some((id) => {
                return url === id || url.startsWith(id + '/')
              })
            ) {
              continue
            }
            if (isBuiltin(url)) {
              continue
            }
          }
          // skip client
          if (url === CLIENT_PUBLIC_PATH) {
            continue
          }

          // warn imports to non-asset /public files
          if (
            url.startsWith('/') &&
            !config.assetsInclude(cleanUrl(url)) &&
            !url.endsWith('.json') &&
            checkPublicFile(url, config.root)
          ) {
            throw new Error(
              `Cannot import non-asset file ${url} which is inside /public.` +
                `JS/CSS files inside /public are copied as-is on build and ` +
                `can only be referenced via <script src> or <link href> in html.`
            )
          }

          // normalize
          const [normalizedUrl, resolvedId] = await normalizeUrl(url, start)
          url = normalizedUrl

          // rewrite
          if (url !== rawUrl) {
            // for optimized cjs deps, support named imports by rewriting named
            // imports to const assignments.
            if (url.startsWith(OPTIMIZED_PREFIX)) {
              const depId = resolvedId.slice(OPTIMIZED_PREFIX.length)
              const optimizedId = makeLegalIdentifier(depId)
              optimizedSource =
                optimizedSource ||
                normalizePath(path.join(config.optimizeCacheDir!, 'deps.js')) +
                  `?v=${server._optimizeDepsMetadata!.hash}`

              if (isLiteralDynamicId) {
                // rewrite `import('package')` to expose module.exports
                // note plugin-commonjs' behavior is exposing all properties on
                // `module.exports` PLUS `module.exports` itself as `default`.
                str().overwrite(
                  dynamicIndex,
                  end + 1,
                  `import('${optimizedSource}').then(m => m.${optimizedId})`
                )
              } else {
                const exp = source.slice(expStart, expEnd)
                const rewritten = transformOptimizedImport(
                  exp,
                  optimizedSource,
                  optimizedId,
                  index,
                  depId,
                  server._optimizeDepsMetadata!.optimized[depId]
                )
                if (rewritten) {
                  str().overwrite(expStart, expEnd, rewritten)
                } else {
                  // #1439 export * from '...'
                  str().overwrite(start, end, url)
                }
              }
            } else {
              str().overwrite(start, end, isLiteralDynamicId ? `'${url}'` : url)
            }
          }

          // record for HMR import chain analysis
          importedUrls.add(url)
        } else if (!importer.startsWith(clientDir)) {
          if (!hasViteIgnore && !isSupportedDynamicImport(url)) {
            this.warn(
              `\n` +
                chalk.cyan(importerModule.file) +
                `\n` +
                generateCodeFrame(source, start) +
                `\nThe above dynamic import cannot be analyzed by vite.\n` +
                `See ${chalk.blue(
                  `https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations`
                )} ` +
                `for supported dynamic import formats. ` +
                `If this is intended to be left as-is, you can use the ` +
                `/* @vite-ignore */ comment inside the import() call to suppress this warning.\n`
            )
          }
          needQueryInjectHelper = true
          str().overwrite(start, end, `__vite__injectQuery(${url}, 'import')`)
        }
      }

      if (hasEnv) {
        // inject import.meta.env
        str().prepend(
          `import.meta.env = ${JSON.stringify({
            ...config.env,
            SSR: !!ssr
          })};`
        )
      }

      if (hasHMR && !ssr) {
        debugHmr(
          `${
            isSelfAccepting
              ? `[self-accepts]`
              : acceptedUrls.size
              ? `[accepts-deps]`
              : `[detected api usage]`
          } ${prettyImporter}`
        )
        // inject hot context
        str().prepend(
          `import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";` +
            `import.meta.hot = __vite__createHotContext(${JSON.stringify(
              importerModule.url
            )});`
        )
      }

      if (needQueryInjectHelper) {
        str().prepend(
          `import { injectQuery as __vite__injectQuery } from "${CLIENT_PUBLIC_PATH}";`
        )
      }

      // normalize and rewrite accepted urls
      const normalizedAcceptedUrls = new Set<string>()
      for (const { url, start, end } of acceptedUrls) {
        const [normalized] = await moduleGraph.resolveUrl(
          toAbsoluteUrl(markExplicitImport(url))
        )
        normalizedAcceptedUrls.add(normalized)
        str().overwrite(start, end, JSON.stringify(normalized))
      }

      // update the module graph for HMR analysis.
      // node CSS imports does its own graph update in the css plugin so we
      // only handle js graph updates here.
      if (!isCSSRequest(importer)) {
        const prunedImports = await moduleGraph.updateModuleInfo(
          importerModule,
          importedUrls,
          normalizedAcceptedUrls,
          isSelfAccepting
        )
        if (hasHMR && prunedImports) {
          handlePrunedModules(prunedImports, server)
        }
      }

      if (s) {
        return s.toString()
      } else {
        return source
      }
    }
  }
}

/**
 * https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
 * This is probably less accurate but is much cheaper than a full AST parse.
 */
function isSupportedDynamicImport(url: string) {
  url = url.trim().slice(1, -1)
  // must be relative
  if (!url.startsWith('./') && !url.startsWith('../')) {
    return false
  }
  // must have extension
  if (!path.extname(url)) {
    return false
  }
  // must be more specific if importing from same dir
  if (url.startsWith('./${') && url.indexOf('/') === url.lastIndexOf('/')) {
    return false
  }
  return true
}

function transformOptimizedImport(
  importExp: string,
  optimizedSource: string,
  optimizedId: string,
  importIndex: number,
  id: string,
  exports: string[]
): string | undefined {
  const node = (parseJS(importExp, {
    ecmaVersion: 2020,
    sourceType: 'module'
  }) as any).body[0] as Node

  const lines: string[] = []
  if (!exports.length) {
    // optimized cjs dep. import then assign.
    // Credits \@csr632 via #837
    // If there is multiple import for same id in one file,
    // importIndex will prevent the cjsModuleName to be duplicate
    const moduleName = `__vite__${optimizedId}_${importIndex}`
    lines.push(
      `import { ${optimizedId} as ${moduleName} } from "${optimizedSource}";`
    )
    if (node.type === 'ImportDeclaration') {
      getImportNamePairs(node, id, exports).forEach(
        ({ importedName, localName }) => {
          if (importedName === '*' || importedName === 'default') {
            lines.push(`const ${localName} = ${moduleName}.default`)
          } else {
            lines.push(`const ${localName} = ${moduleName}["${importedName}"]`)
          }
        }
      )
    } else if (node.type === 'ExportAllDeclaration') {
      const namedExports = exports.filter((e) => e !== 'default')
      lines.push(`const { ${namedExports.join(', ')} } = ${moduleName}`)
      lines.push(`export { ${namedExports.join(', ')} }`)
    }
  } else {
    const namedExports = exports.filter((e) => e !== 'default')
    // optimized esm dep
    if (node.type === 'ImportDeclaration') {
      getImportNamePairs(node, id, exports).forEach(
        ({ importedName, localName }) => {
          if (importedName === '*') {
            lines.push(
              `import { ${namedExports
                .map(
                  (e) => `${optimizedId}_${e} as __vite__${optimizedId}_${e}`
                )
                .join(', ')} } from "${optimizedSource}"`,
              `const ${localName} = Object.freeze({ ${namedExports
                .map((e) => `${e}: __vite__${optimizedId}_${e}`)
                .join(',')} })`
            )
          } else {
            lines.push(
              `import { ${optimizedId}_${importedName} as ${localName} } from "${optimizedSource}"`
            )
          }
        }
      )
    } else if (node.type === 'ExportAllDeclaration') {
      lines.push(
        `export { ${namedExports
          .map((e) => `${optimizedId}_${e} as ${e}`)
          .join(', ')} } from "${optimizedSource}"`
      )
    }
  }
  return lines.join('\n')
}

type ImportNameSpecifier = { importedName: string; localName: string }

function getImportNamePairs(
  node: ImportDeclaration,
  id: string,
  exports: string[]
): ImportNameSpecifier[] {
  const importNames: ImportNameSpecifier[] = []
  for (const spec of node.specifiers) {
    if (
      spec.type === 'ImportSpecifier' &&
      spec.imported.type === 'Identifier'
    ) {
      const importedName = spec.imported.name
      const localName = spec.local.name
      importNames.push({ importedName, localName })
    } else if (spec.type === 'ImportDefaultSpecifier') {
      if (exports.length && !exports.includes('default')) {
        throw new Error(`Module "${id}" has no default export.`)
      }
      importNames.push({
        importedName: 'default',
        localName: spec.local.name
      })
    } else if (spec.type === 'ImportNamespaceSpecifier') {
      importNames.push({ importedName: '*', localName: spec.local.name })
    }
  }
  return importNames
}
