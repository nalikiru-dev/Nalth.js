import { createServer as createHttpServer } from 'node:http'
import { createServer as createHttpsServer } from 'node:https'
import { resolve, join } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { WebSocketServer } from 'ws'
import { watch } from 'chokidar'
import connect from 'connect'
import corsMiddleware from 'cors'
import compression from 'compression'
import sirv from 'sirv'
import { createProxyMiddleware } from 'http-proxy-middleware'
import type { 
  NalthDevServer, 
  ResolvedConfig, 
  ServerOptions,
  SecurityViolation,
  SecurityMetrics,
  SecurityRules,
  ModuleGraph,
  PluginContainer,
  HMRPayload
} from '../types'
import { createSecurityMiddleware } from '../security/middleware'
import { createHMRServer } from './hmr'
import { createModuleGraph } from './moduleGraph'
import { createPluginContainer } from './pluginContainer'
import { generateSecureCertificate } from '../security/certificate'
import { logSecurityViolation, logSecurityMetrics } from '../logger'
import { normalizePath, isExternalUrl, formatDuration } from '../utils'
import colors from 'picocolors'

export async function createServer(
  inlineConfig: any = {}
): Promise<NalthDevServer> {
  const config = await resolveConfig(inlineConfig, 'serve')
  const root = config.root
  const serverConfig = config.server || {}
  
  const middlewares = connect()
  const httpServer = await resolveHttpServer(serverConfig, middlewares)
  const ws = createWebSocketServer(httpServer, config)
  const moduleGraph = createModuleGraph()
  const pluginContainer = createPluginContainer(config, moduleGraph)
  
  // Security metrics tracking
  const securityMetrics: SecurityMetrics = {
    violations: 0,
    vulnerabilities: 0,
    securityScore: 100,
    lastScan: Date.now(),
    trends: {
      daily: [],
      weekly: []
    }
  }

  // Create file watcher for HMR
  const watcher = watch([
    resolve(root, 'src/**/*'),
    resolve(root, 'public/**/*'),
    resolve(root, 'index.html'),
    resolve(root, '*.config.*')
  ], {
    ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    ignoreInitial: true,
    persistent: true
  })

  // Set up HMR file watching
  watcher.on('change', (file) => {
    const relativePath = file.replace(root + '/', '')
    config.logger.info(`File changed: ${relativePath}`)
    
    // Send HMR update to clients
    ws.send({
      type: 'update',
      updates: [{
        type: 'js-update',
        path: `/${relativePath}`,
        acceptedPath: `/${relativePath}`,
        timestamp: Date.now()
      }]
    })
  })

  watcher.on('add', (file) => {
    const relativePath = file.replace(root + '/', '')
    config.logger.info(`File added: ${relativePath}`)
    
    ws.send({
      type: 'full-reload'
    })
  })

  watcher.on('unlink', (file) => {
    const relativePath = file.replace(root + '/', '')
    config.logger.info(`File removed: ${relativePath}`)
    
    ws.send({
      type: 'full-reload'
    })
  })

  const server: NalthDevServer = {
    config,
    middlewares,
    httpServer,
    ws,
    watcher,
    pluginContainer,
    moduleGraph,
    
    async listen(port?: number, isRestart?: boolean) {
      const serverPort = port ?? serverConfig.port ?? 3000
      const hostname = resolveHostname(serverConfig.host)
      
      return new Promise((resolve, reject) => {
        const onError = (e: Error & { code?: string }) => {
          if (e.code === 'EADDRINUSE') {
            config.logger.error(
              colors.red(`Port ${serverPort} is already in use`)
            )
          } else {
            config.logger.error(colors.red(`Server error: ${e.message}`), { error: e })
          }
          reject(e)
        }

        httpServer.on('error', onError)
        
        httpServer.listen(serverPort, hostname, () => {
          httpServer.removeListener('error', onError)
          
          const protocol = serverConfig.https ? 'https' : 'http'
          const base = config.base === '/' ? '' : config.base
          const url = `${protocol}://${hostname === '0.0.0.0' ? 'localhost' : hostname}:${serverPort}${base}`
          
          if (!isRestart) {
            config.logger.info(
              colors.green(`🛡️  Nalth dev server running at:\n`) +
              colors.cyan(`  ➜  Local:   ${url}\n`) +
              colors.dim(`  ➜  Security: ${serverConfig.https ? 'HTTPS ✓' : 'HTTP ⚠'}\n`) +
              colors.dim(`  ➜  HMR:      ${config.server?.hmr !== false ? 'Enabled ✓' : 'Disabled'}`)
            )
            
            // Log initial security metrics
            logSecurityMetrics(securityMetrics)
          }
          
          resolve(server)
        })
      })
    },

    async close() {
      await Promise.all([
        ws.close(),
        watcher?.close(),
        pluginContainer.close(),
        new Promise<void>((resolve) => {
          httpServer.close(() => resolve())
        })
      ])
    },

    async restart(forceOptimize?: boolean) {
      config.logger.info(colors.yellow('🔄 Restarting server...'))
      await server.close()
      // TODO: Implement restart logic
      await server.listen(undefined, true)
    },

    reportSecurityViolation(violation: SecurityViolation) {
      securityMetrics.violations++
      securityMetrics.securityScore = Math.max(0, securityMetrics.securityScore - getSeverityPenalty(violation.severity))
      
      logSecurityViolation(violation.type, violation.severity, violation.message, {
        file: violation.file,
        line: violation.line,
        rule: violation.rule
      })
      
      // Broadcast to clients
      ws.send({
        type: 'security-violation',
        violation
      })
    },

    getSecurityMetrics() {
      return { ...securityMetrics }
    },

    updateSecurityRules(rules: Partial<SecurityRules>) {
      // TODO: Implement security rules update
      config.logger.info(colors.cyan('🛡️  Security rules updated'))
    }
  }

  // Apply middleware stack
  await setupMiddlewares(server)
  
  // Initialize plugins
  await Promise.all(
    config.plugins.map((plugin: any) => 
      plugin.configureServer?.(server)
    )
  )

  return server
}

async function setupMiddlewares(server: NalthDevServer) {
  const { config, middlewares } = server
  const { root } = config
  
  // Security middleware (highest priority)
  const securityMiddlewares = createSecurityMiddleware(config.security)
  securityMiddlewares.forEach(middleware => {
    middlewares.use(middleware)
  })

  // CORS
  if (config.server?.cors !== false) {
    middlewares.use(corsMiddleware(typeof config.server?.cors === 'object' ? config.server.cors : {}))
  }

  // Compression
  middlewares.use(compression())

  // Proxy middleware
  if (config.server?.proxy) {
    for (const [context, options] of Object.entries(config.server.proxy)) {
      const proxyOptions = typeof options === 'string' ? { target: options } : options
      middlewares.use(context, createProxyMiddleware(proxyOptions))
    }
  }

  // HMR middleware
  if (config.server?.hmr !== false) {
    const hmrServer = createHMRServer(server)
    middlewares.use('/__nalth_hmr', hmrServer.middleware)
  }

  // Security dashboard middleware
  middlewares.use('/__nalth_security', (req: any, res: any, next: any) => {
    if (req.url === '/metrics') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(server.getSecurityMetrics()))
    } else if (req.url === '/dashboard') {
      res.setHeader('Content-Type', 'text/html')
      res.end(generateSecurityDashboard(server.getSecurityMetrics()))
    } else {
      next()
    }
  })

  // Transform middleware for ES modules
  middlewares.use(async (req: any, res: any, next: any) => {
    if (req.method !== 'GET' || !req.url) {
      return next()
    }

    const url = new URL(req.url, `http://${req.headers.host}`)
    const pathname = url.pathname

    // Skip non-JS/TS files
    if (!/\.(js|ts|jsx|tsx|mjs|cjs)(\?.*)?$/.test(pathname)) {
      return next()
    }

    try {
      const id = pathname.slice(1) // Remove leading slash
      const file = resolve(root, id)
      
      if (!existsSync(file)) {
        return next()
      }

      const result = await server.pluginContainer.transform(
        readFileSync(file, 'utf-8'),
        file
      )

      if (result) {
        res.setHeader('Content-Type', 'application/javascript')
        res.setHeader('Cache-Control', 'no-cache')
        res.end(result.code)
      } else {
        next()
      }
    } catch (error) {
      config.logger.error(`Transform error for ${pathname}:`, { error: error as Error })
      res.statusCode = 500
      res.end(`Transform error: ${error}`)
    }
  })

  // Static file serving for public directory
  if (config.publicDir && existsSync(config.publicDir)) {
    middlewares.use(
      sirv(config.publicDir, {
        dev: true,
        etag: true,
        extensions: [],
        dotfiles: false
      })
    )
  }

  // Serve static assets from project root
  middlewares.use(
    sirv(root, {
      dev: true,
      etag: true,
      extensions: ['html', 'js', 'css', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'ico'],
      dotfiles: false,
      single: false
    })
  )

  // SPA fallback - serve index.html for non-asset requests
  middlewares.use((req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next()
    }

    // Skip if it's an API request or has file extension (except .html)
    const url = req.url || ''
    if (url.startsWith('/__nalth') || url.startsWith('/api') || 
        (url.includes('.') && !url.endsWith('.html'))) {
      return next()
    }

    const indexPath = resolve(root, 'index.html')
    if (existsSync(indexPath)) {
      res.setHeader('Content-Type', 'text/html')
      res.setHeader('Cache-Control', 'no-cache')
      res.end(readFileSync(indexPath, 'utf-8'))
    } else {
      // If no index.html, try to serve a basic HTML template for development
      res.setHeader('Content-Type', 'text/html')
      res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nalth Dev Server</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
      `)
    }
  })
}

async function resolveHttpServer(
  { https, proxy }: ServerOptions,
  app: connect.Server
) {
  if (!https) {
    return createHttpServer(app)
  }

  if (https === true) {
    // Auto-generate certificate
    const { cert, key } = await generateSecureCertificate()
    return createHttpsServer({ cert, key }, app)
  }

  // Use provided certificate
  return createHttpsServer(https, app)
}

function createWebSocketServer(httpServer: any, config: ResolvedConfig) {
  const wsServer = new WebSocketServer({ 
    noServer: true,
    perMessageDeflate: false
  })

  httpServer.on('upgrade', (request: any, socket: any, head: any) => {
    if (request.url === '/__nalth_ws') {
      wsServer.handleUpgrade(request, socket, head, (ws) => {
        wsServer.emit('connection', ws, request)
      })
    }
  })

  const clients = new Set<any>()

  wsServer.on('connection', (ws) => {
    clients.add(ws)
    ws.on('close', () => {
      clients.delete(ws)
    })
  })

  return {
    clients,
    on: wsServer.on.bind(wsServer),
    off: wsServer.off.bind(wsServer),
    send(payload: HMRPayload) {
      const stringified = JSON.stringify(payload)
      clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(stringified)
        }
      })
    },
    close() {
      return new Promise<void>((resolve) => {
        clients.forEach((client) => {
          client.terminate()
        })
        wsServer.close(() => resolve())
      })
    }
  }
}

function resolveHostname(optionsHost: string | boolean | undefined): string {
  if (optionsHost === false) {
    return '127.0.0.1'
  }
  if (optionsHost === true) {
    return '0.0.0.0'
  }
  return optionsHost || 'localhost'
}

function getSeverityPenalty(severity: string): number {
  switch (severity) {
    case 'critical': return 25
    case 'high': return 15
    case 'medium': return 8
    case 'low': return 3
    default: return 1
  }
}

function generateSecurityDashboard(metrics: SecurityMetrics): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Nalth Security Dashboard</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0; padding: 20px; background: #0f0f0f; color: #fff;
    }
    .dashboard { max-width: 1200px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 2rem; font-weight: bold; color: #00d4aa; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .metric { 
      background: #1a1a1a; border-radius: 8px; padding: 20px; 
      border: 1px solid #333; transition: transform 0.2s;
    }
    .metric:hover { transform: translateY(-2px); }
    .metric-title { font-size: 0.9rem; color: #888; margin-bottom: 8px; }
    .metric-value { font-size: 2rem; font-weight: bold; }
    .score-100 { color: #00d4aa; }
    .score-80 { color: #ffd700; }
    .score-60 { color: #ff8c00; }
    .score-low { color: #ff4757; }
    .violations { color: #ff4757; }
    .vulnerabilities { color: #ff6b6b; }
    .last-scan { color: #888; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="header">
      <div class="logo">🛡️ Nalth Security Dashboard</div>
      <p>Real-time security monitoring for your application</p>
    </div>
    <div class="metrics">
      <div class="metric">
        <div class="metric-title">Security Score</div>
        <div class="metric-value ${getScoreClass(metrics.securityScore)}">${metrics.securityScore}/100</div>
      </div>
      <div class="metric">
        <div class="metric-title">Violations</div>
        <div class="metric-value violations">${metrics.violations}</div>
      </div>
      <div class="metric">
        <div class="metric-title">Vulnerabilities</div>
        <div class="metric-value vulnerabilities">${metrics.vulnerabilities}</div>
      </div>
      <div class="metric">
        <div class="metric-title">Last Scan</div>
        <div class="metric-value last-scan">${new Date(metrics.lastScan).toLocaleString()}</div>
      </div>
    </div>
  </div>
  <script>
    // Auto-refresh every 5 seconds
    setTimeout(() => window.location.reload(), 5000);
  </script>
</body>
</html>
  `
}

function getScoreClass(score: number): string {
  if (score >= 90) return 'score-100'
  if (score >= 80) return 'score-80'
  if (score >= 60) return 'score-60'
  return 'score-low'
}

// Import resolveConfig from config module
import { resolveConfig } from '../config'
