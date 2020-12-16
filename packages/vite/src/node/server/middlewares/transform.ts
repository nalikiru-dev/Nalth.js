import { ViteDevServer } from '..'
import { Connect } from 'types/connect'
import { isCSSRequest } from '../../plugins/css'
import {
  cleanUrl,
  createDebugger,
  prettifyUrl,
  removeTimestampQuery
} from '../../utils'
import { send } from '../send'
import { transformRequest } from '../transformRequest'
import { isHTMLProxy } from '../../plugins/html'

const debugCache = createDebugger('vite:cache')
const isDebug = !!process.env.DEBUG

export function transformMiddleware(
  server: ViteDevServer
): Connect.NextHandleFunction {
  const {
    config: { root },
    moduleGraph
  } = server

  return async (req, res, next) => {
    const url = removeTimestampQuery(req.url!)
    if (req.method !== 'GET' || req.url === '/') {
      return next()
    }

    try {
      const isSourceMap = cleanUrl(url).endsWith('.map')
      // since we generate source map references, handle those requests here
      if (isSourceMap) {
        const originalUrl = url.replace(/\.map($|\?)/, '$1')
        const map = (await moduleGraph.getModuleByUrl(originalUrl))
          ?.transformResult?.map
        if (map) {
          return send(req, res, JSON.stringify(map), 'json')
        } else {
          res.statusCode = 404
          return res.end()
        }
      }

      // we only apply the transform pipeline to:
      // - requests that initiate from ESM imports (any extension)
      // - CSS (even not from ESM)
      // - Source maps (only for resolving)
      const isCSS = isCSSRequest(url)
      const isHTMLInlineModule = isHTMLProxy(url)
      if (
        // esm imports accept */* in most browsers
        req.headers['accept'] === '*/*' ||
        req.headers['sec-fetch-dest'] === 'script' ||
        isSourceMap ||
        isCSS ||
        isHTMLInlineModule
      ) {
        // check if we can return 304 early
        const ifNoneMatch = req.headers['if-none-match']
        if (
          ifNoneMatch &&
          (await moduleGraph.getModuleByUrl(url))?.transformResult?.etag ===
            ifNoneMatch
        ) {
          isDebug && debugCache(`[304] ${prettifyUrl(url, root)}`)
          res.statusCode = 304
          return res.end()
        }

        // resolve, load and transform using the plugin container
        const result = await transformRequest(url, server)
        if (result) {
          const type = isCSS ? 'css' : 'js'
          return send(req, res, result.code, type, result.etag, result.map)
        }
      }
    } catch (e) {
      return next(e)
    }

    next()
  }
}
