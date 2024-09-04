import type { ViteHotContext } from 'types/hot'
import type { HotPayload } from 'types/hmrPayload'
import type { HMRConnection, HMRLogger } from '../shared/hmr'
import type {
  DefineImportMetadata,
  SSRImportMetadata,
} from '../shared/ssrTransform'
import type { ModuleCacheMap } from './moduleCache'
import type {
  ssrDynamicImportKey,
  ssrExportAllKey,
  ssrImportKey,
  ssrImportMetaKey,
  ssrModuleExportsKey,
} from './constants'
import type { DecodedMap } from './sourcemap/decoder'
import type { InterceptorOptions } from './sourcemap/interceptor'
import type { RunnerTransport } from './runnerTransport'

export type { DefineImportMetadata, SSRImportMetadata }

export interface ModuleRunnerHMRConnection extends HMRConnection {
  /**
   * Configure how HMR is handled when this connection triggers an update.
   * This method expects that connection will start listening for HMR updates and call this callback when it's received.
   */
  onUpdate(callback: (payload: HotPayload) => void): void
}

export interface ModuleRunnerImportMeta extends ImportMeta {
  url: string
  env: ImportMetaEnv
  hot?: ViteHotContext
  [key: string]: any
}

export interface ModuleRunnerContext {
  [ssrModuleExportsKey]: Record<string, any>
  [ssrImportKey]: (id: string, metadata?: DefineImportMetadata) => Promise<any>
  [ssrDynamicImportKey]: (
    id: string,
    options?: ImportCallOptions,
  ) => Promise<any>
  [ssrExportAllKey]: (obj: any) => void
  [ssrImportMetaKey]: ModuleRunnerImportMeta
}

export interface ModuleEvaluator {
  /**
   * Run code that was transformed by Vite.
   * @param context Function context
   * @param code Transformed code
   * @param id ID that was used to fetch the module
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Run externalized module.
   * @param file File URL to the external module
   */
  runExternalModule(file: string): Promise<any>
}

export interface ModuleCache {
  promise?: Promise<any>
  exports?: any
  evaluated?: boolean
  map?: DecodedMap
  meta?: ResolvedResult
  /**
   * Module ids that imports this module
   */
  importers?: Set<string>
  imports?: Set<string>
}

export type FetchResult =
  | CachedFetchResult
  | ExternalFetchResult
  | ViteFetchResult

export interface CachedFetchResult {
  /**
   * If module cached in the runner, we can just confirm
   * it wasn't invalidated on the server side.
   */
  cache: true
}

export interface ExternalFetchResult {
  /**
   * The path to the externalized module starting with file://,
   * by default this will be imported via a dynamic "import"
   * instead of being transformed by vite and loaded with vite runner
   */
  externalize: string
  /**
   * Type of the module. Will be used to determine if import statement is correct.
   * For example, if Vite needs to throw an error if variable is not actually exported
   */
  type?: 'module' | 'commonjs' | 'builtin' | 'network'
}

export interface ViteFetchResult {
  /**
   * Code that will be evaluated by vite runner
   * by default this will be wrapped in an async function
   */
  code: string
  /**
   * File path of the module on disk.
   * This will be resolved as import.meta.url/filename
   * Will be equal to `null` for virtual modules
   */
  file: string | null
  /**
   * Module ID in the server module graph.
   */
  serverId: string
  /**
   * Invalidate module on the client side.
   */
  invalidate: boolean
}

export type ResolvedResult = (ExternalFetchResult | ViteFetchResult) & {
  url: string
}

export type FetchFunction = (
  id: string,
  importer?: string,
  options?: FetchFunctionOptions,
) => Promise<FetchResult>

export interface FetchFunctionOptions {
  cached?: boolean
}

export interface ModuleRunnerHmr {
  /**
   * Configure how HMR communicates between the client and the server.
   */
  connection: ModuleRunnerHMRConnection
  /**
   * Configure HMR logger.
   */
  logger?: false | HMRLogger
}

export interface ModuleRunnerOptions {
  /**
   * Root of the project
   */
  root: string
  /**
   * A set of methods to communicate with the server.
   */
  transport: RunnerTransport
  /**
   * Configure how source maps are resolved. Prefers `node` if `process.setSourceMapsEnabled` is available.
   * Otherwise it will use `prepareStackTrace` by default which overrides `Error.prepareStackTrace` method.
   * You can provide an object to configure how file contents and source maps are resolved for files that were not processed by Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Disable HMR or configure HMR options.
   */
  hmr?: false | ModuleRunnerHmr
  /**
   * Custom module cache. If not provided, creates a separate module cache for each ModuleRunner instance.
   */
  moduleCache?: ModuleCacheMap
}

export interface ImportMetaEnv {
  [key: string]: any
  BASE_URL: string
  MODE: string
  DEV: boolean
  PROD: boolean
  SSR: boolean
}
