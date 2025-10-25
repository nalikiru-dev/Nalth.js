#!/usr/bin/env node
/**
 * Update all Nalth templates to v2.2.0 with unified toolchain scripts
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

// Standard scripts for all templates
const standardScripts = {
  dev: 'nalth',
  build: 'nalth build',
  preview: 'nalth preview',
  test: 'nalth test',
  'test:ui': 'nalth test --ui',
  'test:coverage': 'nalth test --coverage',
  lint: 'nalth lint',
  'lint:fix': 'nalth lint --fix',
  format: 'nalth fmt',
  'format:check': 'nalth fmt --check',
  audit: 'nalth audit',
  typecheck: 'tsc --noEmit',
}

// Framework-specific script overrides
const frameworkOverrides = {
  'nalth-react': {
    build: 'tsc -b && nalth build',
  },
  'nalth-vue': {
    build: 'tsc && nalth build',
  },
  'nalth-vanilla': {
    build: 'tsc && nalth build',
  },
  'nalth-svelte': {
    build: 'nalth build',
    check: 'svelte-check --tsconfig ./tsconfig.json',
  },
  'nalth-solid': {
    build: 'tsc && nalth build',
  },
  'nalth-preact': {
    build: 'tsc && nalth build',
  },
  'nalth-lit': {
    build: 'tsc && nalth build',
  },
  'nalth-qwik': {
    build: 'nalth build',
  },
}

console.log('🔄 Updating Nalth templates to v2.2.0...\n')

for (const template of templates) {
  const pkgPath = path.join(__dirname, template, 'package.json')
  
  if (!fs.existsSync(pkgPath)) {
    console.log(`⚠️  Skipping ${template} - package.json not found`)
    continue
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    
    // Update nalth version
    if (pkg.devDependencies && pkg.devDependencies.nalth) {
      pkg.devDependencies.nalth = '^2.2.0'
    }
    
    // Merge scripts
    const templateOverrides = frameworkOverrides[template] || {}
    pkg.scripts = {
      ...standardScripts,
      ...templateOverrides,
      ...(pkg.scripts || {}), // Keep any custom scripts
    }
    
    // Sort scripts for readability
    const sortedScripts = {}
    const scriptOrder = [
      'dev',
      'build',
      'preview',
      'test',
      'test:ui',
      'test:coverage',
      'lint',
      'lint:fix',
      'format',
      'format:check',
      'audit',
      'typecheck',
      'check',
    ]
    
    for (const key of scriptOrder) {
      if (pkg.scripts[key]) {
        sortedScripts[key] = pkg.scripts[key]
      }
    }
    
    // Add any remaining scripts
    for (const key of Object.keys(pkg.scripts)) {
      if (!sortedScripts[key]) {
        sortedScripts[key] = pkg.scripts[key]
      }
    }
    
    pkg.scripts = sortedScripts
    
    // Write updated package.json
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    
    console.log(`✅ Updated ${template}`)
  } catch (error) {
    console.error(`❌ Error updating ${template}:`, error.message)
  }
}

console.log('\n✨ All templates updated successfully!')
console.log('\n📝 Updated features:')
console.log('  • Nalth version: ^2.2.0')
console.log('  • Added test, lint, format scripts')
console.log('  • Added security audit script')
console.log('  • Consistent script structure across all templates')
