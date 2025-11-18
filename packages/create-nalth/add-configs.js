#!/usr/bin/env node
/**
 * Add unified toolchain configuration files to all templates
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const templates = [
  'nalth-vanilla',
  'nalth-vue',
  'nalth-react',
  'nalth-preact',
  'nalth-lit',
  'nalth-svelte',
  'nalth-solid',
  'nalth-qwik',
]

const configFiles = {
  '.prettierrc': '.template-configs/.prettierrc',
  'eslint.config.js': '.template-configs/eslint.config.js',
  'vitest.config.ts': '.template-configs/vitest.config.ts',
}

console.log('📝 Adding configuration files to templates...\n')

for (const template of templates) {
  const templateDir = path.join(__dirname, template)
  
  if (!fs.existsSync(templateDir)) {
    console.log(`⚠️  Skipping ${template} - directory not found`)
    continue
  }

  console.log(`\n📦 Processing ${template}...`)

  for (const [target, source] of Object.entries(configFiles)) {
    const sourcePath = path.join(__dirname, source)
    const targetPath = path.join(templateDir, target)
    
    try {
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath)
        console.log(`  ✅ Added ${target}`)
      } else {
        console.log(`  ⚠️  Source file not found: ${source}`)
      }
    } catch (error) {
      console.error(`  ❌ Error adding ${target}:`, error.message)
    }
  }

  // Create src/test directory if it doesn't exist
  const testDir = path.join(templateDir, 'src', 'test')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
    console.log(`  ✅ Created src/test directory`)
  }

  // Add example test file
  const exampleTestSource = path.join(__dirname, '.template-configs', 'example.test.ts')
  const exampleTestTarget = path.join(templateDir, 'src', 'test', 'example.test.ts')
  
  try {
    if (fs.existsSync(exampleTestSource)) {
      fs.copyFileSync(exampleTestSource, exampleTestTarget)
      console.log(`  ✅ Added example test file`)
    }
  } catch (error) {
    console.error(`  ❌ Error adding test file:`, error.message)
  }

  // Create test setup file
  const setupContent = `// Test setup file
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test case
afterEach(() => {
  cleanup()
})
`
  
  const setupPath = path.join(testDir, 'setup.ts')
  try {
    fs.writeFileSync(setupPath, setupContent)
    console.log(`  ✅ Added test setup file`)
  } catch (error) {
    console.error(`  ❌ Error adding setup file:`, error.message)
  }
}

console.log('\n\n✨ Configuration files added successfully!')
console.log('\n📝 Added files:')
console.log('  • .prettierrc - Prettier configuration')
console.log('  • eslint.config.js - ESLint with TypeScript')
console.log('  • vitest.config.ts - Vitest test configuration')
console.log('  • src/test/example.test.ts - Example test')
console.log('  • src/test/setup.ts - Test setup')
