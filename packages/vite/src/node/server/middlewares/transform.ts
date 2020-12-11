import _debug from 'debug'
import getEtag from 'etag'
import fs, { promises as fsp } from 'fs'
import { SourceDescription, SourceMap } from 'rollup'
import { ServerContext } from '..'
import { NextHandleFunction } from 'connect'
import { cssPreprocessLangRE, isCSSRequest } from '../../plugins/css'
import chalk from 'chalk'
import { cleanUrl, prettifyUrl, timeFrom } from '../../utils'
import { send } from '../send'

const debugUrl = _debug('vite:url')
const debugLoad = _debug('vite:load')
const debugTransform = _debug('vite:transform')
const debugCache = _debug('vite:cache')
const isDebug = !!process.env.DEBUG

export interface TransformResult {
  code: string
  map: SourceMap | null
  etag: string
}

export async function transformFile(
  url: string,
  { config: { root }, container, transformCache, fileToUrlMap }: ServerContext
): Promise<TransformResult | null> {
  const prettyUrl = isDebug ? prettifyUrl(url, root) : ''
  const cached = transformCache.get(url)
  if (cached) {
    isDebug && debugCache(`[memory] ${prettyUrl}`)
    return cached
  }

  // resolve
  const resolved = await container.resolveId(url)
  if (!resolved) {
    isDebug && debugUrl(`not resolved: ${prettyUrl}`)
    return null
  }
  const id = resolved.id
  let file = cleanUrl(id)
  // if this is a css proxy module, strip css.js postfix so it points to the
  // original css file
  if (cssPreprocessLangRE.test(file.slice(0, -3))) {
    file = file.slice(0, -3)
  }
  if (isDebug) {
    // this is only useful when showing the full paths but it can get very
    // spammy so it's disabled by default
    // debugUrl(`${chalk.green(url)} -> ${chalk.dim(id)}`)
  }

  // record file -> url relationships after successful resolve
  fileToUrlMap.set(file, url)

  let code = null
  let map: SourceDescription['map'] = null

  // load
  const loadStart = Date.now()
  const loadResult = await container.load(id)
  if (loadResult == null) {
    // try fallback loading it from fs as string
    // if the file is a binary, there should be a plugin that already loaded it
    // as string
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      code = await fsp.readFile(file, 'utf-8')
      isDebug && debugLoad(`${timeFrom(loadStart)} [fs] ${prettyUrl}`)
    }
  } else {
    isDebug && debugLoad(`${timeFrom(loadStart)} [plugin] ${prettyUrl}`)
    if (typeof loadResult === 'object') {
      code = loadResult.code
      map = loadResult.map
    } else {
      code = loadResult
    }
  }
  if (code == null) {
    isDebug && debugLoad(`${chalk.red(`[FAIL]`)} ${prettyUrl}`)
    return null
  }

  // transform
  const ttransformStart = Date.now()
  const transformResult = await container.transform(code, id)
  if (
    transformResult == null ||
    (typeof transformResult === 'object' && !transformResult.code)
  ) {
    // no transform applied, keep code as-is
    isDebug &&
      debugTransform(
        timeFrom(ttransformStart) + chalk.dim(` [skipped] ${prettyUrl}`)
      )
  } else {
    isDebug && debugTransform(`${timeFrom(ttransformStart)} ${prettyUrl}`)
    if (typeof transformResult === 'object') {
      code = transformResult.code!
      map = transformResult.map
    } else {
      code = transformResult
    }
  }

  const result = {
    code,
    map,
    etag: getEtag(code, { weak: true })
  } as TransformResult
  transformCache.set(url, result)
  return result
}

export function transformMiddleware(
  context: ServerContext
): NextHandleFunction {
  const {
    config: { root },
    watcher,
    transformCache,
    fileToUrlMap
  } = context

  watcher.on('change', (file) => {
    const url = fileToUrlMap.get(file)
    if (url) {
      isDebug &&
        debugCache(`busting transform cache for ${prettifyUrl(url, root)}`)
      transformCache.delete(url)
    }
  })

  return async (req, res, next) => {
    if (req.method !== 'GET' || req.url === '/') {
      return next()
    }

    // check if we can return 304 early
    const ifNoneMatch = req.headers['if-none-match']
    if (ifNoneMatch && transformCache.get(req.url!)?.etag === ifNoneMatch) {
      isDebug && debugCache(`[304] ${prettifyUrl(req.url!, root)}`)
      res.statusCode = 304
      return res.end()
    }

    const isSourceMap = req.url!.endsWith('.map')
    // since we generate source map references, handle those requests here
    if (isSourceMap) {
      const originalUrl = req.url!.replace(/\.map$/, '')
      const transformed = transformCache.get(originalUrl)
      if (transformed && transformed.map) {
        return send(req, res, JSON.stringify(transformed.map), 'json')
      }
    }

    // we only apply the transform pipeline to:
    // - requests that initiate from ESM imports (any extension)
    // - CSS (even not from ESM)
    // - Source maps (only for resolving)
    const isCSS = isCSSRequest(req.url!)
    if (
      // esm imports accept */* in most browsers
      req.headers['accept'] === '*/*' ||
      req.headers['sec-fetch-dest'] === 'script' ||
      isSourceMap ||
      isCSS
    ) {
      // resolve, load and transform using the plugin container
      try {
        const result = await transformFile(req.url!, context)
        if (result) {
          const type = isCSS ? 'css' : 'js'
          const hasMap = !!(result.map && result.map.mappings)
          return send(req, res, result.code, type, result.etag, hasMap)
        }
      } catch (e) {
        return next(e)
      }
    }

    next()
  }
}
