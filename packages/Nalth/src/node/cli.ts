import path from 'node:path'
import fs from 'node:fs'
import { performance } from 'node:perf_hooks'
import { cac } from 'cac'
import colors from 'picocolors'
import { VERSION } from './constants'
import type { BuildEnvironmentOptions } from './build'
import type { ServerOptions } from './server'
import type { CLIShortcut } from './shortcuts'
import type { LogLevel } from './logger'
import { createLogger } from './logger'
import { resolveConfig } from './config'
import type { InlineConfig } from './config'

// Project detection function
function isNalthProject(cwd: string): boolean {
  // Check for nalth.config.js/ts
  const configFiles = [
    'nalth.config.js',
    'nalth.config.ts', 
    'nalth.config.mjs',
    'nalth.config.cjs'
  ]
  
  for (const config of configFiles) {
    if (fs.existsSync(path.join(cwd, config))) {
      return true
    }
  }
  
  // Check package.json for nalth dependency
  const pkgPath = path.join(cwd, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      return !!(
        pkg.dependencies?.nalth ||
        pkg.devDependencies?.nalth ||
        pkg.peerDependencies?.nalth
      )
    } catch {}
  }
  
  return false
}

const cli = cac('nalth')

// global options
interface GlobalCLIOptions {
  '--'?: string[]
  c?: boolean | string
  config?: string
  base?: string
  l?: LogLevel
  logLevel?: LogLevel
  clearScreen?: boolean
  configLoader?: 'bundle' | 'runner' | 'native'
  d?: boolean | string
  debug?: boolean | string
  f?: string
  filter?: string
  m?: string
  mode?: string
  force?: boolean
  w?: boolean
}

interface BuilderCLIOptions {
  app?: boolean
}

let profileSession = global.__vite_profile_session
let profileCount = 0

export const stopProfiler = (
  log: (message: string) => void,
): void | Promise<void> => {
  if (!profileSession) return
  return new Promise((res, rej) => {
    profileSession!.post('Profiler.stop', (err: any, { profile }: any) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        const outPath = path.resolve(
          `./vite-profile-${profileCount++}.cpuprofile`,
        )
        fs.writeFileSync(outPath, JSON.stringify(profile))
        log(
          colors.yellow(
            `CPU profile written to ${colors.white(colors.dim(outPath))}`,
          ),
        )
        profileSession = undefined
        res()
      } else {
        rej(err)
      }
    })
  })
}

const filterDuplicateOptions = <T extends object>(options: T) => {
  for (const [key, value] of Object.entries(options)) {
    if (Array.isArray(value)) {
      options[key as keyof T] = value[value.length - 1]
    }
  }
}
/**
 * removing global flags before passing as command specific sub-configs
 */
function cleanGlobalCLIOptions<Options extends GlobalCLIOptions>(
  options: Options,
): Omit<Options, keyof GlobalCLIOptions> {
  const ret = { ...options }
  delete ret['--']
  delete ret.c
  delete ret.config
  delete ret.base
  delete ret.l
  delete ret.logLevel
  delete ret.clearScreen
  delete ret.configLoader
  delete ret.d
  delete ret.debug
  delete ret.f
  delete ret.filter
  delete ret.m
  delete ret.mode
  delete ret.force
  delete ret.w

  // convert the sourcemap option to a boolean if necessary
  if ('sourcemap' in ret) {
    const sourcemap = ret.sourcemap as `${boolean}` | 'inline' | 'hidden'
    ret.sourcemap =
      sourcemap === 'true'
        ? true
        : sourcemap === 'false'
          ? false
          : ret.sourcemap
  }
  if ('watch' in ret) {
    const watch = ret.watch
    ret.watch = watch ? {} : undefined
  }

  return ret
}

/**
 * removing builder flags before passing as command specific sub-configs
 */
function cleanBuilderCLIOptions<Options extends BuilderCLIOptions>(
  options: Options,
): Omit<Options, keyof BuilderCLIOptions> {
  const ret = { ...options }
  delete ret.app
  return ret
}

/**
 * host may be a number (like 0), should convert to string
 */
const convertHost = (v: any) => {
  if (typeof v === 'number') {
    return String(v)
  }
  return v
}

/**
 * base may be a number (like 0), should convert to empty string
 */
const convertBase = (v: any) => {
  if (v === 0) {
    return ''
  }
  return v
}

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('--base <path>', `[string] public base path (default: /)`, {
    type: [convertBase],
  })
  .option('-l, --logLevel <level>', `[string] info | warn | error | silent`)
  .option('--clearScreen', `[boolean] allow/disable clear screen when logging`)
  .option(
    '--configLoader <loader>',
    `[string] use 'bundle' to bundle the config with esbuild, or 'runner' (experimental) to process it on the fly, or 'native' (experimental) to load using the native runtime (default: bundle)`,
  )
  .option('-d, --debug [feat]', `[string | boolean] show debug logs`)
  .option('-f, --filter <filter>', `[string] filter debug logs`)
  .option('-m, --mode <mode>', `[string] set env mode`)

// dev
cli
  .command('[root]', 'start dev server') // default command
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev') // alias to align with the script name
  .option('--host [host]', `[string] specify hostname`, { type: [convertHost] })
  .option('--port <port>', `[number] specify port`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option(
    '--force',
    `[boolean] force the optimizer to ignore the cache and re-bundle`,
  )
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    // Check if this is a Nalth project
    const cwd = root ? path.resolve(root) : process.cwd()
    
    if (!isNalthProject(cwd) && !options.force) {
      // eslint-disable-next-line no-console
      console.error(`
${colors.red('🚨 Not a Nalth project!')}

${colors.yellow('Nalth CLI should only be used in projects created with create-nalth.')}

${colors.cyan('To create a new Nalth project:')}
  ${colors.white('npx create-nalth my-app')}

${colors.cyan('To force run anyway (not recommended):')}
  ${colors.white('nalth dev --force')}

${colors.gray('Current directory:')} ${cwd}
`)
      process.exit(1)
    }

    filterDuplicateOptions(options)
    // output structure is preserved even after bundling so require()
    // is ok here
    const { createServer } = await import('./server')
    try {
      const server = await createServer({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        configLoader: options.configLoader,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        server: cleanGlobalCLIOptions(options),
        forceOptimizeDeps: options.force,
      })

      if (!server.httpServer) {
        throw new Error('HTTP server not available')
      }

      await server.listen()

      const info = server.config.logger.info

      const modeString =
        options.mode && options.mode !== 'development'
          ? `  ${colors.bgGreen(` ${colors.bold(options.mode)} `)}`
          : ''
      const viteStartTime = global.__vite_start_time ?? false
      const startupDurationString = viteStartTime
        ? colors.dim(
            `ready in ${colors.reset(
              colors.bold(Math.ceil(performance.now() - viteStartTime)),
            )} ms`,
          )
        : ''
      const hasExistingLogs =
        process.stdout.bytesWritten > 0 || process.stderr.bytesWritten > 0

      info(
        `\n  ${colors.green(
          `${colors.bold('NALTH')} v${VERSION}`,
        )}${modeString}  ${startupDurationString}\n`,
        {
          clear: !hasExistingLogs,
        },
      )

      server.printUrls()
      const customShortcuts: CLIShortcut<typeof server>[] = []
      if (profileSession) {
        customShortcuts.push({
          key: 'p',
          description: 'start/stop the profiler',
          async action(server) {
            if (profileSession) {
              await stopProfiler(server.config.logger.info)
            } else {
              const inspector = await import('node:inspector').then(
                (r) => r.default,
              )
              await new Promise<void>((res) => {
                profileSession = new inspector.Session()
                profileSession.connect()
                profileSession.post('Profiler.enable', () => {
                  profileSession!.post('Profiler.start', () => {
                    server.config.logger.info('Profiler started')
                    res()
                  })
                })
              })
            }
          },
        })
      }
      server.bindCLIShortcuts({ print: true, customShortcuts })
    } catch (e) {
      const logger = createLogger(options.logLevel)
      logger.error(colors.red(`error when starting dev server:\n${e.stack}`), {
        error: e,
      })
      stopProfiler(logger.info)
      process.exit(1)
    }
  })

// build
cli
  .command('build [root]', 'build for production')
  .option(
    '--target <target>',
    `[string] transpile target (default: 'baseline-widely-available')`,
  )
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .option(
    '--assetsDir <dir>',
    `[string] directory under outDir to place assets in (default: assets)`,
  )
  .option(
    '--assetsInlineLimit <number>',
    `[number] static asset base64 inline threshold in bytes (default: 4096)`,
  )
  .option(
    '--ssr [entry]',
    `[string] build specified entry for server-side rendering`,
  )
  .option(
    '--sourcemap [output]',
    `[boolean | "inline" | "hidden"] output source maps for build (default: false)`,
  )
  .option(
    '--minify [minifier]',
    `[boolean | "terser" | "esbuild"] enable/disable minification, ` +
      `or specify minifier to use (default: esbuild)`,
  )
  .option('--manifest [name]', `[boolean | string] emit build manifest json`)
  .option('--ssrManifest [name]', `[boolean | string] emit ssr manifest json`)
  .option(
    '--emptyOutDir',
    `[boolean] force empty outDir when it's outside of root`,
  )
  .option('-w, --watch', `[boolean] rebuilds when modules have changed on disk`)
  .option('--app', `[boolean] same as \`builder: {}\``)
  .action(
    async (
      root: string,
      options: BuildEnvironmentOptions & BuilderCLIOptions & GlobalCLIOptions,
    ) => {
      // Check if this is a Nalth project
      const cwd = root ? path.resolve(root) : process.cwd()
      
      if (!isNalthProject(cwd) && !options.force) {
        // eslint-disable-next-line no-console
        console.error(`
${colors.red('🚨 Not a Nalth project!')}

${colors.yellow('Nalth CLI should only be used in projects created with create-nalth.')}

${colors.cyan('To create a new Nalth project:')}
  ${colors.white('npx create-nalth my-app')}

${colors.cyan('To force run anyway (not recommended):')}
  ${colors.white('nalth build --force')}

${colors.gray('Current directory:')} ${cwd}
`)
        process.exit(1)
      }

      filterDuplicateOptions(options)
      const { createBuilder } = await import('./build')

      const buildOptions: BuildEnvironmentOptions = cleanGlobalCLIOptions(
        cleanBuilderCLIOptions(options),
      )

      try {
        const inlineConfig: InlineConfig = {
          root,
          base: options.base,
          mode: options.mode,
          configFile: options.config,
          configLoader: options.configLoader,
          logLevel: options.logLevel,
          clearScreen: options.clearScreen,
          build: buildOptions,
          ...(options.app ? { builder: {} } : {}),
        }
        const builder = await createBuilder(inlineConfig, null)
        await builder.buildApp()
      } catch (e) {
        createLogger(options.logLevel).error(
          colors.red(`error during build:\n${e.stack}`),
          { error: e },
        )
        process.exit(1)
      } finally {
        stopProfiler((message) => createLogger(options.logLevel).info(message))
      }
    },
  )

// optimize
cli
  .command(
    'optimize [root]',
    'pre-bundle dependencies (deprecated, the pre-bundle process runs automatically and does not need to be called)',
  )
  .option(
    '--force',
    `[boolean] force the optimizer to ignore the cache and re-bundle`,
  )
  .action(
    async (root: string, options: { force?: boolean } & GlobalCLIOptions) => {
      filterDuplicateOptions(options)
      const { optimizeDeps } = await import('./optimizer')
      try {
        const config = await resolveConfig(
          {
            root,
            base: options.base,
            configFile: options.config,
            configLoader: options.configLoader,
            logLevel: options.logLevel,
            mode: options.mode,
          },
          'serve',
        )
        await optimizeDeps(config, options.force, true)
      } catch (e) {
        createLogger(options.logLevel).error(
          colors.red(`error when optimizing deps:\n${e.stack}`),
          { error: e },
        )
        process.exit(1)
      }
    },
  )

// preview
cli
  .command('preview [root]', 'locally preview production build')
  .option('--host [host]', `[string] specify hostname`, { type: [convertHost] })
  .option('--port <port>', `[number] specify port`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .action(
    async (
      root: string,
      options: {
        host?: string | boolean
        port?: number
        open?: boolean | string
        strictPort?: boolean
        outDir?: string
      } & GlobalCLIOptions,
    ) => {
      filterDuplicateOptions(options)
      const { preview } = await import('./preview')
      try {
        const server = await preview({
          root,
          base: options.base,
          configFile: options.config,
          configLoader: options.configLoader,
          logLevel: options.logLevel,
          mode: options.mode,
          build: {
            outDir: options.outDir,
          },
          preview: {
            port: options.port,
            strictPort: options.strictPort,
            host: options.host,
            open: options.open,
          },
        })
        server.printUrls()
        server.bindCLIShortcuts({ print: true })
      } catch (e) {
        createLogger(options.logLevel).error(
          colors.red(`error when starting preview server:\n${e.stack}`),
          { error: e },
        )
        process.exit(1)
      } finally {
        stopProfiler((message) => createLogger(options.logLevel).info(message))
      }
    },
  )

// test
cli
  .command('test [pattern]', 'run tests with Vitest')
  .option('--watch', `[boolean] run tests in watch mode`)
  .option('--run', `[boolean] run tests once`)
  .option('--coverage', `[boolean] generate coverage report`)
  .option('--ui', `[boolean] open Vitest UI`)
  .option('--reporter <name>', `[string] test reporter`)
  .option('--mode <mode>', `[string] test mode (unit|integration|e2e|browser)`)
  .option('--security', `[boolean] run with security checks`)
  .option('--bail', `[boolean] stop on first failure`)
  .option('--threads', `[boolean] enable/disable threads`)
  .option('--isolate', `[boolean] enable/disable test isolation`)
  .action(async (pattern: string | undefined, options: any) => {
    const { testCommand } = await import('./cli/test-command.js')
    await testCommand(pattern, options)
  })

// test:init
cli
  .command('test:init', 'initialize test configuration')
  .option('--template <name>', `[string] test template`)
  .action(async (options: any) => {
    const { initTestCommand } = await import('./cli/test-command.js')
    await initTestCommand(options)
  })

// lint
cli
  .command('lint [pattern]', 'lint code with ESLint and security checks')
  .option('--fix', `[boolean] automatically fix problems`)
  .option('--cache', `[boolean] use cache (default: true)`)
  .option('--security', `[boolean] run security-focused linting`)
  .option('--strict', `[boolean] use strict rules`)
  .option('--format <format>', `[string] output format (stylish|json|compact|html)`)
  .option('--quiet', `[boolean] report errors only`)
  .option('--max-warnings <number>', `[number] max warnings before error`)
  .action(async (pattern: string | undefined, options: any) => {
    const { lintCommand } = await import('./cli/lint-command.js')
    await lintCommand(pattern, options)
  })

// lint:init
cli
  .command('lint:init', 'initialize linting configuration')
  .option('--strict', `[boolean] use strict rules`)
  .option('--security', `[boolean] enable security plugins`)
  .action(async (options: any) => {
    const { initLintCommand } = await import('./cli/lint-command.js')
    await initLintCommand(options)
  })

// fmt
cli
  .command('fmt [pattern]', 'format code with Prettier')
  .option('--check', `[boolean] check formatting without writing`)
  .option('--write', `[boolean] write formatted files (default: true)`)
  .option('--cache', `[boolean] use cache (default: true)`)
  .action(async (pattern: string | undefined, options: any) => {
    const { fmtCommand } = await import('./cli/fmt-command.js')
    await fmtCommand(pattern, options)
  })

// fmt:init
cli
  .command('fmt:init', 'initialize formatting configuration')
  .option('--strict', `[boolean] use strict formatting rules`)
  .action(async (options: any) => {
    const { initFmtCommand } = await import('./cli/fmt-command.js')
    await initFmtCommand(options)
  })

// run
cli
  .command('run <task>', 'run tasks with smart caching')
  .option('--cache', `[boolean] use task cache (default: true)`)
  .option('--force', `[boolean] force run, skip cache`)
  .option('--parallel', `[boolean] run tasks in parallel`)
  .option('--dry-run', `[boolean] show what would run`)
  .action(async (task: string, options: any) => {
    const { runCommand } = await import('./cli/run-command.js')
    await runCommand(task, options)
  })

// run:init
cli
  .command('run:init', 'initialize task runner')
  .action(async () => {
    const { initRunCommand } = await import('./cli/run-command.js')
    await initRunCommand()
  })

// ui
cli
  .command('ui', 'open advanced devtools UI')
  .action(async () => {
    const { uiCommand } = await import('./cli/ui-command.js')
    await uiCommand()
  })

// lib
cli
  .command('lib', 'build library with best practices')
  .option('--watch', `[boolean] watch mode`)
  .action(async (options: any) => {
    const { libCommand } = await import('./cli/lib-command.js')
    await libCommand(options)
  })

// lib:init
cli
  .command('lib:init', 'initialize library configuration')
  .action(async () => {
    const { initLibCommand } = await import('./cli/lib-command.js')
    await initLibCommand()
  })

// install
cli
  .command('install [packages...]', 'securely install packages')
  .alias('i')
  .option('--secure', `[boolean] enable security checks (default: true)`)
  .option('--verify', `[boolean] verify package integrity (default: true)`)
  .option('--audit', `[boolean] audit after installation (default: true)`)
  .option('--use-bun', `[boolean] use Bun package manager`)
  .option('--save-dev', `[boolean] save as dev dependency`)
  .option('--production', `[boolean] production install`)
  .option('--frozen', `[boolean] use frozen lockfile`)
  .option('--registry <url>', `[string] custom registry URL`)
  .action(async (packages: string[], options: any) => {
    const { installCommand } = await import('./cli/install-command.js')
    await installCommand(packages, options)
  })

// uninstall
cli
  .command('uninstall <packages...>', 'uninstall packages')
  .alias('remove')
  .alias('rm')
  .action(async (packages: string[], options: any) => {
    const { uninstallCommand } = await import('./cli/install-command.js')
    await uninstallCommand(packages, options)
  })

// audit (existing security command)
cli
  .command('audit', 'run security audit')
  .option('--path <path>', `[string] project path`)
  .option('--format <format>', `[string] output format (json|text)`)
  .option('--severity <level>', `[string] minimum severity (low|moderate|high|critical)`)
  .option('--fix', `[boolean] auto-fix vulnerabilities`)
  .action(async (options: any) => {
    const { auditCommand } = await import('./cli/security-commands.js')
    await auditCommand(options)
  })

// security:report
cli
  .command('security:report', 'generate security report')
  .option('--path <path>', `[string] project path`)
  .option('--output <file>', `[string] output file`)
  .option('--detailed', `[boolean] detailed report`)
  .action(async (options: any) => {
    const { securityReportCommand } = await import('./cli/security-commands.js')
    await securityReportCommand(options)
  })

// security:scan
cli
  .command('security:scan <package>', 'scan package for security issues')
  .option('--version <version>', `[string] package version`)
  .option('--detailed', `[boolean] detailed output`)
  .action(async (packageName: string, options: any) => {
    const { scanPackageCommand } = await import('./cli/security-commands.js')
    await scanPackageCommand(packageName, options)
  })

// security:init
cli
  .command('security:init', 'initialize security configuration')
  .option('--strict', `[boolean] strict security mode`)
  .option('--framework <name>', `[string] framework name`)
  .action(async (options: any) => {
    const { securityInitCommand } = await import('./cli/security-commands.js')
    await securityInitCommand(options)
  })

cli.help()
cli.version(VERSION)

cli.parse()
