import { defineConfig } from 'nalth'

// https://www.nalthjs.com/config/
export default defineConfig({
  // NALTH Security Features - Enhanced CSP Configuration
  security: {
    https: {
      enabled: false, // Disable HTTPS for easier development (enable in production)
      autoGenerate: true, // Auto-generate dev certificates when enabled
    },
    csp: {
      enabled: true,
      reportOnly: false, // Set to true for development debugging
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'", // Required for Lit development and HMR
          "'unsafe-eval'", // Required for development tools
          'localhost:*', // Allow local development servers
          '127.0.0.1:*', // Allow local development servers
          'ws:', // WebSocket for HMR
          'wss:', // Secure WebSocket for HMR
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'", // Required for Lit component styles and HMR
          'fonts.googleapis.com',
        ],
        'img-src': [
          "'self'",
          'data:', // Allow data URLs for images
          'https:', // Allow HTTPS images
          'blob:', // Allow blob URLs
        ],
        'font-src': ["'self'", 'https:', 'data:', 'fonts.gstatic.com'],
        'connect-src': [
          "'self'",
          'ws:', // WebSocket connections
          'wss:', // Secure WebSocket connections
          'localhost:*', // Local development
          '127.0.0.1:*', // Local development
          'https://api.github.com', // Example API endpoint
        ],
        'media-src': ["'self'", 'data:', 'blob:'],
        'object-src': ["'none'"],
        'child-src': ["'self'", 'blob:'],
        'worker-src': ["'self'", 'blob:'],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'manifest-src': ["'self'"],
        'upgrade-insecure-requests': [],
      },
      reportUri: '/__nalth/csp-report', // CSP violation reporting
    },
    sri: {
      enabled: true,
      algorithms: ['sha384', 'sha512'],
      includeInline: false,
      autoGenerate: true,
      enforcement: 'strict',
    },
    audit: {
      enabled: true,
      failOnViolations: false,
      realTimeMonitoring: true,
    },
    headers: {
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: false,
      },
      frameOptions: 'DENY',
      contentTypeOptions: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
      coep: 'require-corp',
      coop: 'same-origin',
      corp: 'same-origin',
      dnsPrefetchControl: false,
      downloadOptions: true,
      crossDomainPolicy: 'none',
      expectCT: {
        maxAge: 86400,
        enforce: true,
      },
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        usb: [],
        magnetometer: [],
        gyroscope: [],
        accelerometer: [],
        'display-capture': [],
        'document-domain': [],
        'encrypted-media': [],
        fullscreen: ['self'],
        midi: [],
        'picture-in-picture': [],
        'publickey-credentials-get': [],
        'screen-wake-lock': [],
        'web-share': [],
        'xr-spatial-tracking': [],
      },
    },
  },
})
