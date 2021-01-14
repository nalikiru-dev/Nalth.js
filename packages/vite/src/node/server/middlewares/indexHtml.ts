import fs from 'fs'
import path from 'path'
import { Connect } from 'types/connect'
import { Plugin } from '../../plugin'
import {
  scriptModuleRE,
  applyHtmlTransforms,
  IndexHtmlTransformHook,
  resolveHtmlTransforms,
  htmlCommentRE
} from '../../plugins/html'
import { ViteDevServer } from '../..'
import { send } from '../send'
import { CLIENT_PUBLIC_PATH, FS_PREFIX } from '../../constants'
import { cleanUrl } from '../../utils'

const devHtmlHook: IndexHtmlTransformHook = (html, { path }) => {
  let index = -1
  const comments: string[] = []

  html = html
    .replace(htmlCommentRE, (m) => {
      comments.push(m)
      return `<!--VITE_COMMENT_${comments.length - 1}-->`
    })
    .replace(scriptModuleRE, (_match, _openTag, script) => {
      index++
      if (script) {
        // convert inline <script type="module"> into imported modules
        return `<script type="module" src="${path}?html-proxy&index=${index}.js"></script>`
      }
      return _match
    })
    .replace(/<!--VITE_COMMENT_(\d+)-->/g, (_, i) => comments[i])

  return {
    html,
    tags: [
      {
        tag: 'script',
        attrs: { type: 'module', src: CLIENT_PUBLIC_PATH },
        injectTo: 'head-prepend'
      }
    ]
  }
}

export function indexHtmlMiddleware(
  server: ViteDevServer,
  plugins: readonly Plugin[]
): Connect.NextHandleFunction {
  const [preHooks, postHooks] = resolveHtmlTransforms(plugins)

  return async (req, res, next) => {
    const url = req.url && cleanUrl(req.url)
    // spa-fallback always redirects to /index.html
    if (url?.endsWith('.html') && req.headers['sec-fetch-dest'] !== 'script') {
      let filename
      if (url.startsWith(FS_PREFIX)) {
        filename = url.slice(FS_PREFIX.length)
      } else {
        filename = path.join(server.config.root, url.slice(1))
      }
      if (fs.existsSync(filename)) {
        try {
          let html = fs.readFileSync(filename, 'utf-8')
          // apply transforms
          html = await applyHtmlTransforms(
            html,
            url,
            filename,
            [...preHooks, devHtmlHook, ...postHooks],
            server
          )
          return send(req, res, html, 'html')
        } catch (e) {
          return next(e)
        }
      }
    }
    next()
  }
}
