import MagicString from 'magic-string'
import { TransformResult } from 'rollup'
import { ResolvedConfig } from '../config'
import { Plugin } from '../plugin'
import { isCSSRequest } from './css'

/**
 * Build only.
 * Server define is injected as runtime variables by clientInjection plugin
 * to avoid transform cost during dev.
 */
export function buildDefinePlugin(config: ResolvedConfig): Plugin {
  const userDefine: Record<string, string> = {}
  for (const key in config.define) {
    userDefine[key] = JSON.stringify(config.define[key])
  }

  const individualEnvKeys: Record<string, string> = {}
  const env = {
    ...config.env,
    SSR: !!config.build.ssr
  }
  for (const key in env) {
    individualEnvKeys[`import.meta.env.${key}`] = JSON.stringify(
      config.env[key]
    )
  }

  const replacements: Record<string, string | undefined> = {
    'process.env.NODE_ENV': JSON.stringify(config.mode),
    'process.env.': `({}).`,
    ...userDefine,
    ...individualEnvKeys,
    'import.meta.env.': `({}).`,
    'import.meta.env': JSON.stringify(config.env),
    'import.meta.hot': `false`
  }

  const pattern = new RegExp(
    '\\b(' +
      Object.keys(replacements)
        .map((str) => {
          return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
        })
        .join('|') +
      ')\\b',
    'g'
  )

  return {
    name: 'vite:define',
    transform(code, id) {
      if (
        // exclude css and static assets for performance
        isCSSRequest(id) ||
        config.assetsInclude(id)
      ) {
        return
      }

      const s = new MagicString(code)
      let hasReplaced = false
      let match

      while ((match = pattern.exec(code))) {
        hasReplaced = true
        const start = match.index
        const end = start + match[0].length
        const replacement = '' + replacements[match[1]]
        s.overwrite(start, end, replacement)
      }

      if (!hasReplaced) {
        return null
      }

      const result: TransformResult = { code: s.toString() }
      if (config.build.sourcemap) {
        result.map = s.generateMap({ hires: true })
      }
      return result
    }
  }
}
