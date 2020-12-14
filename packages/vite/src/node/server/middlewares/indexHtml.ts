import fs from 'fs'
import getEtag from 'etag'
import path from 'path'
import { Connect } from 'types/connect'
import { Plugin } from '../../config'
import {
  applyHtmlTransforms,
  IndexHtmlTransformHook,
  resolveHtmlTransforms
} from '../../plugins/html'
import { ViteDevServer } from '../..'
import { send } from '../send'
import { CLIENT_PUBLIC_PATH } from '../../constants'

const devHtmlHook: IndexHtmlTransformHook = () => {
  return [{ tag: 'script', attrs: { type: 'module', src: CLIENT_PUBLIC_PATH } }]
}

export function indexHtmlMiddleware(
  server: ViteDevServer,
  plugins: readonly Plugin[]
): Connect.NextHandleFunction {
  const [preHooks, postHooks] = resolveHtmlTransforms(plugins)
  const filename = path.join(server.config.root, 'index.html')

  // cache the transform in the closure
  let html = ''
  let etag = ''
  let lastModified = 0

  return async (req, res, next) => {
    // spa-fallback always redirects to /index.html
    if (
      req.url === '/index.html' &&
      req.headers['sec-fetch-dest'] !== 'script' &&
      fs.existsSync(filename)
    ) {
      const stats = fs.statSync(filename)
      if (stats.mtimeMs !== lastModified) {
        lastModified = stats.mtimeMs
        html = fs.readFileSync(filename, 'utf-8')
        try {
          // apply transforms
          html = await applyHtmlTransforms(
            html,
            [...preHooks, devHtmlHook, ...postHooks],
            server
          )
          etag = getEtag(html, { weak: true })
        } catch (e) {
          return next(e)
        }
      }

      return send(req, res, html, 'html', etag)
    }

    next()
  }
}
