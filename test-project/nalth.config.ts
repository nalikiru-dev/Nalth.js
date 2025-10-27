import { defineConfig } from 'nalth'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://www.nalthjs.com/config/
export default defineConfig({
  // React JSX configuration using esbuild
  esbuild: {
    jsx: 'automatic',
    jsxDev: true,
  },
  
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  
  // NALTH Security Features
  security: {
    https: false,            // Disable HTTPS for easier development (enable in production)
    csp: {
      enabled: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'ws:', 'wss:']
      }
    },
    headers: {
      hsts: false,           // Disable HSTS in development
      frameOptions: 'SAMEORIGIN',
      contentTypeOptions: true,
      referrerPolicy: 'strict-origin-when-cross-origin'
    }
  },
  
  // CSS processing with PostCSS
  css: {
    postcss: './postcss.config.js'
  },
  
  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
