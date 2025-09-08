import express from 'express'
import https from 'node:https'
import http from 'node:http'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import chalk from 'chalk'
import { WebSocketServer } from 'ws'
import { generateSecureCertificate, validateCertificate } from '../security/certificate.js'
import { 
  createSecurityMiddleware, 
  httpsRedirectMiddleware, 
  additionalSecurityHeaders,
  SecurityConfig 
} from '../security/middleware.js'

export interface NalthServerConfig {
  port?: number
  host?: string
  https?: {
    enabled: boolean
    autoGenerate?: boolean
    certDir?: string
    cert?: string
    key?: string
  }
  security?: SecurityConfig
  cors?: {
    origin?: string | string[] | boolean
    credentials?: boolean
  }
  compression?: boolean
  logging?: boolean
  staticDir?: string
  hotReload?: boolean
}

export class NalthServer {
  private app: express.Application
  private server: http.Server | https.Server | null = null
  private wsServer: WebSocketServer | null = null
  private config: Required<NalthServerConfig>

  constructor(config: NalthServerConfig = {}) {
    this.app = express()
    this.config = this.mergeConfig(config)
    this.setupMiddleware()
  }

  private mergeConfig(config: NalthServerConfig): Required<NalthServerConfig> {
    return {
      port: config.port || 3000,
      host: config.host || 'localhost',
      https: {
        enabled: config.https?.enabled ?? true,
        autoGenerate: config.https?.autoGenerate ?? true,
        certDir: config.https?.certDir || join(process.cwd(), '.nalth', 'certs'),
        cert: config.https?.cert || '',
        key: config.https?.key || ''
      },
      security: config.security || {},
      cors: {
        origin: config.cors?.origin ?? 'http://localhost:3000',
        credentials: config.cors?.credentials ?? true
      },
      compression: config.compression ?? true,
      logging: config.logging ?? true,
      staticDir: config.staticDir || join(process.cwd(), 'public'),
      hotReload: config.hotReload ?? true
    }
  }

  private setupMiddleware() {
    // Logging
    if (this.config.logging) {
      this.app.use(morgan('combined'))
    }

    // Security middleware
    const securityMiddlewares = createSecurityMiddleware(this.config.security)
    securityMiddlewares.forEach(middleware => this.app.use(middleware))
    
    // Additional security headers
    this.app.use(additionalSecurityHeaders)

    // CORS
    this.app.use(cors({
      origin: this.config.cors.origin,
      credentials: this.config.cors.credentials
    }))

    // Compression
    if (this.config.compression) {
      this.app.use(compression())
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    this.app.use(cookieParser())

    // Static files
    if (existsSync(this.config.staticDir)) {
      this.app.use(express.static(this.config.staticDir))
    }

    // Hot reload WebSocket endpoint
    if (this.config.hotReload) {
      this.setupHotReload()
    }
  }

  private setupHotReload(): void {
    this.app.get('/__nalth_ws', (_req, res) => {
      res.send(`
        <script>
          const ws = new WebSocket('${this.config.https.enabled ? 'wss' : 'ws'}://${this.config.host}:${this.config.port}/__nalth_hot');
          ws.onmessage = (event) => {
            if (event.data === 'reload') {
              window.location.reload();
            }
          };
          ws.onopen = () => console.log('🔥 Nalth hot reload connected');
          ws.onerror = (error) => console.error('Hot reload error:', error);
        </script>
      `)
    })
  }

  private async setupHttpsServer(): Promise<https.Server | http.Server> {
    if (!this.config.https.enabled) {
      console.log(chalk.yellow('⚠ HTTPS disabled - using HTTP server'))
      return http.createServer(this.app)
    }

    let cert: string
    let key: string

    if (this.config.https.cert && this.config.https.key) {
      cert = this.config.https.cert
      key = this.config.https.key
      
      // Validate provided certificate
      if (!validateCertificate(cert)) {
        console.log(chalk.yellow('⚠ Provided certificate is invalid, generating new one'))
        const generated = generateSecureCertificate({
          certDir: this.config.https.certDir!
        })
        cert = generated.cert
        key = generated.key
      }
    } else if (this.config.https.autoGenerate) {
      const generated = generateSecureCertificate({
        certDir: this.config.https.certDir!,
        domain: this.config.host
      })
      cert = generated.cert
      key = generated.key
    } else {
      throw new Error('HTTPS enabled but no certificates provided and autoGenerate is disabled')
    }

    const httpsOptions = {
      cert,
      key,
      // Security-focused TLS configuration
      secureProtocol: 'TLSv1_2_method',
      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384'
      ].join(':'),
      honorCipherOrder: true
    }

    return https.createServer(httpsOptions, this.app)
  }

  private setupWebSocket() {
    if (!this.config.hotReload || !this.server) return

    this.wsServer = new WebSocketServer({
      server: this.server,
      path: '/__nalth_hot'
    })

    this.wsServer.on('connection', (ws) => {
      console.log(chalk.blue('🔌 Hot reload client connected'))
      
      ws.on('close', () => {
        console.log(chalk.dim('🔌 Hot reload client disconnected'))
      })
    })
  }

  public use(path: string | express.RequestHandler, handler?: express.RequestHandler): NalthServer {
    if (typeof path === 'string' && handler) {
      this.app.use(path, handler)
    } else if (typeof path === 'function') {
      this.app.use(path)
    }
    return this
  }

  public get(path: string, handler: express.RequestHandler): NalthServer {
    this.app.get(path, handler)
    return this
  }

  public post(path: string, handler: express.RequestHandler): NalthServer {
    this.app.post(path, handler)
    return this
  }

  public put(path: string, handler: express.RequestHandler): NalthServer {
    this.app.put(path, handler)
    return this
  }

  public delete(path: string, handler: express.RequestHandler): NalthServer {
    this.app.delete(path, handler)
    return this
  }

  public async listen(): Promise<void> {
    try {
      this.server = await this.setupHttpsServer()
      this.setupWebSocket()

      return new Promise((resolve, reject) => {
        if (!this.server) {
          reject(new Error('Server not initialized'))
          return
        }

        this.server.listen(this.config.port, this.config.host, () => {
          const protocol = this.config.https.enabled ? 'https' : 'http'
          const url = `${protocol}://${this.config.host}:${this.config.port}`
          
          console.log(chalk.green('🚀 Nalth server started successfully!'))
          console.log(chalk.blue(`   Local: ${url}`))
          console.log(chalk.dim(`   Security: ${this.config.https.enabled ? 'HTTPS ✓' : 'HTTP ⚠'}`))
          console.log(chalk.dim(`   Hot Reload: ${this.config.hotReload ? 'Enabled ✓' : 'Disabled'}`))
          
          resolve()
        })

        this.server.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            console.error(chalk.red(`✗ Port ${this.config.port} is already in use`))
            console.log(chalk.yellow(`💡 Try using a different port or stop the existing server`))
            console.log(chalk.dim(`   You can kill processes on port ${this.config.port} with: lsof -ti:${this.config.port} | xargs kill -9`))
          } else {
            console.error(chalk.red('✗ Server error:'), error.message)
          }
          reject(error)
        })
      })
    } catch (error) {
      console.error(chalk.red('✗ Failed to start server:'), error)
      throw error
    }
  }

  public reload(): void {
    if (this.wsServer) {
      this.wsServer.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send('reload')
        }
      })
    }
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.wsServer) {
        this.wsServer.close()
      }
      
      if (this.server) {
        this.server.close(() => {
          console.log(chalk.yellow('🛑 Nalth server stopped'))
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  public getApp(): express.Application {
    return this.app
  }
}
