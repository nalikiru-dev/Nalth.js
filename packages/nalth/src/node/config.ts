import { resolve, dirname, join } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import type { NalthConfig, ResolvedConfig, SecurityConfig } from './types'
import { createLogger } from './logger'
import { normalizePath } from './utils'

export const DEFAULT_CONFIG_FILES = [
  'nalth.config.js',
  'nalth.config.mjs',
  'nalth.config.ts',
  'nalth.config.cjs',
  'nalth.config.mts',
  'nalth.config.cts'
]

export const DEFAULT_EXTENSIONS = [
  '.mjs',
  '.js',
  '.mts',
  '.ts',
  '.jsx',
  '.tsx',
  '.json'
]

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  level: 'balanced',
  csp: {
    enabled: true,
    auto: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'https:'],
      'connect-src': ["'self'", 'ws:', 'wss:'],
      'media-src': ["'self'"],
      'object-src': ["'none'"],
      'child-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'manifest-src': ["'self'"]
    }
  },
  xss: {
    enabled: true,
    sanitizeInputs: true,
    validateOutputs: true,
    blockMode: true
  },
  csrf: {
    enabled: true,
    tokenName: '_csrf',
    cookieOptions: {
      secure: true,
      sameSite: 'strict',
      httpOnly: true
    }
  },
  headers: {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    frameOptions: 'DENY',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
      usb: [],
      magnetometer: [],
      gyroscope: [],
      accelerometer: []
    }
  },
  audit: {
    enabled: true,
    failOnHigh: false,
    failOnMedium: false,
    autoFix: false,
    schedule: 'startup'
  },
  analysis: {
    enabled: true,
    patterns: [
      'eval\\(',
      'Function\\(',
      'setTimeout\\([\'"`]',
      'setInterval\\([\'"`]',
      'innerHTML\\s*=',
      'outerHTML\\s*=',
      'document\\.write\\(',
      'document\\.writeln\\(',
      'execScript\\(',
      '\\.postMessage\\(',
      'window\\.open\\(',
      'location\\.href\\s*=',
      'location\\.replace\\(',
      'location\\.assign\\('
    ],
    failOnViolations: false
  }
}

export async function resolveConfig(
  inlineConfig: NalthConfig = {},
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig> {
  let config = inlineConfig
  let configFileDependencies: string[] = []
  let mode = inlineConfig.mode || defaultMode

  // Load config file
  const configEnv = {
    mode,
    command
  }

  const loadResult = await loadConfigFromFile(configEnv, inlineConfig.root)
  if (loadResult) {
    config = mergeConfig(loadResult.config, inlineConfig)
    configFileDependencies = loadResult.dependencies
  }

  // Resolve root directory
  const resolvedRoot = normalizePath(
    config.root ? resolve(config.root) : process.cwd()
  )

  // Resolve mode
  if (config.mode) {
    mode = config.mode
  }

  const isProduction = mode === 'production'

  // Create logger
  const logger = createLogger(config.logLevel, {
    allowClearScreen: config.clearScreen,
    customLogger: config.customLogger
  })

  // Merge security config with defaults
  const security = mergeSecurityConfig(DEFAULT_SECURITY_CONFIG, config.security || {})

  // Apply security level presets
  if (security.level === 'strict') {
    security.csp!.directives!['script-src'] = ["'self'"]
    security.csp!.directives!['style-src'] = ["'self'"]
    security.audit!.failOnHigh = true
    security.audit!.failOnMedium = true
    security.analysis!.failOnViolations = true
  } else if (security.level === 'permissive') {
    security.audit!.failOnHigh = false
    security.audit!.failOnMedium = false
    security.analysis!.failOnViolations = false
  }

  const resolved: ResolvedConfig = {
    ...config,
    configFile: loadResult?.path,
    configFileDependencies,
    inlineConfig,
    root: resolvedRoot,
    base: config.base || '/',
    mode,
    command,
    isWorker: false,
    isProduction,
    env: loadEnv(mode, resolvedRoot, config.envPrefix),
    logger,
    security,
    server: config.server || {},
    build: config.build || {},
    optimizeDeps: config.optimizeDeps || {},
    plugins: config.plugins || [],
    publicDir: config.publicDir !== false 
      ? resolve(resolvedRoot, config.publicDir || 'public')
      : false,
    cacheDir: config.cacheDir 
      ? resolve(resolvedRoot, config.cacheDir)
      : join(resolvedRoot, 'node_modules', '.nalth'),
    define: config.define || {},
    createResolver: () => {
      throw new Error('createResolver not implemented yet')
    }
  }

  // Resolve plugins
  resolved.plugins = await resolvePlugins(resolved, resolved.plugins)

  return resolved
}

export async function loadConfigFromFile(
  configEnv: { command: string; mode: string },
  configRoot: string = process.cwd(),
  configFile?: string
): Promise<{
  path: string
  config: NalthConfig
  dependencies: string[]
} | null> {
  const start = Date.now()
  const getTime = () => `${Date.now() - start}ms`

  let resolvedPath: string | undefined

  if (configFile) {
    // Explicit config file path
    resolvedPath = resolve(configFile)
  } else {
    // Search for config file
    for (const filename of DEFAULT_CONFIG_FILES) {
      const filePath = resolve(configRoot, filename)
      if (existsSync(filePath)) {
        resolvedPath = filePath
        break
      }
    }
  }

  if (!resolvedPath) {
    return null
  }

  let isESM = false
  if (/\.m[jt]s$/.test(resolvedPath)) {
    isESM = true
  } else if (/\.c[jt]s$/.test(resolvedPath)) {
    isESM = false
  } else {
    // Check package.json for type: "module"
    try {
      const pkg = JSON.parse(
        readFileSync(resolve(dirname(resolvedPath), 'package.json'), 'utf-8')
      )
      isESM = pkg.type === 'module'
    } catch {}
  }

  try {
    let userConfig: NalthConfig

    if (resolvedPath.endsWith('.ts') || resolvedPath.endsWith('.mts') || resolvedPath.endsWith('.cts')) {
      // TypeScript config file - need to transpile
      const result = await build({
        absWorkingDir: process.cwd(),
        entryPoints: [resolvedPath],
        outfile: 'out.js',
        write: false,
        target: ['node14.18', 'node16'],
        platform: 'node',
        bundle: true,
        format: isESM ? 'esm' : 'cjs',
        mainFields: ['main'],
        sourcemap: 'inline',
        metafile: true,
        plugins: [
          {
            name: 'externalize-deps',
            setup(build) {
              build.onResolve({ filter: /.*/ }, (args) => {
                const id = args.path
                if (id[0] !== '.' && !resolve(args.resolveDir, id)) {
                  return {
                    external: true
                  }
                }
              })
            }
          }
        ]
      })

      const { text } = result.outputFiles[0]
      const fileBase = `${resolvedPath}.timestamp-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}.mjs`
      const fileUrl = `${pathToFileURL(fileBase)}?t=${Date.now()}`
      
      userConfig = (await import(fileUrl)).default
    } else {
      // JavaScript config file
      const fileUrl = `${pathToFileURL(resolvedPath)}?t=${Date.now()}`
      userConfig = (await import(fileUrl)).default
    }

    const config = typeof userConfig === 'function' 
      ? await userConfig(configEnv)
      : userConfig

    if (!config || typeof config !== 'object') {
      throw new Error(`Config file must export or return an object.`)
    }

    return {
      path: normalizePath(resolvedPath),
      config,
      dependencies: [] // TODO: track dependencies for hot reload
    }
  } catch (e) {
    throw new Error(`Failed to load config from ${resolvedPath}: ${e}`)
  }
}

function mergeConfig(defaults: NalthConfig, overrides: NalthConfig): NalthConfig {
  const merged = { ...defaults }
  
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue
    
    if (key === 'plugins') {
      merged.plugins = [...(defaults.plugins || []), ...(value as any[])]
    } else if (key === 'define') {
      merged.define = { ...defaults.define, ...value }
    } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      merged[key as keyof NalthConfig] = {
        ...(defaults[key as keyof NalthConfig] as any),
        ...value
      }
    } else {
      merged[key as keyof NalthConfig] = value as any
    }
  }
  
  return merged
}

function mergeSecurityConfig(defaults: SecurityConfig, overrides: SecurityConfig): SecurityConfig {
  const merged = { ...defaults }
  
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue
    
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      merged[key as keyof SecurityConfig] = {
        ...(defaults[key as keyof SecurityConfig] as any),
        ...value
      }
    } else {
      merged[key as keyof SecurityConfig] = value as any
    }
  }
  
  return merged
}

function loadEnv(mode: string, envDir: string, prefixes: string | string[] = ['NALTH_']): Record<string, string> {
  if (mode === 'local') {
    throw new Error(`"local" cannot be used as a mode name because it conflicts with the .local postfix for .env files.`)
  }

  prefixes = Array.isArray(prefixes) ? prefixes : [prefixes]
  const env: Record<string, string> = {}
  const envFiles = [
    `.env.${mode}.local`,
    `.env.local`,
    `.env.${mode}`,
    `.env`
  ]

  for (const file of envFiles) {
    const path = resolve(envDir, file)
    if (existsSync(path)) {
      const parsed = require('dotenv').parse(readFileSync(path))
      
      for (const [key, value] of Object.entries(parsed)) {
        if (prefixes.some(prefix => key.startsWith(prefix))) {
          env[key] = value
        }
      }
    }
  }

  return env
}

async function resolvePlugins(config: ResolvedConfig, rawPlugins: any[]): Promise<any[]> {
  const plugins = []
  
  for (const plugin of rawPlugins) {
    if (typeof plugin === 'function') {
      plugins.push(await plugin())
    } else {
      plugins.push(plugin)
    }
  }
  
  return plugins
}

export { DEFAULT_SECURITY_CONFIG }
