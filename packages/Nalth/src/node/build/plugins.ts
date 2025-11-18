import { Plugin } from 'rollup'
import { resolve } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import type { ResolvedConfig } from '../types'
import { normalizePath, isExternalUrl } from '../utils'
import colors from 'picocolors'

export async function createRollupPlugins(config: ResolvedConfig): Promise<Plugin[]> {
  const plugins: Plugin[] = []

  // Security validation plugin
  plugins.push(createSecurityPlugin(config))

  // TypeScript support
  if (hasTypeScript(config.root)) {
    plugins.push(await createTypeScriptPlugin(config))
  }

  // CSS processing
  plugins.push(createCSSPlugin(config))

  // Asset handling
  plugins.push(createAssetPlugin(config))

  // JSON support
  plugins.push(createJSONPlugin())

  // Node resolve
  plugins.push(createResolvePlugin(config))

  // CommonJS support
  plugins.push(createCommonJSPlugin())

  // Minification
  if (config.build.minify !== false) {
    plugins.push(await createMinifyPlugin(config))
  }

  // HTML processing
  plugins.push(createHTMLPlugin(config))

  // Bundle analyzer (in development)
  if (!config.isProduction) {
    plugins.push(createBundleAnalyzerPlugin(config))
  }

  return plugins
}

function createSecurityPlugin(config: ResolvedConfig): Plugin {
  const securityViolations: Array<{ file: string; violations: string[] }> = []

  return {
    name: 'nalth:security',
    transform(code, id) {
      if (config.security.analysis?.enabled) {
        const violations: string[] = []
        const patterns = config.security.analysis.patterns || []

        for (const pattern of patterns) {
          const regex = new RegExp(pattern, 'gi')
          const matches = code.match(regex)
          if (matches) {
            violations.push(...matches)
          }
        }

        if (violations.length > 0) {
          securityViolations.push({ file: id, violations })
          
          const message = `Security violations in ${id}:\n${violations.map(v => `  - ${v}`).join('\n')}`
          
          if (config.security.analysis.failOnViolations) {
            this.error(message)
          } else {
            this.warn(message)
          }
        }
      }

      return null
    },
    generateBundle() {
      if (securityViolations.length > 0) {
        this.warn(colors.yellow(`🛡️ Security: ${securityViolations.length} files with violations`))
      }
    }
  }
}

async function createTypeScriptPlugin(config: ResolvedConfig): Promise<Plugin> {
  const { default: typescript } = await import('@rollup/plugin-typescript')
  
  return typescript({
    tsconfig: resolve(config.root, 'tsconfig.json'),
    sourceMap: config.build.sourcemap,
    inlineSources: config.build.sourcemap === 'inline'
  })
}

function createCSSPlugin(config: ResolvedConfig): Plugin {
  const cssModules = new Map<string, string>()

  return {
    name: 'nalth:css',
    load(id) {
      if (id.endsWith('.css')) {
        if (existsSync(id)) {
          const css = readFileSync(id, 'utf-8')
          const hash = createHash('md5').update(css).digest('hex').slice(0, 8)
          
          // Process CSS modules
          if (id.includes('.module.css')) {
            const processed = processCSSModules(css, hash)
            cssModules.set(id, processed.css)
            return `export default ${JSON.stringify(processed.classNames)}`
          }
          
          // Regular CSS
          cssModules.set(id, css)
          return `const css = ${JSON.stringify(css)}; 
                   const style = document.createElement('style');
                   style.textContent = css;
                   document.head.appendChild(style);
                   export default css;`
        }
      }
      return null
    },
    generateBundle() {
      // Emit CSS files
      for (const [id, css] of cssModules) {
        const fileName = id.split('/').pop()?.replace('.css', '') || 'style'
        this.emitFile({
          type: 'asset',
          fileName: `${fileName}.css`,
          source: css
        })
      }
    }
  }
}

function createAssetPlugin(config: ResolvedConfig): Plugin {
  return {
    name: 'nalth:assets',
    load(id) {
      // Handle asset imports
      if (/\.(png|jpe?g|gif|svg|webp|ico|pdf)(\?.*)?$/.test(id)) {
        const filePath = id.split('?')[0]
        if (existsSync(filePath)) {
          const fileName = filePath.split('/').pop() || 'asset'
          const referenceId = this.emitFile({
            type: 'asset',
            name: fileName,
            source: readFileSync(filePath)
          })
          return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`
        }
      }
      return null
    }
  }
}

function createJSONPlugin(): Plugin {
  return {
    name: 'nalth:json',
    transform(code, id) {
      if (id.endsWith('.json')) {
        try {
          const parsed = JSON.parse(code)
          return `export default ${JSON.stringify(parsed)}`
        } catch (e) {
          this.error(`Invalid JSON in ${id}: ${e}`)
        }
      }
      return null
    }
  }
}

function createResolvePlugin(config: ResolvedConfig): Plugin {
  return {
    name: 'nalth:resolve',
    resolveId(id, importer) {
      // Handle absolute imports
      if (id.startsWith('/')) {
        const resolved = resolve(config.root, id.slice(1))
        if (existsSync(resolved)) {
          return resolved
        }
      }

      // Handle relative imports
      if (importer && id.startsWith('.')) {
        const resolved = resolve(importer, '..', id)
        if (existsSync(resolved)) {
          return resolved
        }
        
        // Try with extensions
        for (const ext of ['.js', '.ts', '.jsx', '.tsx', '.json']) {
          const withExt = resolved + ext
          if (existsSync(withExt)) {
            return withExt
          }
        }
      }

      return null
    }
  }
}

function createCommonJSPlugin(): Plugin {
  return {
    name: 'nalth:commonjs',
    transform(code, id) {
      // Convert CommonJS to ES modules
      if (code.includes('module.exports') || code.includes('exports.')) {
        // Simple CommonJS conversion
        let transformed = code
          .replace(/module\.exports\s*=\s*/g, 'export default ')
          .replace(/exports\.(\w+)\s*=\s*/g, 'export const $1 = ')
        
        return transformed
      }
      return null
    }
  }
}

async function createMinifyPlugin(config: ResolvedConfig): Promise<Plugin> {
  const minifier = config.build.minify === true ? 'esbuild' : config.build.minify

  if (minifier === 'terser') {
    const { default: terser } = await import('@rollup/plugin-terser')
    return terser({
      compress: {
        drop_console: config.isProduction,
        drop_debugger: config.isProduction
      },
      mangle: config.isProduction
    })
  } else {
    // Use esbuild for minification
    return {
      name: 'nalth:esbuild-minify',
      renderChunk(code) {
        if (config.isProduction) {
          const { transformSync } = require('esbuild')
          const result = transformSync(code, {
            minify: true,
            target: 'es2020',
            format: 'esm'
          })
          return result.code
        }
        return null
      }
    }
  }
}

function createHTMLPlugin(config: ResolvedConfig): Plugin {
  return {
    name: 'nalth:html',
    generateBundle(options, bundle) {
      const htmlPath = resolve(config.root, 'index.html')
      if (!existsSync(htmlPath)) return

      let html = readFileSync(htmlPath, 'utf-8')
      
      // Inject security headers as meta tags
      const securityMetas = generateSecurityMetas(config)
      html = html.replace(/<head>/, `<head>\n${securityMetas}`)

      // Inject built assets
      const scripts: string[] = []
      const styles: string[] = []

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          scripts.push(`<script type="module" src="/${fileName}"></script>`)
        } else if (fileName.endsWith('.css')) {
          styles.push(`<link rel="stylesheet" href="/${fileName}">`)
        }
      }

      // Inject before closing head tag
      html = html.replace(
        /<\/head>/,
        `${styles.join('\n')}\n${scripts.join('\n')}\n</head>`
      )

      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: html
      })
    }
  }
}

function createBundleAnalyzerPlugin(config: ResolvedConfig): Plugin {
  return {
    name: 'nalth:bundle-analyzer',
    generateBundle(options, bundle) {
      const analysis = {
        chunks: [] as any[],
        totalSize: 0,
        timestamp: Date.now()
      }

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          const size = Buffer.byteLength(chunk.code, 'utf-8')
          analysis.chunks.push({
            fileName,
            size,
            modules: Object.keys(chunk.modules || {}),
            isEntry: chunk.isEntry,
            isDynamicEntry: chunk.isDynamicEntry
          })
          analysis.totalSize += size
        }
      }

      config.logger.info(colors.blue(`📊 Bundle Analysis:`))
      config.logger.info(colors.dim(`  Total size: ${formatBytes(analysis.totalSize)}`))
      config.logger.info(colors.dim(`  Chunks: ${analysis.chunks.length}`))
    }
  }
}

function hasTypeScript(root: string): boolean {
  return existsSync(resolve(root, 'tsconfig.json')) ||
         existsSync(resolve(root, 'src')) && 
         require('fs').readdirSync(resolve(root, 'src')).some((file: string) => 
           file.endsWith('.ts') || file.endsWith('.tsx')
         )
}

function processCSSModules(css: string, hash: string): { css: string; classNames: Record<string, string> } {
  const classNames: Record<string, string> = {}
  
  // Simple CSS modules processing
  const processed = css.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g, (match, className) => {
    const hashedName = `${className}_${hash}`
    classNames[className] = hashedName
    return `.${hashedName}`
  })

  return { css: processed, classNames }
}

function generateSecurityMetas(config: ResolvedConfig): string {
  const metas: string[] = []

  // CSP meta tag
  if (config.security.csp?.enabled && config.security.csp.directives) {
    const cspValue = Object.entries(config.security.csp.directives)
      .map(([directive, values]) => {
        const valueStr = Array.isArray(values) ? values.join(' ') : values
        return `${directive} ${valueStr}`
      })
      .join('; ')
    
    metas.push(`    <meta http-equiv="Content-Security-Policy" content="${cspValue}">`)
  }

  // Other security headers as meta tags
  if (config.security.headers?.referrerPolicy) {
    metas.push(`    <meta name="referrer" content="${config.security.headers.referrerPolicy}">`)
  }

  return metas.join('\n')
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
