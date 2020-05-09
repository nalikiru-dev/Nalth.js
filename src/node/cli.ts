const start = Date.now()

import os from 'os'
import chalk from 'chalk'
import { Ora } from 'ora'
import { ServerConfig } from './server'
import { BuildOptions } from './build'

function logHelp() {
  console.log(`
Usage: vite [command] [args] [--options]

Commands:
  vite                       Start server in current directory.
  vite serve [root=cwd]      Start server in target directory.
  vite build [root=cwd]      Build target directory.

Options:
  --help, -h                 [boolean] show help
  --version, -v              [boolean] show version
  --port                     [number]  port to use for serve
  --open                     [boolean] open browser on server start
  --base                     [string]  public base path for build (default: /)
  --outDir                   [string]  output directory for build (default: dist)
  --assetsDir                [string]  directory under outDir to place assets in (default: assets)
  --assetsInlineLimit        [number]  static asset base64 inline threshold in bytes (default: 4096)
  --sourcemap                [boolean] output source maps for build (default: false)
  --minify                   [boolean | 'terser' | 'esbuild'] disable minification, or specify
                                       minifier to use. (default: 'terser')
  --jsx-factory              [string]  (default: React.createElement)
  --jsx-fragment             [string]  (default: React.Fragment)
`)
}

console.log(chalk.cyan(`vite v${require('../package.json').version}`))

const args = parseArgs()
if (args.help || args.h) {
  logHelp()
} else if (args.version || args.v) {
  // noop
} else if (!args.command || args.command === 'serve') {
  runServe(args)
} else if (args.command === 'build') {
  runBuild(args)
} else if (args.command === 'optimize') {
  // runOptimize()
} else {
  console.error(chalk.red(`unknown command: ${args.command}`))
  process.exit(1)
}

function parseArgs() {
  const argv = require('minimist')(process.argv.slice(2))
  // convert debug flag
  if (argv.debug) {
    process.env.DEBUG = `vite:` + (argv.debug === true ? '*' : argv.debug)
  }
  // map jsx args
  if (argv['jsx-factory']) {
    ;(argv.jsx || (argv.jsx = {})).factory = argv['jsx-factory']
  }
  if (argv['jsx-fragment']) {
    ;(argv.jsx || (argv.jsx = {})).fragment = argv['jsx-fragment']
  }
  // cast xxx=false into actual `false`
  Object.keys(argv).forEach((key) => {
    if (argv[key] === 'false') {
      argv[key] = false
    }
  })
  // command
  if (argv._[0]) {
    argv.command = argv._[0]
  }
  // normalize root
  // assumes all commands are in the form of `vite [command] [root]`
  if (argv._[1] && !argv.root) {
    argv.root = argv._[1]
  }
  return argv
}

function runServe(
  args: ServerConfig & {
    port?: number
    open?: boolean
  }
) {
  const server = require('../dist').createServer(args)

  let port = args.port || 3000
  server.on('error', (e: Error & { code?: string }) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying another one...`)
      setTimeout(() => {
        server.close()
        server.listen(++port)
      }, 100)
    } else {
      console.error(chalk.red(`[vite] server error:`))
      console.error(e)
    }
  })

  server.listen(port, () => {
    console.log()
    console.log(`  Dev server running at:`)
    const interfaces = os.networkInterfaces()
    Object.keys(interfaces).forEach((key) => {
      ;(interfaces[key] || [])
        .filter((details) => details.family === 'IPv4')
        .map((detail) => {
          return {
            type: detail.address.includes('127.0.0.1')
              ? 'Local:   '
              : 'Network: ',
            ip: detail.address.replace('127.0.0.1', 'localhost')
          }
        })
        .forEach((address: { type?: String; ip?: String }) => {
          const url = `http://${address.ip}:${chalk.bold(port)}/`
          console.log(`  > ${address.type} ${chalk.cyan(url)}`)
        })
    })
    console.log()
    require('debug')('vite:server')(`server ready in ${Date.now() - start}ms.`)

    if (args.open) {
      require('./utils/openBrowser').openBrowser(`http://localhost:${port}`)
    }
  })
}

async function runBuild(args: BuildOptions) {
  let spinner: Ora | undefined
  const msg = 'Building for production...'
  if (process.env.DEBUG || process.env.NODE_ENV === 'test') {
    console.log(msg)
  } else {
    spinner = require('ora')(msg + '\n').start()
  }
  try {
    await require('../dist').build(args)
    spinner && spinner.stop()
    process.exit(0)
  } catch (err) {
    spinner && spinner.stop()
    console.error(chalk.red(`[vite] Build errored out.`))
    console.error(err)
    process.exit(1)
  }
}
