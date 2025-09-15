import type { IncomingMessage, ServerResponse } from 'node:http'
import type { WebSocket } from 'ws'

// Core types for Nalth framework
export interface NalthConfig {
  root?: string
  base?: string
  mode?: string
  define?: Record<string, any>
  plugins?: NalthPlugin[]
  publicDir?: string | false
  cacheDir?: string
  
  // Logging configuration
  logLevel?: 'info' | 'warn' | 'error' | 'silent'
  clearScreen?: boolean
  customLogger?: any
  
  // Environment configuration
  envPrefix?: string | string[]
  
  // Server configuration
  server?: ServerOptions
  
  // Security configuration
  security?: SecurityConfig
  
  // Build configuration
  build?: BuildOptions
  
  // Optimization
  optimizeDeps?: DepOptimizationOptions
}

export interface ServerOptions {
  host?: string | boolean
  port?: number
  https?: boolean | {
    cert?: string
    key?: string
    autoGenerate?: boolean
  }
  open?: boolean | string
  proxy?: Record<string, string | ProxyOptions>
  cors?: boolean | CorsOptions
  headers?: OutgoingHttpHeaders
  hmr?: boolean | HMROptions
}

export interface SecurityConfig {
  level?: 'permissive' | 'balanced' | 'strict'
  
  // Content Security Policy
  csp?: {
    enabled?: boolean
    auto?: boolean
    directives?: Record<string, string | string[]>
    reportOnly?: boolean
    reportUri?: string
  }
  
  // XSS Protection
  xss?: {
    enabled?: boolean
    sanitizeInputs?: boolean
    validateOutputs?: boolean
    blockMode?: boolean
  }
  
  // CSRF Protection
  csrf?: {
    enabled?: boolean
    tokenName?: string
    cookieOptions?: {
      secure?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
      httpOnly?: boolean
    }
  }
  
  // Security Headers
  headers?: {
    hsts?: {
      maxAge?: number
      includeSubDomains?: boolean
      preload?: boolean
    }
    frameOptions?: 'DENY' | 'SAMEORIGIN' | string
    contentTypeOptions?: boolean
    referrerPolicy?: string
    permissionsPolicy?: Record<string, string[]>
  }
  
  // Dependency Auditing
  audit?: {
    enabled?: boolean
    failOnHigh?: boolean
    failOnMedium?: boolean
    autoFix?: boolean
    schedule?: 'startup' | 'daily' | 'weekly'
  }
  
  // Code Analysis
  analysis?: {
    enabled?: boolean
    patterns?: string[]
    failOnViolations?: boolean
  }
}

export interface BuildOptions {
  target?: string | string[]
  outDir?: string
  assetsDir?: string
  assetsInlineLimit?: number
  cssCodeSplit?: boolean
  sourcemap?: boolean | 'inline' | 'hidden'
  rollupOptions?: any
  minify?: boolean | 'terser' | 'esbuild'
  write?: boolean
  emptyOutDir?: boolean
  manifest?: boolean
  ssrManifest?: boolean
  ssr?: boolean | string
  reportCompressedSize?: boolean
  chunkSizeWarningLimit?: number
}

export interface DepOptimizationOptions {
  entries?: string[]
  exclude?: string[]
  include?: string[]
  esbuildOptions?: any
  force?: boolean
}

export interface HMROptions {
  port?: number
  host?: string
  clientPort?: number
  protocol?: string
  timeout?: number
  overlay?: boolean
  server?: any
}

export interface ProxyOptions {
  target: string
  changeOrigin?: boolean
  ws?: boolean
  rewrite?: (path: string) => string
  configure?: (proxy: any, options: ProxyOptions) => void
}

export interface CorsOptions {
  origin?: boolean | string | RegExp | (string | RegExp)[]
  methods?: string | string[]
  allowedHeaders?: string | string[]
  exposedHeaders?: string | string[]
  credentials?: boolean
  maxAge?: number
  preflightContinue?: boolean
  optionsSuccessStatus?: number
}

export interface OutgoingHttpHeaders {
  [header: string]: number | string | string[] | undefined
}

// Plugin system
export interface NalthPlugin {
  name: string
  configResolved?: (config: ResolvedConfig) => void | Promise<void>
  buildStart?: (opts: any) => void | Promise<void>
  resolveId?: (id: string, importer?: string) => string | null | Promise<string | null>
  load?: (id: string) => string | null | Promise<string | null>
  transform?: (code: string, id: string) => TransformResult | Promise<TransformResult>
  generateBundle?: (options: any, bundle: any) => void | Promise<void>
  writeBundle?: (options: any, bundle: any) => void | Promise<void>
  buildEnd?: (error?: Error) => void | Promise<void>
  configureServer?: (server: NalthDevServer) => void | Promise<void>
  configurePreviewServer?: (server: NalthDevServer) => void | Promise<void>
  transformIndexHtml?: {
    order?: 'pre' | 'post'
    handler: (html: string, context: TransformIndexHtmlContext) => string | Promise<string>
  } | ((html: string, context: TransformIndexHtmlContext) => string | Promise<string>)
  handleHotUpdate?: (ctx: HmrContext) => void | Promise<void>
  
  // Security-specific hooks
  onSecurityViolation?: (violation: SecurityViolation) => void | Promise<void>
  configureSecurityRules?: (rules: SecurityRules) => SecurityRules | Promise<SecurityRules>
}

export interface ResolvedConfig extends Omit<Required<NalthConfig>, 'publicDir' | 'logLevel' | 'clearScreen' | 'customLogger' | 'envPrefix'> {
  publicDir: string | false
  logLevel: 'info' | 'warn' | 'error' | 'silent'
  clearScreen: boolean
  customLogger?: any
  envPrefix: string | string[]
  configFile?: string
  configFileDependencies: string[]
  inlineConfig: NalthConfig
  command: 'build' | 'serve'
  mode: string
  isWorker: boolean
  isProduction: boolean
  env: Record<string, any>
  logger: Logger
  createResolver: (options?: any) => ResolveFn
}

export interface TransformResult {
  code?: string
  map?: any
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}

export interface TransformIndexHtmlContext {
  path: string
  filename: string
  server?: NalthDevServer
  bundle?: any
  chunk?: any
}

export interface HmrContext {
  file: string
  timestamp: number
  modules: ModuleNode[]
  read: () => string | Promise<string>
  server: NalthDevServer
}

export interface ModuleNode {
  id: string | null
  file: string | null
  type: 'js' | 'css'
  info?: any
  meta?: any
  importers: Set<ModuleNode>
  importedModules: Set<ModuleNode>
  acceptedHmrDeps: Set<ModuleNode>
  acceptedHmrExports: Set<string> | null
  importedBindings: Map<string, Set<string>> | null
  isSelfAccepting?: boolean
  transformResult: TransformResult | null
  ssrTransformResult: TransformResult | null
  ssrModule: Record<string, any> | null
  ssrError: Error | null
  lastHMRTimestamp: number
  lastInvalidationTimestamp: number
  invalidate(): void
}

// Security types
export interface SecurityViolation {
  type: 'csp' | 'xss' | 'csrf' | 'audit' | 'analysis'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  file?: string
  line?: number
  column?: number
  rule?: string
  timestamp: number
}

export interface SecurityRules {
  csp: Record<string, string[]>
  xss: {
    patterns: string[]
    sanitizers: string[]
  }
  csrf: {
    exemptRoutes: string[]
    tokenValidation: boolean
  }
  audit: {
    allowedVulnerabilities: string[]
    maxSeverity: 'low' | 'medium' | 'high'
  }
}

export interface SecurityMetrics {
  violations: number
  vulnerabilities: number
  securityScore: number
  lastScan: number
  trends: {
    daily: number[]
    weekly: number[]
  }
}

// Server types
export interface NalthDevServer {
  config: ResolvedConfig
  middlewares: any
  httpServer: any
  ws: WebSocketServer
  watcher: any
  pluginContainer: PluginContainer
  moduleGraph: ModuleGraph
  
  listen(port?: number, isRestart?: boolean): Promise<NalthDevServer>
  close(): Promise<void>
  restart(forceOptimize?: boolean): Promise<void>
  
  // Security methods
  reportSecurityViolation(violation: SecurityViolation): void
  getSecurityMetrics(): SecurityMetrics
  updateSecurityRules(rules: Partial<SecurityRules>): void
}

export interface WebSocketServer {
  clients: Set<WebSocket>
  on(event: string, listener: (...args: any[]) => void): void
  off(event: string, listener: (...args: any[]) => void): void
  send(payload: HMRPayload): void
  close(): Promise<void>
}

export interface HMRPayload {
  type: string
  timestamp?: number
  path?: string
  id?: string
  [key: string]: any
}

export interface PluginContainer {
  resolveId(id: string, importer?: string): Promise<string | null>
  load(id: string): Promise<string | null>
  transform(code: string, id: string): Promise<TransformResult | null>
  close(): Promise<void>
}

export interface ModuleGraph {
  getModuleById(id: string): ModuleNode | undefined
  getModulesByFile(file: string): Set<ModuleNode> | undefined
  onFileChange(file: string): void
  invalidateModule(mod: ModuleNode): void
  invalidateAll(): void
  updateModuleInfo(mod: ModuleNode, importedModules: Set<string | ModuleNode>): Set<ModuleNode> | undefined
}

// Utility types
export interface Logger {
  info(msg: string, options?: LogOptions): void
  warn(msg: string, options?: LogOptions): void
  warnOnce(msg: string, options?: LogOptions): void
  error(msg: string, options?: LogErrorOptions): void
  clearScreen(type: LogType): void
  hasErrorLogged(error: Error): boolean
  hasWarned: boolean
}

export interface LogOptions {
  clear?: boolean
  timestamp?: boolean
}

export interface LogErrorOptions extends LogOptions {
  error?: Error | null
}

export type LogType = 'error' | 'warn' | 'info'
export type LogLevel = LogType | 'silent'

export type ResolveFn = (id: string, importer?: string) => Promise<string | undefined>

// Configuration helper
export function defineConfig(config: NalthConfig | (() => NalthConfig | Promise<NalthConfig>)): NalthConfig | (() => NalthConfig | Promise<NalthConfig>) {
  return config
}
