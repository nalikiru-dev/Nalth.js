#!/usr/bin/env node
/**
 * Add enhanced README files to all templates
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const templates = {
  'nalth-vanilla': {
    name: 'Vanilla TypeScript',
    framework: 'TypeScript',
    description: 'Pure TypeScript with enterprise security',
  },
  'nalth-vue': {
    name: 'Vue.js',
    framework: 'Vue 3',
    description: 'Vue.js with Composition API and security middleware',
  },
  'nalth-react': {
    name: 'React',
    framework: 'React 19',
    description: 'React with shadcn/ui components and enterprise security',
  },
  'nalth-preact': {
    name: 'Preact',
    framework: 'Preact',
    description: 'Lightweight Preact with enterprise features',
  },
  'nalth-lit': {
    name: 'Lit',
    framework: 'Lit',
    description: 'Lit web components with security features',
  },
  'nalth-svelte': {
    name: 'Svelte',
    framework: 'SvelteKit',
    description: 'Svelte with built-in security protection',
  },
  'nalth-solid': {
    name: 'SolidJS',
    framework: 'SolidJS',
    description: 'SolidJS with fine-grained reactivity and security',
  },
  'nalth-qwik': {
    name: 'Qwik',
    framework: 'Qwik',
    description: 'Qwik with zero-config security',
  },
}

console.log('📚 Adding enhanced README files to templates...\n')

const readmeTemplate = fs.readFileSync(
  path.join(__dirname, '.template-configs', 'README.md'),
  'utf-8'
)

for (const [templateKey, templateInfo] of Object.entries(templates)) {
  const templateDir = path.join(__dirname, templateKey)
  
  if (!fs.existsSync(templateDir)) {
    console.log(`⚠️  Skipping ${templateKey} - directory not found`)
    continue
  }

  try {
    // Customize README for this template
    let readme = readmeTemplate
      .replace(/{PROJECT_NAME}/g, `${templateInfo.name} + Nalth`)
      .replace('{FRAMEWORK}', templateInfo.framework)
    
    // Add framework-specific content after the title
    const frameworkSection = `\n**Framework:** ${templateInfo.framework}\n**Description:** ${templateInfo.description}\n`
    readme = readme.replace(
      'Created with [Nalth]',
      `${frameworkSection}\nCreated with [Nalth]`
    )

    // Write README
    const readmePath = path.join(templateDir, 'README.md')
    fs.writeFileSync(readmePath, readme)
    
    console.log(`✅ Added README to ${templateKey}`)
  } catch (error) {
    console.error(`❌ Error adding README to ${templateKey}:`, error.message)
  }
}

console.log('\n✨ All README files added successfully!')
console.log('\n📝 Each template now includes:')
console.log('  • Comprehensive project documentation')
console.log('  • All available commands explained')
console.log('  • Security features highlighted')
console.log('  • Testing, linting, formatting guides')
console.log('  • Deployment best practices')
