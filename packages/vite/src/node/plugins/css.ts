import {
  // createDebugger,
  isExternalUrl,
  asyncReplace,
  cleanUrl,
  generateCodeFrame,
  isDataUrl,
  isObject,
  normalizePath
} from '../utils'
import path from 'path'
import { Plugin } from '../plugin'
import { ResolvedConfig } from '../config'
import postcssrc from 'postcss-load-config'
import merge from 'merge-source-map'
import {
  NormalizedOutputOptions,
  RenderedChunk,
  RollupError,
  SourceMap
} from 'rollup'
import { dataToEsm } from '@rollup/pluginutils'
import chalk from 'chalk'
import { CLIENT_PUBLIC_PATH, FS_PREFIX } from '../constants'
import {
  ProcessOptions,
  Result,
  Plugin as PostcssPlugin,
  PluginCreator
} from 'postcss'
import { ViteDevServer } from '../'
import { assetUrlRE, urlToBuiltUrl } from './asset'
import MagicString from 'magic-string'

// const debug = createDebugger('vite:css')

export interface CSSOptions {
  /**
   * https://github.com/css-modules/postcss-modules
   */
  modules?: CSSModulesOptions | false
  preprocessorOptions?: Record<string, any>
  postcss?:
    | string
    | (ProcessOptions & {
        plugins?: PostcssPlugin[]
      })
}

export interface CSSModulesOptions {
  scopeBehaviour?: 'global' | 'local'
  globalModulePaths?: string[]
  generateScopedName?:
    | string
    | ((name: string, filename: string, css: string) => string)
  hashPrefix?: string
  /**
   * default: 'camelCaseOnly'
   */
  localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
}

const cssLangs = `\\.(css|less|sass|scss|styl|stylus|postcss)($|\\?)`
const cssLangRE = new RegExp(cssLangs)
const cssModuleRE = new RegExp(`\\.module${cssLangs}`)
const directRequestRE = /(\?|&)direct\b/

export const isCSSRequest = (request: string) =>
  cssLangRE.test(request) && !directRequestRE.test(request)

export const isDirectCSSRequest = (request: string) =>
  cssLangRE.test(request) && directRequestRE.test(request)

const cssModulesCache = new WeakMap<
  ResolvedConfig,
  Map<string, Record<string, string>>
>()

export const chunkToEmittedCssFileMap = new WeakMap<RenderedChunk, string>()

/**
 * Plugin applied before user plugins
 */
export function cssPlugin(config: ResolvedConfig): Plugin {
  let server: ViteDevServer
  const moduleCache = new Map<string, Record<string, string>>()
  cssModulesCache.set(config, moduleCache)

  return {
    name: 'vite:css',

    configureServer(_server) {
      server = _server
    },

    async transform(raw, id) {
      if (!cssLangRE.test(id)) {
        return
      }

      const urlReplacer: CssUrlReplacer = server
        ? (url, importer) => {
            if (url.startsWith('/')) return url
            const filePath = normalizePath(
              path.resolve(path.dirname(importer || id), url)
            )
            if (filePath.startsWith(config.root)) {
              return filePath.slice(config.root.length)
            } else {
              return `${FS_PREFIX}${filePath}`
            }
          }
        : (url, importer) => {
            return urlToBuiltUrl(url, importer || id, config, this)
          }

      const { code: css, modules, deps } = await compileCSS(
        id,
        raw,
        config,
        urlReplacer
      )
      if (modules) {
        moduleCache.set(id, modules)
      }

      // dev
      if (server) {
        // server only logic for handling CSS @import dependency hmr
        const { moduleGraph } = server
        const thisModule = moduleGraph.getModuleById(id)!

        // CSS modules cannot self-accept since it exports values
        const isSelfAccepting = !modules
        if (deps) {
          // record deps in the module graph so edits to @import css can trigger
          // main import to hot update
          const depModules = new Set(
            [...deps].map((file) => moduleGraph.createFileOnlyEntry(file))
          )
          moduleGraph.updateModuleInfo(
            thisModule,
            depModules,
            // The root CSS proxy module is self-accepting and should not
            // have an explicit accept list
            new Set(),
            isSelfAccepting
          )
          for (const file of deps) {
            this.addWatchFile(file)
          }
        } else {
          thisModule.isSelfAccepting = isSelfAccepting
        }
      }

      return css
    }
  }
}

/**
 * Plugin applied after user plugins
 */
export function cssPostPlugin(config: ResolvedConfig): Plugin {
  const styles = new Map<string, string>()
  const emptyChunks = new Set<string>()
  const moduleCache = cssModulesCache.get(config)!

  // when there are multiple rollup outputs and extracting CSS, only emit once,
  // since output formats have no effect on the generated CSS.
  const outputToExtractedCSSMap = new Map<NormalizedOutputOptions, string>()
  let hasEmitted = false

  return {
    name: 'vite:css-post',

    transform(css, id, ssr) {
      if (!cssLangRE.test(id)) {
        return
      }

      const modules = moduleCache.get(id)
      const modulesCode =
        modules && dataToEsm(modules, { namedExports: true, preferConst: true })

      if (config.command === 'serve') {
        if (isDirectCSSRequest(id)) {
          return css
        } else {
          // server only
          if (ssr) {
            return modulesCode || `export default ${JSON.stringify(css)}`
          }
          return [
            `import { updateStyle, removeStyle } from ${JSON.stringify(
              CLIENT_PUBLIC_PATH
            )}`,
            `const id = ${JSON.stringify(id)}`,
            `const css = ${JSON.stringify(css)}`,
            `updateStyle(id, css)`,
            // css modules exports change on edit so it can't self accept
            `${modulesCode || `import.meta.hot.accept()\nexport default css`}`,
            `import.meta.hot.prune(() => removeStyle(id))`
          ].join('\n')
        }
      }

      // build CSS handling ----------------------------------------------------

      // record css
      styles.set(id, css)

      return {
        code: modulesCode || `export default ${JSON.stringify(css)}`,
        map: null,
        // avoid the css module from being tree-shaken so that we can retrieve
        // it in renderChunk()
        moduleSideEffects: 'no-treeshake'
      }
    },

    async renderChunk(code, chunk, opts) {
      let chunkCSS = ''
      const ids = Object.keys(chunk.modules)
      for (const id of ids) {
        if (styles.has(id)) {
          chunkCSS += styles.get(id)
        }
      }

      if (!chunkCSS) {
        return null
      }

      // replace asset url references with resolved url
      chunkCSS = chunkCSS.replace(assetUrlRE, (_, fileId, postfix = '') => {
        return config.build.base + this.getFileName(fileId) + postfix
      })

      if (config.build.cssCodeSplit) {
        if (!code.trim()) {
          // this is a shared CSS-only chunk that is empty.
          emptyChunks.add(chunk.fileName)
        }
        // minify
        if (config.build.minify) {
          chunkCSS = await minifyCSS(chunkCSS, config)
        }
        if (opts.format === 'es') {
          // emit corresponding css file
          const fileHandle = this.emitFile({
            name: chunk.name + '.css',
            type: 'asset',
            source: chunkCSS
          })
          chunkToEmittedCssFileMap.set(chunk, fileHandle)
        } else if (!config.build.ssr) {
          // legacy build, inline css
          const style = `__vite_style__`
          const injectCode =
            `var ${style} = document.createElement('style');` +
            `${style}.innerHTML = ${JSON.stringify(chunkCSS)};` +
            `document.head.appendChild(${style});`
          if (config.build.sourcemap) {
            const s = new MagicString(code)
            s.prepend(injectCode)
            return {
              code: s.toString(),
              map: s.generateMap({ hires: true })
            }
          } else {
            return { code: injectCode + code }
          }
        }
        return {
          code,
          map: null
        }
      } else {
        const extractedCss = outputToExtractedCSSMap.get(opts) || ''
        outputToExtractedCSSMap.set(opts, extractedCss + chunkCSS)
        return null
      }
    },

    async generateBundle(opts, bundle) {
      // remove empty css chunks and their imports
      if (emptyChunks.size) {
        emptyChunks.forEach((fileName) => {
          delete bundle[fileName]
        })
        const emptyChunkFiles = [...emptyChunks].join('|').replace(/\./g, '\\.')
        const emptyChunkRE = new RegExp(
          `\\bimport\\s*"[^"]*(?:${emptyChunkFiles})";\n?`,
          'g'
        )
        for (const file in bundle) {
          const chunk = bundle[file]
          if (chunk.type === 'chunk') {
            chunk.code = chunk.code.replace(emptyChunkRE, '')
          }
        }
      }

      let extractedCss = outputToExtractedCSSMap.get(opts)
      if (extractedCss && !hasEmitted) {
        hasEmitted = true
        // minify css
        if (config.build.minify) {
          extractedCss = await minifyCSS(extractedCss, config)
        }
        this.emitFile({
          name: 'style.css',
          type: 'asset',
          source: extractedCss
        })
      }
    }
  }
}

async function compileCSS(
  id: string,
  code: string,
  config: ResolvedConfig,
  urlReplacer: CssUrlReplacer
): Promise<{
  code: string
  map?: SourceMap
  ast?: Result
  modules?: Record<string, string>
  deps?: Set<string>
}> {
  const { modules: modulesOptions, preprocessorOptions } = config.css || {}
  const isModule = modulesOptions !== false && cssModuleRE.test(id)
  // although at serve time it can work without processing, we do need to
  // crawl them in order to register watch dependencies.
  const needInlineImport = code.includes('@import')
  const hasUrl = cssUrlRE.test(code)
  const postcssConfig = await resolvePostcssConfig(config)
  const lang = id.match(cssLangRE)?.[1]

  // 1. plain css that needs no processing
  if (
    lang === 'css' &&
    !postcssConfig &&
    !isModule &&
    !needInlineImport &&
    !hasUrl
  ) {
    return { code }
  }

  let map: SourceMap | undefined
  let modules: Record<string, string> | undefined
  const deps = new Set<string>()

  // 2. pre-processors: sass etc.
  if (lang && lang in preProcessors) {
    const preProcessor = preProcessors[lang as PreprocessLang]
    let opts = (preprocessorOptions && preprocessorOptions[lang]) || {}
    // support @import from node dependencies by default
    switch (lang) {
      case 'scss':
      case 'sass':
        opts = {
          includePaths: ['node_modules'],
          ...opts
        }
        break
      case 'less':
      case 'styl':
      case 'stylus':
        opts = {
          paths: ['node_modules'],
          ...opts
        }
    }
    // important: set this for relative import resolving
    opts.filename = cleanUrl(id)
    const preprocessResult = await preProcessor(code, undefined, opts)
    if (preprocessResult.errors.length) {
      throw preprocessResult.errors[0]
    }

    code = preprocessResult.code
    map = preprocessResult.map as SourceMap
    if (preprocessResult.deps) {
      preprocessResult.deps.forEach((dep) => {
        // sometimes sass registers the file itself as a dep
        if (dep !== opts.filename) {
          deps.add(dep)
        }
      })
    }
  }

  // 3. postcss
  const postcssOptions = (postcssConfig && postcssConfig.options) || {}
  const postcssPlugins =
    postcssConfig && postcssConfig.plugins ? postcssConfig.plugins.slice() : []

  if (needInlineImport) {
    postcssPlugins.unshift((await import('postcss-import')).default())
  }
  postcssPlugins.push(
    UrlRewritePostcssPlugin({
      replacer: urlReplacer
    }) as PostcssPlugin
  )

  if (isModule) {
    postcssPlugins.unshift(
      (await import('postcss-modules')).default({
        localsConvention: 'camelCaseOnly',
        ...modulesOptions,
        getJSON(_: string, _modules: Record<string, string>) {
          modules = _modules
        }
      })
    )
  }

  if (!postcssPlugins.length) {
    return {
      code,
      map
    }
  }

  // postcss is an unbundled dep and should be lazy imported
  const postcssResult = await (await import('postcss'))
    .default(postcssPlugins)
    .process(code, {
      ...postcssOptions,
      to: id,
      from: id,
      map: {
        inline: false,
        annotation: false,
        prev: map
      }
    })

  // record CSS dependencies from @imports
  for (const message of postcssResult.messages) {
    if (message.type === 'dependency') {
      deps.add(message.file as string)
    } else if (message.type === 'warning') {
      let msg = `[vite:css] ${message.text}`
      if (message.line && message.column) {
        msg += `\n${generateCodeFrame(code, {
          line: message.line,
          column: message.column
        })}`
      }
      config.logger.warn(chalk.yellow(msg))
    }
  }

  return {
    ast: postcssResult,
    code: postcssResult.css,
    map: postcssResult.map as any,
    modules,
    deps
  }
}

interface PostCSSConfigResult {
  options: ProcessOptions
  plugins: PostcssPlugin[]
}

let cachedPostcssConfig: PostCSSConfigResult | null | undefined

async function resolvePostcssConfig(
  config: ResolvedConfig
): Promise<PostCSSConfigResult | null> {
  if (cachedPostcssConfig !== undefined) {
    return cachedPostcssConfig
  }

  // inline postcss config via vite config
  const inlineOptions = config.css?.postcss
  if (isObject(inlineOptions)) {
    const result = {
      options: { ...inlineOptions },
      plugins: inlineOptions.plugins || []
    }
    delete result.options.plugins
    return (cachedPostcssConfig = result)
  }

  try {
    const searchPath =
      typeof inlineOptions === 'string' ? inlineOptions : config.root
    return (cachedPostcssConfig = await postcssrc({}, searchPath))
  } catch (e) {
    if (!/No PostCSS Config found/.test(e.message)) {
      throw e
    }
    return (cachedPostcssConfig = null)
  }
}

// Preprocessor support. This logic is largely replicated from @vue/compiler-sfc

type PreprocessLang = 'less' | 'sass' | 'scss' | 'styl' | 'stylus'

type StylePreprocessor = (
  source: string,
  map: SourceMap | undefined,
  options: {
    [key: string]: any
    additionalData?: string | ((source: string, filename: string) => string)
    filename: string
  }
) => StylePreprocessorResults | Promise<StylePreprocessorResults>

export interface StylePreprocessorResults {
  code: string
  map?: object
  errors: RollupError[]
  deps: string[]
}

function loadPreprocessor(lang: PreprocessLang) {
  try {
    return require(lang)
  } catch (e) {
    throw new Error(
      `Preprocessor dependency "${lang}" not found. Did you install it?`
    )
  }
}

// .scss/.sass processor
const scss: StylePreprocessor = async (source, map, options) => {
  const nodeSass = loadPreprocessor('sass')
  const finalOptions = {
    ...options,
    data: getSource(source, options.filename, options.additionalData),
    file: options.filename,
    outFile: options.filename,
    sourceMap: !!map
  }

  try {
    const result = await new Promise<any>((resolve, reject) => {
      nodeSass.render(finalOptions, (err: Error | null, res: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
    const deps = result.stats.includedFiles
    if (map) {
      return {
        code: result.css.toString(),
        map: merge(map, JSON.parse(result.map.toString())),
        errors: [],
        deps
      }
    }

    return { code: result.css.toString(), errors: [], deps }
  } catch (e) {
    // normalize SASS error
    e.id = e.file
    e.frame = e.formatted
    return { code: '', errors: [e], deps: [] }
  }
}

const sass: StylePreprocessor = (source, map, options) =>
  scss(source, map, {
    ...options,
    indentedSyntax: true
  })

// .less
interface LessError {
  filename: string
  message: string
  line: number
  column: number
}

const less: StylePreprocessor = (source, map, options) => {
  const nodeLess = loadPreprocessor('less')

  let result: any
  let error: LessError | null = null
  nodeLess.render(
    getSource(source, options.filename, options.additionalData),
    { ...options, syncImport: true },
    (err: LessError | null, output: any) => {
      error = err
      result = output
    }
  )

  if (error) {
    // normalize error info
    const normalizedError: RollupError = new Error(error!.message)
    normalizedError.loc = {
      file: error!.filename || options.filename,
      line: error!.line,
      column: error!.column
    }
    return { code: '', errors: [normalizedError], deps: [] }
  }

  const deps = result.imports
  if (map) {
    return {
      code: result.css.toString(),
      map: merge(map, result.map),
      errors: [],
      deps
    }
  }

  return {
    code: result.css.toString(),
    errors: [],
    deps
  }
}

// .styl
const styl: StylePreprocessor = (source, map, options) => {
  const nodeStylus = loadPreprocessor('stylus')
  try {
    const ref = nodeStylus(source)
    Object.keys(options).forEach((key) => ref.set(key, options[key]))
    if (map) ref.set('sourcemap', { inline: false, comment: false })

    const result = ref.render()
    const deps = ref.deps()
    if (map) {
      return {
        code: result,
        map: merge(map, ref.sourcemap),
        errors: [],
        deps
      }
    }

    return { code: result, errors: [], deps }
  } catch (e) {
    return { code: '', errors: [e], deps: [] }
  }
}

function getSource(
  source: string,
  filename: string,
  additionalData?: string | ((source: string, filename: string) => string)
) {
  if (!additionalData) return source
  if (typeof additionalData === 'function') {
    return additionalData(source, filename)
  }
  return additionalData + source
}

const preProcessors = {
  less,
  sass,
  scss,
  styl,
  stylus: styl
}

type CssUrlReplacer = (
  url: string,
  importer?: string
) => string | Promise<string>
const cssUrlRE = /url\(\s*('[^']+'|"[^"]+"|[^'")]+)\s*\)/

const UrlRewritePostcssPlugin: PluginCreator<{
  replacer: CssUrlReplacer
}> = (opts) => {
  if (!opts) {
    throw new Error('base or replace is required')
  }

  return {
    postcssPlugin: 'vite-url-rewrite',
    Once(root) {
      const promises: Promise<void>[] = []
      root.walkDecls((decl) => {
        if (cssUrlRE.test(decl.value)) {
          const replacerForDecl = (rawUrl: string) => {
            const importer = decl.source?.input.file
            return opts.replacer(rawUrl, importer)
          }
          promises.push(
            rewriteCssUrls(decl.value, replacerForDecl).then((url) => {
              decl.value = url
            })
          )
        }
      })
      if (promises.length) {
        return Promise.all(promises) as any
      }
    }
  }
}
UrlRewritePostcssPlugin.postcss = true

function rewriteCssUrls(
  css: string,
  replacer: CssUrlReplacer
): Promise<string> {
  return asyncReplace(css, cssUrlRE, async (match) => {
    let [matched, rawUrl] = match
    let wrap = ''
    const first = rawUrl[0]
    if (first === `"` || first === `'`) {
      wrap = first
      rawUrl = rawUrl.slice(1, -1)
    }
    if (isExternalUrl(rawUrl) || isDataUrl(rawUrl) || rawUrl.startsWith('#')) {
      return matched
    }
    return `url(${wrap}${await replacer(rawUrl)}${wrap})`
  })
}

let CleanCSS: any

async function minifyCSS(css: string, config: ResolvedConfig) {
  CleanCSS = CleanCSS || (await import('clean-css')).default
  const res = new CleanCSS({
    rebase: false,
    ...config.build.cleanCssOptions
  }).minify(css)

  if (res.errors && res.errors.length) {
    config.logger.error(chalk.red(`error when minifying css:\n${res.errors}`))
    // TODO format this
    throw res.errors[0]
  }

  if (res.warnings && res.warnings.length) {
    config.logger.warn(
      chalk.yellow(`warnings when minifying css:\n${res.warnings}`)
    )
  }

  return res.styles
}
