import path from 'path'
import { parse as parseUrl } from 'url'
import fs, { promises as fsp } from 'fs'
import mime from 'mime/lite'
import { Plugin } from '../plugin'
import { ResolvedConfig } from '../config'
import { cleanUrl } from '../utils'
import { FS_PREFIX } from '../constants'
import { PluginContext } from 'rollup'
import MagicString from 'magic-string'

export const assetUrlRE = /"__VITE_ASSET__(\w+)(?:__(.*)__)?"/g

/**
 * Also supports loading plain strings with import text from './foo.txt?raw'
 */
export function assetPlugin(config: ResolvedConfig): Plugin {
  return {
    name: 'vite:asset',

    resolveId(id) {
      if (!config.assetsInclude(cleanUrl(id))) {
        return
      }
      // imports to absolute urls pointing to files in /public
      // will fail to resolve in the main resolver. handle them here.
      const publicFile = checkPublicFile(id, config.root)
      if (publicFile) {
        return id
      }
    },

    async load(id) {
      if (!config.assetsInclude(cleanUrl(id))) {
        return
      }

      // raw requests, read from disk
      if (/(\?|&)raw\b/.test(id)) {
        const file = checkPublicFile(id, config.root) || cleanUrl(id)
        // raw query, read file and return as string
        return `export default ${JSON.stringify(
          await fsp.readFile(file, 'utf-8')
        )}`
      }

      const url = await fileToUrl(id, config, this)
      return `export default ${JSON.stringify(url)}`
    },

    renderChunk(code) {
      let match
      let s
      while ((match = assetUrlRE.exec(code))) {
        s = s || (s = new MagicString(code))
        const [full, fileHandle, postfix = ''] = match
        const outputFilepath =
          config.build.base + this.getFileName(fileHandle) + postfix
        s.overwrite(
          match.index,
          match.index + full.length,
          JSON.stringify(outputFilepath)
        )
      }
      if (s) {
        return {
          code: s.toString(),
          map: config.build.sourcemap ? s.generateMap({ hires: true }) : null
        }
      } else {
        return null
      }
    }
  }
}

export function checkPublicFile(url: string, root: string): string | undefined {
  // note if the file is in /public, the resolver would have returned it
  // as-is so it's not going to be a fully resolved path.
  if (!url.startsWith('/')) {
    return
  }
  const publicFile = path.posix.join(root, 'public', cleanUrl(url))
  if (fs.existsSync(publicFile)) {
    return publicFile
  } else {
    return
  }
}

export function fileToUrl(
  id: string,
  config: ResolvedConfig,
  ctx: PluginContext
) {
  if (config.command === 'serve') {
    return fileToDevUrl(id, config)
  } else {
    return fileToBuiltUrl(id, config, ctx)
  }
}

function fileToDevUrl(id: string, { root }: ResolvedConfig) {
  if (checkPublicFile(id, root)) {
    // in public dir, keep the url as-is
    return id
  }
  if (id.startsWith(root)) {
    // in project root, infer short public path
    return '/' + path.posix.relative(root, id)
  }
  // outside of project root, use absolute fs path
  // (this is speical handled by the serve static middleware
  return FS_PREFIX + id
}

const assetCache = new WeakMap<ResolvedConfig, Map<string, string>>()

/**
 * Register an asset to be emitted as part of the bundle (if necessary)
 * and returns the resolved public URL
 */
async function fileToBuiltUrl(
  id: string,
  config: ResolvedConfig,
  pluginContext: PluginContext,
  skipPublicCheck = false
): Promise<string> {
  if (!skipPublicCheck && checkPublicFile(id, config.root)) {
    return config.build.base + id.slice(1)
  }

  let cache = assetCache.get(config)
  if (!cache) {
    cache = new Map()
    assetCache.set(config, cache)
  }
  const cached = cache.get(id)
  if (cached) {
    return cached
  }

  const file = cleanUrl(id)
  const { search, hash } = parseUrl(id)
  const postfix = (search || '') + (hash || '')
  // TODO preserve fragment hash or queries
  const content = await fsp.readFile(file)

  let url
  if (
    config.build.lib ||
    (!file.endsWith('.svg') &&
      content.length < Number(config.build.assetsInlineLimit))
  ) {
    // base64 inlined as a string
    url = `data:${mime.getType(file)};base64,${content.toString('base64')}`
  } else {
    // emit as asset
    // rollup supports `import.meta.ROLLUP_FILE_URL_*`, but it generates code
    // that uses runtime url sniffing and it can be verbose when targeting
    // non-module format. For consistency, generate a marker here and replace
    // with resolved url strings in renderChunk.
    const fileId = pluginContext.emitFile({
      name: path.basename(file),
      type: 'asset',
      source: content
    })
    url = `__VITE_ASSET__${fileId}${postfix ? `__${postfix}__` : ``}`
  }

  cache.set(id, url)
  return url
}

export async function urlToBuiltUrl(
  url: string,
  importer: string,
  config: ResolvedConfig,
  pluginContext: PluginContext
): Promise<string> {
  if (checkPublicFile(url, config.root)) {
    return config.build.base + url.slice(1)
  }
  const file = url.startsWith('/')
    ? path.join(config.root, url)
    : path.join(path.dirname(importer), url)
  return fileToBuiltUrl(
    file,
    config,
    pluginContext,
    // skip public check since we just did it above
    true
  )
}
