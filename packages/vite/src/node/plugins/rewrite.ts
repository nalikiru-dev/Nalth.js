import _debug from 'debug'
import path from 'path'
import { Plugin, ResolvedConfig } from '..'
import chalk from 'chalk'
import { FILE_PREFIX } from './resolve'
import MagicString from 'magic-string'
import { init, parse, ImportSpecifier } from 'es-module-lexer'
import { isCSSRequest } from './css'
import slash from 'slash'

const debugRewrite = _debug('vite:rewrite')

const skipRE = /\.(map|json)$/
const canSkip = (id: string) => skipRE.test(id) || isCSSRequest(id)

/**
 * Server-only plugin that rewrites url imports (bare modules, css/asset imports)
 * so that they can be properly handled by the server.
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
 * css (referenced via <link>) may go through the trasnform pipeline:
 *
 *     ```js
 *     import './style.css'
 *     ```
 *     is rewritten to
 *     ```js
 *     import './style.css.js'
 *     ```
 */
export function rewritePlugin(config: ResolvedConfig): Plugin {
  return {
    name: 'vite:rewrite',
    async transform(source, importer) {
      const prettyImporter = path.relative(config.root, importer)
      if (canSkip(importer)) {
        debugRewrite(chalk.gray(`[skipped] ${prettyImporter}`))
        return null
      }

      await init
      let imports: ImportSpecifier[] = []
      try {
        imports = parse(source)[0]
      } catch (e) {
        console.warn(
          chalk.yellow(
            `[vite] failed to parse ${chalk.cyan(
              importer
            )} for import rewrite.\nIf you are using ` +
              `JSX, make sure to named the file with the .jsx extension.`
          )
        )
        return source
      }

      if (!imports.length) {
        debugRewrite(chalk.gray(`[no imports] ${prettyImporter}`))
        return source
      }

      let s: MagicString | undefined
      for (const { s: start, e: end, d: dynamicIndex } of imports) {
        let id = source.substring(start, end)
        const hasViteIgnore = /\/\*\s*@vite-ignore\s*\*\//.test(id)
        let hasLiteralDynamicId = false
        if (dynamicIndex >= 0) {
          // #998 remove comment
          id = id.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
          const literalIdMatch = id.match(/^\s*(?:'([^']+)'|"([^"]+)")\s*$/)
          if (literalIdMatch) {
            hasLiteralDynamicId = true
            id = literalIdMatch[1] || literalIdMatch[2]
          }
        }
        if (dynamicIndex === -1 || hasLiteralDynamicId) {
          // resolve bare imports:
          // e.g. `import 'foo'` -> `import '@fs/.../node_modules/foo/index.js`
          if (id[0] !== '/' && id[0] !== '.') {
            const resolved = await this.resolve(id, importer)
            if (resolved) {
              // resolved.id is now a file system path - convert it to url-like
              // this will be unwrapped in the reoslve plugin
              const prefixed = FILE_PREFIX + slash(resolved.id)
              debugRewrite(`${chalk.cyan(id)} -> ${chalk.gray(prefixed)}`)
              ;(s || (s = new MagicString(source))).overwrite(
                start,
                end,
                hasLiteralDynamicId ? `'${prefixed}'` : prefixed
              )
            } else {
              console.warn(
                chalk.yellow(`[vite] cannot resolve bare import "${id}".`)
              )
            }
          }

          // resolve CSS imports into js (so it differentiates from actual
          // CSS references from <link>)
          if (isCSSRequest(id)) {
            ;(s || (s = new MagicString(source))).appendLeft(end, '.js')
          }
        } else if (id !== 'import.meta' && !hasViteIgnore) {
          console.warn(
            chalk.yellow(`[vite] ignored dynamic import(${id}) in ${importer}.`)
          )
        }
      }

      // TODO env?
      // if (hasEnv) {
      //   debug(`    injecting import.meta.env for ${importer}`)
      //   s.prepend(
      //     `import __VITE_ENV__ from "${envPublicPath}"; ` +
      //       `import.meta.env = __VITE_ENV__; `
      //   )
      //   hasReplaced = true
      // }

      if (!s) {
        debugRewrite(chalk.gray(`[not import rewritten] ${prettyImporter}`))
      } else {
        debugRewrite(`[ok] ${chalk.gray(prettyImporter)}`)
      }

      // TODO source map
      return s ? s.toString() : source
    }
  }
}
