export default {
  port: 8080,
  host: 'localhost',
  https: {
    enabled: true,
    autoGenerate: true
  },
  security: {
    csp: {
      enabled: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'ws:', 'wss:']
      }
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    },
    audit: {
      enabled: true,
      logViolations: true
    }
  },
  cors: {
    origin: true,
    credentials: true
  },
  hotReload: true
}
