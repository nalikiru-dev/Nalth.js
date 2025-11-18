#!/usr/bin/env node

/**
 * Post-install script for Nalth
 * Ensures dist folder exists when installed from workspace
 */

import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageRoot = resolve(__dirname, '..')
const distPath = resolve(packageRoot, 'dist')

// Check if dist folder exists
if (!existsSync(distPath)) {
  console.log('⚠️  Nalth dist folder not found. This is expected when installing from workspace.')
  console.log('💡 Run "npm run build" in the Nalth package directory to build it.')
  
  // Check if we're in a workspace
  const workspaceRoot = resolve(packageRoot, '../..')
  const isWorkspace = existsSync(resolve(workspaceRoot, 'pnpm-workspace.yaml')) ||
                      existsSync(resolve(workspaceRoot, 'package.json'))
  
  if (isWorkspace) {
    console.log('📦 Detected workspace installation.')
    console.log('   The dist folder will be available after building the workspace.')
  }
} else {
  console.log('✅ Nalth is ready to use!')
}
