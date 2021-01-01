import path from 'path'

export const SUPPORTED_EXTS = ['.mjs', '.js', '.ts', '.jsx', '.tsx']

export const DEP_CACHE_DIR = `.vite`

/**
 * Prefix for resolved fs paths, since windows paths may not be valid as URLs.
 */
export const FS_PREFIX = `/@fs/`

/**
 * Prefix for resolved Ids that are not valid browser import specifiers
 */
export const VALID_ID_PREFIX = `/@id/`

export const CLIENT_PUBLIC_PATH = `/@vite/client`
// eslint-disable-next-line
export const CLIENT_ENTRY = require.resolve('vite/dist/client/client.js')
export const CLIENT_DIR = path.dirname(CLIENT_ENTRY)

export const DEFAULT_ASSETS_RE = new RegExp(
  `\\.(` +
    // images
    `png|jpe?g|gif|svg|ico|webp|` +
    // media
    `mp4|webm|ogg|mp3|wav|flac|aac|` +
    // fonts
    `woff2?|eot|ttf|otf` +
    `)(\\?.*)?$`
)

export const DEP_VERSION_RE = /[\?&](v=[\w\.-]+)\b/
