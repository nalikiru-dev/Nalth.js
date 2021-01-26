import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { createHash } from 'crypto'
import { ResolvedConfig } from '../config'
import { SUPPORTED_EXTS } from '../constants'
import {
  createDebugger,
  emptyDir,
  lookupFile,
  normalizePath,
  resolveFrom,
  writeFile
} from '../utils'
import { PluginContainer } from '../server/pluginContainer'
import { tryNodeResolve } from '../plugins/resolve'
import { createFilter } from '@rollup/pluginutils'
import { prompt } from 'enquirer'
import { build } from 'esbuild'
import { esbuildDepPlugin } from './esbuildDepPlugin'
import { init, parse } from 'es-module-lexer'

const debug = createDebugger('vite:optimize')

const KNOWN_WARN_LIST = new Set([
  'vite',
  'vitepress',
  'tailwindcss',
  'sass',
  'less',
  'stylus',
  'postcss',
  'autoprefixer',
  'pug',
  'jest',
  'typescript'
])

const WARN_RE = /^(@vitejs\/|@rollup\/|vite-|rollup-|postcss-|babel-)plugin-|^@babel\/|^@tailwindcss\//

export interface DepOptimizationOptions {
  /**
   * Force optimize listed dependencies (supports deep paths).
   */
  include?: string[]
  /**
   * Do not optimize these dependencies.
   */
  exclude?: string | RegExp | (string | RegExp)[]
  /**
   * A list of linked dependencies that should be treated as source code.
   */
  link?: string[]
  /**
   * Automatically run `vite optimize` on server start?
   * @default true
   */
  auto?: boolean
}

export interface DepOptimizationMetadata {
  hash: string
  optimized: Record<
    string,
    {
      file: string
      needsInterop: boolean
    }
  >
  transitiveOptimized: Record<string, true>
  dependencies: Record<string, string>
}

export async function optimizeDeps(
  config: ResolvedConfig,
  force = config.server.force,
  asCommand = false
) {
  config = {
    ...config,
    command: 'build'
  }

  const { root, logger, optimizeCacheDir: cacheDir } = config
  const log = asCommand ? logger.info : debug

  if (!cacheDir) {
    log(`No package.json. Skipping.`)
    return
  }

  const dataPath = path.join(cacheDir, 'metadata.json')
  const pkgPath = lookupFile(root, [`package.json`], true)!
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const data: DepOptimizationMetadata = {
    hash: getDepHash(root, pkg, config),
    optimized: {},
    transitiveOptimized: {},
    dependencies: pkg.dependencies
  }

  if (!force) {
    let prevData
    try {
      prevData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    } catch (e) {}
    // hash is consistent, no need to re-bundle
    if (prevData && prevData.hash === data.hash) {
      log('Hash is consistent. Skipping. Use --force to override.')
      return
    }
  }

  if (fs.existsSync(cacheDir)) {
    emptyDir(cacheDir)
  } else {
    fs.mkdirSync(cacheDir, { recursive: true })
  }

  const options = config.optimizeDeps || {}
  const aliasResolver = config.aliasResolver

  // Determine deps to optimize. The goal is to only pre-bundle deps that falls
  // under one of the following categories:
  // 1. Has imports to relative files (e.g. lodash-es, lit-html)
  // 2. Has imports to bare modules that are not in the project's own deps
  //    (i.e. esm that imports its own dependencies, e.g. styled-components)
  const { qualified, external } = await resolveQualifiedDeps(
    root,
    config,
    aliasResolver
  )

  // Resolve deps from linked packages in a monorepo
  if (options.link) {
    for (const linkedDep of options.link) {
      await resolveLinkedDeps(
        config.root,
        linkedDep,
        qualified,
        external,
        config,
        aliasResolver
      )
    }
  }

  // Force included deps - these can also be deep paths
  if (options.include) {
    for (let id of options.include) {
      const aliased = (await aliasResolver.resolveId(id))?.id || id
      const filePath = tryNodeResolve(aliased, root, config.isProduction)
      if (filePath) {
        qualified[id] = filePath.id
      }
    }
  }

  let qualifiedIds = Object.keys(qualified)
  const invalidIds = qualifiedIds.filter(
    (id) => KNOWN_WARN_LIST.has(id) || WARN_RE.test(id)
  )

  if (invalidIds.length) {
    const msg =
      `It seems your dependencies contain packages that are not meant to\n` +
      `be used in the browser, e.g. ${chalk.cyan(invalidIds.join(', '))}. ` +
      `\nSince vite pre-bundles eligible dependencies to improve performance,\n` +
      `they should probably be moved to devDependencies instead.`

    if (process.env.CI) {
      logger.error(msg)
      process.exit(1)
    }

    const { yes } = (await prompt({
      type: 'confirm',
      name: 'yes',
      initial: true,
      message: chalk.yellow(
        msg + `\nAuto-update package.json and continue without these deps?`
      )
    })) as { yes: boolean }
    if (yes) {
      invalidIds.forEach((id) => {
        delete qualified[id]
      })
      qualifiedIds = qualifiedIds.filter((id) => !invalidIds.includes(id))
      const pkgPath = lookupFile(root, ['package.json'], true)!
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      invalidIds.forEach((id) => {
        const v = pkg.dependencies[id]
        delete pkg.dependencies[id]
        ;(pkg.devDependencies || (pkg.devDependencies = {}))[id] = v
      })
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
      // udpate data hash
      data.hash = getDepHash(root, pkg, config)
    } else {
      process.exit(1)
    }
  }

  if (!qualifiedIds.length) {
    writeFile(dataPath, JSON.stringify(data, null, 2))
    log(`No listed dependency requires optimization. Skipping.\n\n\n`)
    return
  }

  const depsString = qualifiedIds.map((id) => chalk.yellow(id)).join(`, `)
  if (!asCommand) {
    // This is auto run on server start - let the user know that we are
    // pre-optimizing deps
    logger.info(
      chalk.greenBright(`Optimizable dependencies detected:\n${depsString}`)
    )
    logger.info(
      `Pre-bundling them to speed up dev server page load...\n` +
        `(this will be run only when your dependencies or config have changed)`
    )
  } else {
    logger.info(chalk.greenBright(`Optimizing dependencies:\n${depsString}`))
  }

  const esbuildMetaPath = path.join(cacheDir, 'esbuild.json')

  await build({
    entryPoints: Object.values(qualified).map((p) => path.resolve(p)),
    bundle: true,
    format: 'esm',
    external,
    logLevel: 'error',
    splitting: true,
    sourcemap: true,
    outdir: cacheDir,
    treeShaking: 'ignore-annotations',
    metafile: esbuildMetaPath,
    define: {
      'process.env.NODE_ENV': '"development"'
    },
    plugins: [
      esbuildDepPlugin(
        qualified,
        config,
        data.transitiveOptimized,
        aliasResolver
      )
    ]
  })

  const meta = JSON.parse(fs.readFileSync(esbuildMetaPath, 'utf-8'))

  await init
  const entryToIdMap: Record<string, string> = {}
  for (const id in qualified) {
    entryToIdMap[qualified[id].toLowerCase()] = id
  }

  for (const output in meta.outputs) {
    if (/\.vite[\/\\]chunk\.\w+\.js$/.test(output) || output.endsWith('.map'))
      continue
    const { inputs, exports } = meta.outputs[output]
    const relativeOutput = normalizePath(
      path.relative(cacheDir, path.resolve(output))
    )
    for (const input in inputs) {
      const entry = normalizePath(path.resolve(input))
      if (!entry.endsWith(relativeOutput)) {
        continue
      }
      const id = entryToIdMap[entry.toLowerCase()]
      if (!id) {
        continue
      }
      data.optimized[id] = {
        file: normalizePath(path.resolve(output)),
        needsInterop: needsInterop(id, entry, exports)
      }
      break
    }
  }

  writeFile(dataPath, JSON.stringify(data, null, 2))
}

// https://github.com/vitejs/vite/issues/1724#issuecomment-767619642
// a list of modules that pretends to be ESM but still uses `require`.
// this causes esbuild to wrap them as CJS even when its entry appears to be ESM.
const KNOWN_INTEROP_IDS = new Set(['moment'])

function needsInterop(
  id: string,
  entry: string,
  generatedExports: string[]
): boolean {
  if (KNOWN_INTEROP_IDS.has(id)) {
    return true
  }
  const [imports, exports] = parse(fs.readFileSync(entry, 'utf-8'))
  // entry has no ESM syntax - likely CJS or UMD
  if (!exports.length && !imports.length) {
    return true
  }
  // if a peer dep used require() on a ESM dep, esbuild turns the
  // ESM dep's entry chunk into a single default export... detect
  // such cases by checking exports mismatch, and force interop.
  if (
    isSingleDefaultExport(generatedExports) &&
    !isSingleDefaultExport(exports)
  ) {
    return true
  }
  return false
}

function isSingleDefaultExport(exports: string[]) {
  return exports.length === 1 && exports[0] === 'default'
}

interface FilteredDeps {
  qualified: Record<string, string>
  external: string[]
}

async function resolveQualifiedDeps(
  root: string,
  config: ResolvedConfig,
  aliasResolver: PluginContainer
): Promise<FilteredDeps> {
  const { include, exclude, link } = config.optimizeDeps || {}
  const qualified: Record<string, string> = {}
  const external: string[] = []

  const pkgContent = lookupFile(root, ['package.json'])
  if (!pkgContent) {
    return {
      qualified,
      external
    }
  }

  const pkg = JSON.parse(pkgContent)
  const deps = Object.keys(pkg.dependencies || {})
  const linked: string[] = []
  const excludeFilter =
    exclude && createFilter(null, exclude, { resolve: false })

  for (const id of deps) {
    if (include && include.includes(id)) {
      // already force included
      continue
    }
    if (excludeFilter && !excludeFilter(id)) {
      debug(`skipping ${id} (excluded)`)
      continue
    }
    if (link && link.includes(id)) {
      debug(`skipping ${id} (link)`)
      continue
    }
    // #804
    if (id.startsWith('@types/')) {
      debug(`skipping ${id} (ts declaration)`)
      continue
    }
    let filePath
    try {
      const aliased = (await aliasResolver.resolveId(id))?.id || id
      const resolved = tryNodeResolve(aliased, root, config.isProduction)
      filePath = resolved && resolved.id
    } catch (e) {}
    if (!filePath) {
      debug(`skipping ${id} (cannot resolve entry)`)
      continue
    }
    if (!filePath.includes('node_modules')) {
      debug(`skipping ${id} (not a node_modules dep, likely linked)`)
      // resolve deps of the linked module
      linked.push(id)
      continue
    }
    if (!SUPPORTED_EXTS.includes(path.extname(filePath))) {
      debug(`skipping ${id} (entry is not js)`)
      continue
    }
    // qualified!
    qualified[id] = filePath
  }

  // mark non-optimized deps as external
  external.push(
    ...(await Promise.all(
      deps
        .filter((id) => !qualified[id])
        // make sure aliased deps are external
        // https://github.com/vitejs/vite-plugin-react/issues/4
        .map(async (id) => (await aliasResolver.resolveId(id))?.id || id)
    ))
  )

  if (linked.length) {
    for (const dep of linked) {
      await resolveLinkedDeps(
        root,
        dep,
        qualified,
        external,
        config,
        aliasResolver
      )
    }
  }

  return {
    qualified,
    external
  }
}

async function resolveLinkedDeps(
  root: string,
  dep: string,
  qualified: Record<string, string>,
  external: string[],
  config: ResolvedConfig,
  aliasResolver: PluginContainer
) {
  const depRoot = path.dirname(resolveFrom(`${dep}/package.json`, root))
  const { qualified: q, external: e } = await resolveQualifiedDeps(
    depRoot,
    config,
    aliasResolver
  )
  Object.keys(q).forEach((id) => {
    if (!qualified[id]) {
      qualified[id] = q[id]
    }
  })
  e.forEach((id) => {
    if (!external.includes(id)) {
      external.push(id)
    }
  })
}

const lockfileFormats = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']

let cachedHash: string | undefined

function getDepHash(
  root: string,
  pkg: Record<string, any>,
  config: ResolvedConfig
): string {
  if (cachedHash) {
    return cachedHash
  }
  let content = lookupFile(root, lockfileFormats) || ''
  content += JSON.stringify(pkg.dependencies)
  // also take config into account
  // only a subset of config options that can affect dep optimization
  content += JSON.stringify(
    {
      mode: config.mode,
      root: config.root,
      alias: config.alias,
      dedupe: config.dedupe,
      assetsInclude: config.assetsInclude,
      optimizeDeps: {
        include: config.optimizeDeps?.include,
        exclude: config.optimizeDeps?.exclude,
        link: config.optimizeDeps?.link
      }
    },
    (_, value) => {
      if (typeof value === 'function' || value instanceof RegExp) {
        return value.toString()
      }
      return value
    }
  )
  return createHash('sha256').update(content).digest('hex').substr(0, 8)
}
