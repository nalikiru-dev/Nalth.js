#!/usr/bin/env node

// Temporary CLI wrapper for development
console.log('🛡️ Nalth CLI (Development Mode)')
console.log('Building dist folder first...')

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageDir = dirname(__dirname)

// Try to build first
const buildProcess = spawn('npm', ['run', 'build-bundle'], {
  cwd: packageDir,
  stdio: 'inherit'
})

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build completed, starting Nalth...')
    // Now try to run the actual CLI
    import(join(packageDir, 'dist/node/cli.js')).catch(err => {
      console.error('❌ Failed to start Nalth CLI:', err.message)
      process.exit(1)
    })
  } else {
    console.error('❌ Build failed with code:', code)
    process.exit(1)
  }
})
