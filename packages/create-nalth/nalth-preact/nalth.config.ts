import { defineConfig } from 'nalth'
import preact from '@preact/preset-vite'

// https://nalth.pages.dev/config/
export default defineConfig({
  plugins: [preact()],
  
  // NALTH Security Features
  security: {
    https: true,              // HTTPS by default
    csp: 'auto',             // Auto-generated CSP
    sri: true,               // Subresource Integrity
    audit: 'strict',         // Security auditing
    headers: {
      hsts: true,            // HTTP Strict Transport Security
      frameOptions: 'DENY',  // X-Frame-Options
      contentTypeOptions: true // X-Content-Type-Options
    }
  }
})
