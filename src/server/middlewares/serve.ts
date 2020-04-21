import { Middleware } from '../index'

export const serveMiddleware: Middleware = ({ cwd, app }) => {
  app.use(require('koa2-history-api-fallback')())
  app.use(require('koa-static')(cwd))
}
