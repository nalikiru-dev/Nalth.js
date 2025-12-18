/**
 * Nalth SRI (Subresource Integrity) Plugin
 * 
 * Automatically generates SHA-384 integrity hashes for script and style assets,
 * injecting `integrity` and `crossorigin` attributes into the HTML.
 */

import crypto from 'node:crypto'
import type { Plugin, IndexHtmlTransformContext } from 'vite'

export interface SRIPluginOptions {
    /** Hash algorithm (default: 'sha384') */
    algorithm?: 'sha256' | 'sha384' | 'sha512'
    /** Enable for dev server (default: false) */
    enableInDev?: boolean
    /** Crossorigin attribute value (default: 'anonymous') */
    crossorigin?: 'anonymous' | 'use-credentials' | ''
}

/**
 * Compute SRI hash for given content
 */
function computeIntegrity(content: string | Buffer, algorithm: string): string {
    const hash = crypto.createHash(algorithm)
    hash.update(content)
    return `${algorithm}-${hash.digest('base64')}`
}

/**
 * Nalth SRI Plugin
 * 
 * @example
 * ```ts
 * import { nalthSRI } from 'nalth/plugins/sri'
 * 
 * export default defineConfig({
 *   plugins: [nalthSRI()]
 * })
 * ```
 */
export function nalthSRI(options: SRIPluginOptions = {}): Plugin {
    const {
        algorithm = 'sha384',
        enableInDev = false,
        crossorigin = 'anonymous'
    } = options

    let isDev = false

    return {
        name: 'nalth:sri',

        configResolved(config) {
            isDev = config.command === 'serve'
        },

        transformIndexHtml: {
            order: 'post',
            async handler(html: string, ctx: IndexHtmlTransformContext) {
                // Skip in dev mode unless explicitly enabled
                if (isDev && !enableInDev) return html

                // Only process if we have a bundle (production build)
                if (!ctx.bundle) return html

                // Process script tags
                html = html.replace(
                    /<script([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/gi,
                    (match, before, src, after) => {
                        // Skip if already has integrity
                        if (/integrity=/i.test(match)) return match

                        // Find the chunk in the bundle
                        const chunkName = src.replace(/^\//, '')
                        const chunk = ctx.bundle?.[chunkName]

                        if (chunk && 'code' in chunk) {
                            const integrity = computeIntegrity(chunk.code, algorithm)
                            const crossoriginAttr = crossorigin ? ` crossorigin="${crossorigin}"` : ''
                            return `<script${before} src="${src}"${after} integrity="${integrity}"${crossoriginAttr}>`
                        }

                        return match
                    }
                )

                // Process link tags (stylesheets)
                html = html.replace(
                    /<link([^>]*)\shref=["']([^"']+\.css)["']([^>]*)>/gi,
                    (match, before, href, after) => {
                        // Skip if already has integrity
                        if (/integrity=/i.test(match)) return match

                        const chunkName = href.replace(/^\//, '')
                        const chunk = ctx.bundle?.[chunkName]

                        if (chunk && 'source' in chunk) {
                            const content = typeof chunk.source === 'string'
                                ? chunk.source
                                : Buffer.from(chunk.source)
                            const integrity = computeIntegrity(content, algorithm)
                            const crossoriginAttr = crossorigin ? ` crossorigin="${crossorigin}"` : ''
                            return `<link${before} href="${href}"${after} integrity="${integrity}"${crossoriginAttr}>`
                        }

                        return match
                    }
                )

                return html
            }
        }
    }
}

export default nalthSRI
