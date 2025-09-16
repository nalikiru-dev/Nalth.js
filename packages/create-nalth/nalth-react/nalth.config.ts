import { defineConfig } from 'nalth'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://nalth.pages.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  
  // NALTH Security Features
  security: {
    https: true,              // HTTPS by default
    csp: {
      enabled: true,
      nonce: true,           // Use nonces for inline scripts
      strictDynamic: true,   // Enable strict-dynamic
      reportUri: '/api/csp-report'
    },
    sri: true,               // Subresource Integrity
    audit: 'strict',         // Security auditing
    headers: {
      hsts: true,            // HTTP Strict Transport Security
      frameOptions: 'DENY',  // X-Frame-Options
      contentTypeOptions: true, // X-Content-Type-Options
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()'
      ]
    },
    dependencies: {
      auditOnInstall: true,
      blockVulnerable: true,
      allowedLicenses: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC']
    }
  },
  
  // CSS processing
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  }
})
