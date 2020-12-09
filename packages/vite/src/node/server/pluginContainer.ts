/**
 * This file is refactored into TypeScript based on
 * https://github.com/preactjs/wmr/blob/master/src/lib/rollup-plugin-container.js
 * Licensed under MIT
 * https://github.com/preactjs/wmr/blob/master/LICENSE
 */

import { resolve, relative, dirname, sep, posix } from 'path'
import { createHash } from 'crypto'
import { promises as fs } from 'fs'
import { Plugin } from '../config'
import {
  RollupOptions,
  InputOptions,
  MinimalPluginContext,
  OutputOptions,
  ModuleInfo,
  NormalizedInputOptions,
  ChangeEvent,
  PartialResolvedId,
  ResolvedId,
  PluginContext as RollupPluginContext,
  LoadResult,
  SourceDescription,
  EmittedFile
} from 'rollup'
import * as acorn from 'acorn'
import acornClassFields from 'acorn-class-fields'
import merge from 'merge-source-map'
import MagicString, { SourceMap } from 'magic-string'

export interface PluginContainerOptions {
  cwd?: string
  output?: OutputOptions
  modules?: Map<string, { info: ModuleInfo }>
  writeFile?: (name: string, source: string | Uint8Array) => void
}

export interface PluginContainer {
  options: InputOptions
  buildStart(options: InputOptions): Promise<void>
  watchChange(id: string, event?: ChangeEvent): void
  resolveImportMeta(id: string, property: string): void
  resolveId(
    id: string,
    importer?: string,
    skip?: Plugin[]
  ): Promise<PartialResolvedId | null>
  transform(
    code: string,
    id: string,
    inMap?: SourceDescription['map']
  ): Promise<SourceDescription | null>
  load(id: string): Promise<LoadResult | null>
  resolveFileUrl(referenceId: string): string | null
}

type PluginContext = Omit<
  RollupPluginContext,
  // not documented
  | 'cache'
  // deprecated
  | 'emitAsset'
  | 'emitChunk'
  | 'getAssetFileName'
  | 'getChunkFileName'
  | 'isExternal'
  | 'moduleIds'
  | 'resolveId'
>

const toPosixPath = (path: string) => path.split(sep).join(posix.sep)

function popIndex(array: any[], index: number) {
  const tail = array.pop()
  if (index !== array.length) array[index] = tail
}

export async function createPluginContainer(
  plugins: readonly Plugin[],
  opts: RollupOptions & PluginContainerOptions = {}
): Promise<PluginContainer> {
  // counter for generating unique emitted asset IDs
  let ids = 0
  let parser = acorn.Parser

  const MODULES = opts.modules || new Map()
  const files = new Map<string, EmittedFile>()
  const watchFiles = new Set<string>()
  const resolveCache = new Map<string, PartialResolvedId>()

  const minimalContext: MinimalPluginContext = {
    meta: {
      rollupVersion: '2.8.0',
      watchMode: true
    }
  }

  // we should create a new context for each async hook pipeline so that the
  // active plugin in that pipeline can be tracked in a concurrency-safe manner.
  // using a class to make creating new contexts more efficient
  class Context implements PluginContext {
    meta = minimalContext.meta
    activePlugin: Plugin | null

    constructor(initialPlugin?: Plugin) {
      this.activePlugin = initialPlugin || null
    }

    parse(code: string, opts: any = {}) {
      return parser.parse(code, {
        sourceType: 'module',
        ecmaVersion: 2020,
        locations: true,
        onComment: [],
        ...opts
      })
    }

    async resolve(
      id: string,
      importer?: string,
      options?: { skipSelf?: boolean }
    ) {
      const skip = []
      if (options?.skipSelf && this.activePlugin) skip.push(this.activePlugin)
      let out = await container.resolveId(id, importer, skip)
      if (typeof out === 'string') out = { id: out }
      if (!out || !out.id) out = { id }
      if (out.id.match(/^\.\.?[/\\]/)) {
        out.id = resolve(
          opts.cwd || '.',
          importer ? dirname(importer) : '.',
          out.id
        )
      }
      return (out as ResolvedId) || null
    }

    getModuleInfo(id: string) {
      let mod = MODULES.get(id)
      if (mod) return mod.info
      mod = {
        /** @type {import('rollup').ModuleInfo} */
        // @ts-ignore-next
        info: {}
      }
      MODULES.set(id, mod)
      return mod.info
    }

    getModuleIds() {
      return MODULES.keys()
    }

    addWatchFile(id: string) {
      watchFiles.add(id)
    }

    getWatchFiles() {
      return [...watchFiles]
    }

    emitFile(assetOrFile: EmittedFile) {
      const { type, name, fileName } = assetOrFile
      const source = assetOrFile.type === 'asset' && assetOrFile.source
      const id = String(++ids)
      const filename =
        fileName || generateFilename(type, name!, source, fileName)
      files.set(id, { type, id, name, fileName: filename })
      if (source) {
        if (type === 'chunk') {
          throw Error(`emitFile({ type:"chunk" }) cannot include a source`)
        }
        if (opts.writeFile) opts.writeFile(filename, source)
        else fs.writeFile(filename, source)
      }
      return id
    }

    setAssetSource(assetId: string, source: string | Uint8Array) {
      const asset = files.get(String(assetId))
      if (!asset) {
        throw new Error(
          `setAssetSource() called on non-existent asset with id ${assetId}`
        )
      }
      if (asset.type === 'chunk') {
        throw Error(`setAssetSource() called on a chunk`)
      }
      asset.source = source
      if (opts.writeFile) opts.writeFile(asset.fileName!, source)
      else fs.writeFile(asset.fileName!, source)
    }

    getFileName(referenceId: string) {
      return container.resolveFileUrl(referenceId)!
    }

    // TODO
    warn(...args: any[]) {
      console.warn(`[${this.activePlugin!.name}]`, ...args)
    }

    // TODO
    error(e: any): never {
      throw e
    }
  }

  class TransformContext extends Context {
    filename: string
    originalCode: string
    originalSourcemap: SourceMap | null = null
    sourcemapChain: NonNullable<SourceDescription['map']>[] = []
    combinedMap: SourceMap | null = null

    constructor(filename: string, code: string, inMap?: SourceMap | string) {
      super()
      this.filename = filename
      this.originalCode = code
      if (inMap) {
        this.sourcemapChain.push(inMap)
      }
    }

    _getCombinedSourcemap(createIfNull = false) {
      let combinedMap = this.combinedMap
      for (let m of this.sourcemapChain) {
        if (typeof m === 'string') m = JSON.parse(m)
        if (!combinedMap) {
          combinedMap = m as SourceMap
        } else {
          // merge-source-map will overwrite original sources if newMap also has
          // sourcesContent
          ;(m as SourceMap).sourcesContent = []
          // @ts-ignore
          combinedMap = merge(combinedMap, m)
        }
      }
      if (!combinedMap) {
        return createIfNull
          ? new MagicString(this.originalCode).generateMap({
              includeContent: true,
              hires: true,
              source: this.filename
            })
          : null
      }
      if (combinedMap !== this.combinedMap) {
        this.combinedMap = combinedMap
        this.sourcemapChain.length = 0
      }
      return this.combinedMap
    }

    getCombinedSourcemap() {
      return this._getCombinedSourcemap(true) as SourceMap
    }
  }

  const container: PluginContainer = {
    options: await (async () => {
      let options = opts
      for (const plugin of plugins) {
        if (!plugin.options) continue
        options =
          (await plugin.options.call(minimalContext, options)) || options
      }
      if (options.acornInjectPlugins) {
        parser = acorn.Parser.extend(
          ...[acornClassFields].concat(options.acornInjectPlugins)
        )
      }
      return {
        acorn,
        acornInjectPlugins: [],
        ...options
      }
    })(),

    async buildStart() {
      await Promise.all(
        plugins.map((plugin) => {
          if (plugin.buildStart) {
            return plugin.buildStart.call(
              new Context(plugin) as any,
              container.options as NormalizedInputOptions
            )
          }
        })
      )
    },

    async resolveId(id, importer, _skip) {
      if (id === '@vue/runtime-dom') debugger
      const ctx = new Context()
      const key =
        (importer ? `${id}\n${importer}` : id) +
        (_skip ? _skip.map((p) => p.name).join('\n') : ``)

      if (resolveCache.has(key)) {
        return resolveCache.get(key)!
      }

      const partial: Partial<PartialResolvedId> = {}
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue

        if (_skip) {
          if (_skip.includes(plugin)) continue
          if (resolveSkips.has(plugin, key)) continue
          resolveSkips.add(plugin, key)
        }

        ctx.activePlugin = plugin

        let result
        try {
          result = await plugin.resolveId.call(ctx as any, id, importer, {})
        } finally {
          if (_skip) resolveSkips.delete(plugin, key)
        }

        if (!result) continue
        if (typeof result === 'string') {
          id = result
        } else {
          id = result.id
          Object.assign(partial, result)
        }

        // resolveId() is hookFirst - first non-null result is returned.
        break
      }

      partial.id = id
      if (id) {
        resolveCache.set(key, partial as PartialResolvedId)
      }
      return id ? (partial as PartialResolvedId) : null
    },

    async load(id) {
      const ctx = new Context()
      for (const plugin of plugins) {
        if (!plugin.load) continue
        ctx.activePlugin = plugin
        const result = await plugin.load.call(ctx as any, id)
        if (result) {
          return result
        }
      }
      return null
    },

    async transform(code, id, inMap) {
      const ctx = new TransformContext(id, code, inMap as SourceMap)
      for (const plugin of plugins) {
        if (!plugin.transform) continue
        ctx.activePlugin = plugin
        const result = await plugin.transform.call(ctx as any, code, id)
        if (!result) continue
        if (typeof result === 'object') {
          code = result.code || ''
          if (result.map) ctx.sourcemapChain.push(result.map)
        } else {
          code = result
        }
      }
      return {
        code,
        map: ctx._getCombinedSourcemap()
      }
    },

    watchChange(id, event = 'update') {
      const ctx = new Context()
      if (watchFiles.has(id)) {
        for (const plugin of plugins) {
          if (!plugin.watchChange) continue
          ctx.activePlugin = plugin
          plugin.watchChange.call(ctx as any, id, { event })
        }
      }
    },

    resolveImportMeta(id, property) {
      const ctx = new Context()
      for (const plugin of plugins) {
        if (!plugin.resolveImportMeta) continue
        ctx.activePlugin = plugin
        const result = plugin.resolveImportMeta.call(ctx as any, property, {
          chunkId: '',
          moduleId: id,
          format: 'es'
        })
        if (result) return result
      }

      // handle file URLs by default
      const matches = property.match(/^ROLLUP_FILE_URL_(\d+)$/)
      if (matches) {
        const referenceId = matches[1]
        const result = container.resolveFileUrl(referenceId)
        if (result) return result
      }
    },

    resolveFileUrl(referenceId) {
      referenceId = String(referenceId)
      const file = files.get(referenceId)
      if (file == null) return null
      const out = resolve(opts.cwd || '.', outputOptions.dir || '.')
      const fileName = relative(out, file.fileName!)
      const assetInfo = {
        referenceId,
        fileName,
        // @TODO: this should be relative to the module that imported the asset
        relativePath: fileName
      }
      const ctx = new Context()
      for (const plugin of plugins) {
        if (!plugin.resolveFileUrl) continue
        ctx.activePlugin = plugin
        // @ts-ignore
        const result = plugin.resolveFileUrl.call(ctx, assetInfo)
        if (result != null) {
          return result
        }
      }
      return JSON.stringify('/' + fileName.split(sep).join(posix.sep))
    }
  }

  // Tracks recursive resolveId calls
  const resolveSkips = {
    skip: new Map<Plugin, string[]>(),

    has(plugin: Plugin, key: string) {
      const skips = this.skip.get(plugin)
      return skips ? skips.includes(key) : false
    },

    add(plugin: Plugin, key: string) {
      const skips = this.skip.get(plugin)
      if (skips) skips.push(key)
      else this.skip.set(plugin, [key])
    },

    delete(plugin: Plugin, key: string) {
      const skips = this.skip.get(plugin)
      if (!skips) return
      const i = skips.indexOf(key)
      if (i !== -1) popIndex(skips, i)
    }
  }

  const outputOptions = {
    dir: opts.output && opts.output.dir,
    file: opts.output && opts.output.file,
    entryFileNames: opts.output && opts.output.entryFileNames,
    chunkFileNames: opts.output && opts.output.chunkFileNames,
    assetFileNames: opts.output && opts.output.assetFileNames
  }

  function generateFilename(
    type: 'entry' | 'asset' | 'chunk',
    name: string,
    source: string | false | undefined | Uint8Array,
    fileName: string | undefined
  ) {
    const posixName = toPosixPath(name)
    if (!fileName) {
      fileName = ((type === 'entry' && outputOptions.file) ||
        // @ts-ignore
        outputOptions[`${type}FileNames`] ||
        '[name][extname]') as string
      fileName = fileName.replace('[hash]', () =>
        createHash('md5').update(String(source)).digest('hex').substring(0, 5)
      )
      fileName = fileName.replace('[extname]', posix.extname(posixName))
      fileName = fileName.replace(
        '[ext]',
        posix.extname(posixName).substring(1)
      )
      fileName = fileName.replace(
        '[name]',
        posix.basename(posixName).replace(/\.[a-z0-9]+$/g, '')
      )
    }
    const result = resolve(opts.cwd || '.', outputOptions.dir || '.', fileName)
    // console.log('filename for ' + name + ': ', result);
    return result
  }

  return container
}
