#!/usr/bin/env node

import { cac } from 'cac'
import colors from 'picocolors'
import { version } from '../../package.json'
import { createServer } from './server'
import { build } from './build'
import { resolveConfig } from './config'
import { logSecurityMetrics } from './logger'

const cli = cac('nalth')

// Global options
cli
  .option('--host [host]', 'Specify hostname')
  .option('--port <port>', 'Specify port')
  .option('--https', 'Use HTTPS')
  .option('--open [path]', 'Open browser on startup')
  .option('--cors', 'Enable CORS')
  .option('--strictPort', 'Exit if specified port is already in use')
  .option('--force', 'Force the optimizer to ignore the cache and re-bundle')
  .help()
  .version(version)

// Dev server command
cli
  .command('[root]', 'Start dev server')
  .alias('serve')
  .alias('dev')
  .option('--security-level <level>', 'Security level: permissive | balanced | strict', {
    default: 'balanced'
  })
  .option('--security-dashboard', 'Enable security dashboard', { default: true })
  .action(async (root: string, options: any) => {
    try {
      const server = await createServer({
        root,
        server: {
          host: options.host,
          port: options.port,
          https: options.https,
          open: options.open,
          cors: options.cors,
          strictPort: options.strictPort
        },
        security: {
          level: options.securityLevel
        },
        optimizeDeps: {
          force: options.force
        }
      })

      await server.listen()

      // Show security dashboard info
      if (options.securityDashboard) {
        const protocol = options.https ? 'https' : 'http'
        const host = options.host || 'localhost'
        const port = options.port || 3000
        
        console.log(
          colors.cyan('\n🛡️  Security Dashboard: ') +
          colors.blue(`${protocol}://${host}:${port}/__nalth_security/dashboard`)
        )
      }

      // Log initial security metrics
      setTimeout(() => {
        logSecurityMetrics(server.getSecurityMetrics())
      }, 1000)

    } catch (e: any) {
      console.error(colors.red(`Error starting dev server:\n${e.stack}`))
      process.exit(1)
    }
  })

// Build command
cli
  .command('build [root]', 'Build for production')
  .option('--target <target>', 'Build target')
  .option('--outDir <dir>', 'Output directory')
  .option('--mode <mode>', 'Set env mode')
  .option('--sourcemap', 'Generate sourcemap')
  .option('--minify [minifier]', 'Enable/specify minifier')
  .option('--security-audit', 'Run security audit during build', { default: true })
  .action(async (root: string, options: any) => {
    try {
      const config = await resolveConfig({
        root,
        mode: options.mode,
        build: {
          target: options.target,
          outDir: options.outDir,
          sourcemap: options.sourcemap,
          minify: options.minify
        }
      }, 'build')

      await build(config)

      console.log(colors.green('✅ Build completed successfully!'))

    } catch (e: any) {
      console.error(colors.red(`Build failed:\n${e.stack}`))
      process.exit(1)
    }
  })

// Security audit command
cli
  .command('audit [root]', 'Run security audit')
  .option('--fix', 'Automatically fix issues when possible')
  .option('--report <format>', 'Generate report: json | html | console', { default: 'console' })
  .option('--fail-on <severity>', 'Fail on severity: low | medium | high | critical')
  .action(async (root: string, options: any) => {
    try {
      const { runSecurityAudit } = await import('./security/audit')
      
      const results = await runSecurityAudit({
        root: root || process.cwd(),
        fix: options.fix,
        reportFormat: options.report,
        failOnSeverity: options.failOn
      })

      if (results.failed > 0 && options.failOn) {
        process.exit(1)
      }

    } catch (e: any) {
      console.error(colors.red(`Security audit failed:\n${e.stack}`))
      process.exit(1)
    }
  })

// Create project command
cli
  .command('create <project-name>', 'Create a new Nalth project')
  .option('--template <template>', 'Project template')
  .option('--security-level <level>', 'Security level: permissive | balanced | strict', {
    default: 'balanced'
  })
  .action(async (projectName: string, options: any) => {
    try {
      const { createProject } = await import('./create')
      
      await createProject({
        name: projectName,
        template: options.template,
        securityLevel: options.securityLevel
      })

      console.log(colors.green(`\n🛡️  Project "${projectName}" created successfully!`))
      console.log(colors.cyan('\nNext steps:'))
      console.log(colors.dim(`  cd ${projectName}`))
      console.log(colors.dim('  npm run dev'))

    } catch (e: any) {
      console.error(colors.red(`Failed to create project:\n${e.stack}`))
      process.exit(1)
    }
  })

// Security dashboard command
cli
  .command('dashboard [root]', 'Open security dashboard')
  .option('--port <port>', 'Dashboard port', { default: 3001 })
  .action(async (root: string, options: any) => {
    try {
      const { startSecurityDashboard } = await import('./security/dashboard')
      
      await startSecurityDashboard({
        root: root || process.cwd(),
        port: options.port
      })

    } catch (e: any) {
      console.error(colors.red(`Failed to start security dashboard:\n${e.stack}`))
      process.exit(1)
    }
  })

// Plugin management commands
cli
  .command('plugin:list', 'List installed security plugins')
  .action(async () => {
    try {
      const { listPlugins } = await import('./plugins/manager')
      await listPlugins()
    } catch (e: any) {
      console.error(colors.red(`Failed to list plugins:\n${e.stack}`))
      process.exit(1)
    }
  })

cli
  .command('plugin:add <name>', 'Add a security plugin')
  .action(async (name: string) => {
    try {
      const { addPlugin } = await import('./plugins/manager')
      await addPlugin(name)
      console.log(colors.green(`✅ Plugin "${name}" added successfully!`))
    } catch (e: any) {
      console.error(colors.red(`Failed to add plugin:\n${e.stack}`))
      process.exit(1)
    }
  })

// Version and help
cli.help(() => {
  console.log(`
${colors.cyan('🛡️  Nalth')} ${colors.dim(`v${version}`)}
${colors.dim('Security-first web development framework')}

${colors.yellow('Usage:')}
  ${colors.green('nalth')}                     Start development server
  ${colors.green('nalth build')}               Build for production
  ${colors.green('nalth audit')}               Run security audit
  ${colors.green('nalth create <name>')}       Create new project
  ${colors.green('nalth dashboard')}           Open security dashboard

${colors.yellow('Options:')}
  --host [host]              Specify hostname
  --port <port>              Specify port
  --https                    Use HTTPS
  --security-level <level>   Security level (permissive|balanced|strict)

${colors.yellow('Examples:')}
  ${colors.dim('nalth --port 8080 --https')}
  ${colors.dim('nalth build --security-audit')}
  ${colors.dim('nalth create my-app --template secure-react')}
  ${colors.dim('nalth audit --fix --fail-on high')}

${colors.yellow('Learn more:')}
  ${colors.blue('https://nalth.dev/docs')}
`)
})

// Parse CLI arguments
cli.parse()

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(colors.red('Unhandled promise rejection:'), err)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(colors.red('Uncaught exception:'), err)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(colors.yellow('\n🛑 Shutting down Nalth server...'))
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log(colors.yellow('\n🛑 Shutting down Nalth server...'))
  process.exit(0)
})
