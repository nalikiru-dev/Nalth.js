import type { Plugin } from '../plugin'
import path from 'node:path'
import { createHash } from 'node:crypto'

export interface VuePluginOptions {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
  isProduction?: boolean
}

// Simple SFC parser - no external dependencies
function parseSFC(source: string) {
  const scriptMatch = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  const templateMatch = source.match(/<template[^>]*>([\s\S]*?)<\/template>/)
  const styleMatches = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
  
  return {
    script: scriptMatch ? scriptMatch[1].trim() : null,
    template: templateMatch ? templateMatch[1].trim() : null,
    styles: styleMatches.map(match => match[1].trim())
  }
}

// Simple filter function
function createFilter(include: string | RegExp | (string | RegExp)[], exclude?: string | RegExp | (string | RegExp)[]) {
  const includeRegex = Array.isArray(include) ? include[0] : include
  const excludeRegex = Array.isArray(exclude) ? exclude[0] : exclude
  
  return (id: string) => {
    if (excludeRegex) {
      const excludeTest = typeof excludeRegex === 'string' ? new RegExp(excludeRegex) : excludeRegex
      if (excludeTest.test(id)) return false
    }
    const includeTest = typeof includeRegex === 'string' ? new RegExp(includeRegex) : includeRegex
    return includeTest.test(id)
  }
}

export function vue(options: VuePluginOptions = {}): Plugin {
  const filter = createFilter(
    options.include || /\.vue$/,
    options.exclude
  )

  return {
    name: 'nalth:vue',
    
    async transform(code, id) {
      if (!filter(id)) return null

      const filename = path.basename(id)
      const componentId = createHash('sha256').update(id).digest('hex').slice(0, 8)
      
      // Parse Vue SFC
      const { script, template, styles } = parseSFC(code)
      
      let output = ''
      
      // Process script
      if (script) {
        // Simple script processing - just pass through for now
        output += script
      } else {
        // Default export if no script
        output += 'export default {}'
      }
      
      // Process template
      if (template) {
        // Simple template to render function conversion
        const templateCode = `
function render() {
  return \`${template.replace(/\{\{([^}]+)\}\}/g, '${$1}')}\`
}
`
        output += templateCode
        output += '\nexport default { ...component, render }'
      }
      
      // Process styles
      if (styles.length > 0) {
        styles.forEach((style, index) => {
          const styleId = `${componentId}-${index}`
          output += `
// Style injection
const style_${styleId} = document.createElement('style')
style_${styleId}.textContent = ${JSON.stringify(style)}
document.head.appendChild(style_${styleId})
`
          
          // HMR for styles
          if (!options.isProduction) {
            output += `
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    if (style_${styleId}.parentNode) {
      style_${styleId}.parentNode.removeChild(style_${styleId})
    }
  })
}
`
          }
        })
      }
      
      // Add component metadata
      output += `
// Component metadata
if (typeof component !== 'undefined') {
  component.__file = ${JSON.stringify(filename)}
  component.__hmrId = ${JSON.stringify(componentId)}
}
`
      
      return {
        code: output,
        map: null
      }
    }
  }
}

// Export for use in templates
export default vue
