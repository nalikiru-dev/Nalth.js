import path from 'path'
import { promises as fs } from 'fs'
import LRUCache from 'lru-cache'
import { Context } from 'koa'
import { Readable } from 'stream'
const getETag = require('etag')

const httpRE = /^https?:\/\//
export const isExternalUrl = (url: string) => httpRE.test(url)

const imageRE = /\.(png|jpe?g|gif|svg)(\?.*)?$/
const mediaRE = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
const fontsRE = /\.(woff2?|eot|ttf|otf)(\?.*)?$/i

/**
 * Check if a file is a static asset that vite can process.
 */
export const isStaticAsset = (file: string) => {
  return imageRE.test(file) || mediaRE.test(file) || fontsRE.test(file)
}

/**
 * Check if a request is an import from js (instead of fetch() or ajax requests)
 * A request qualifies as long as it's not from page (no ext or .html).
 * this is because non-js files can be transformed into js and import json
 * as well.
 */
export const isImportRequest = (ctx: Context) => {
  const referer = cleanUrl(ctx.get('referer'))
  return /\.\w+$/.test(referer) && !referer.endsWith('.html')
}

export const queryRE = /\?.*$/
export const hashRE = /\#.*$/

export const cleanUrl = (url: string) =>
  url.replace(hashRE, '').replace(queryRE, '')

interface CacheEntry {
  lastModified: number
  etag: string
  content: string
}

const moduleReadCache = new LRUCache<string, CacheEntry>({
  max: 10000
})

/**
 * Read a file with in-memory cache.
 * Also sets approrpriate headers and body on the Koa context.
 */
export async function cachedRead(
  ctx: Context | null,
  file: string
): Promise<string> {
  const lastModified = (await fs.stat(file)).mtimeMs
  const cached = moduleReadCache.get(file)
  if (ctx) {
    ctx.set('Cache-Control', 'no-cache')
    ctx.type = path.basename(file)
  }
  if (cached && cached.lastModified === lastModified) {
    if (ctx) {
      ctx.etag = cached.etag
      ctx.lastModified = new Date(cached.lastModified)
      if (ctx.get('If-None-Match') === ctx.etag) {
        ctx.status = 304
      }
      // still set the content for *.vue requests
      ctx.body = cached.content
    }
    return cached.content
  }
  const content = await fs.readFile(file, 'utf-8')
  const etag = getETag(content)
  moduleReadCache.set(file, {
    content,
    etag,
    lastModified
  })
  if (ctx) {
    ctx.etag = etag
    ctx.lastModified = new Date(lastModified)
    ctx.body = content
    ctx.status = 200
  }
  return content
}

/**
 * Read already set body on a Koa context and normalize it into a string.
 * Useful in post-processing middlewares.
 */
export async function readBody(
  stream: Readable | Buffer | string | null
): Promise<string | null> {
  if (stream instanceof Readable) {
    return new Promise((resolve, reject) => {
      let res = ''
      stream
        .on('data', (chunk) => (res += chunk))
        .on('error', reject)
        .on('end', () => {
          resolve(res)
        })
    })
  } else {
    return !stream || typeof stream === 'string' ? stream : stream.toString()
  }
}
