import { resolve } from 'path'
import { writeFileSync, mkdirSync } from 'fs'

export async function createProject(options: { name: string; template?: string; securityLevel?: string }) {
  const { name: projectName, template = 'nalth-vanilla' } = options
  const projectPath = resolve(process.cwd(), projectName)
  
  try {
    mkdirSync(projectPath, { recursive: true })
    
    // Create basic package.json
    const packageJson = {
      name: projectName,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'nalth dev',
        build: 'nalth build',
        preview: 'nalth preview'
      },
      devDependencies: {
        nalth: '^1.0.0'
      }
    }
    
    writeFileSync(
      resolve(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )
    
    // Create basic index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NALTH App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`
    
    writeFileSync(resolve(projectPath, 'index.html'), indexHtml)
    
    // Create src directory and main.ts
    mkdirSync(resolve(projectPath, 'src'), { recursive: true })
    writeFileSync(
      resolve(projectPath, 'src/main.ts'),
      `console.log('Hello from NALTH!')`
    )
    
    // Create nalth.config.ts
    const nalthConfig = `import { defineConfig } from 'nalth'

export default defineConfig({
  security: {
    https: true,
    csp: 'auto',
    sri: true,
    audit: 'strict'
  }
})`
    
    writeFileSync(resolve(projectPath, 'nalth.config.ts'), nalthConfig)
    
    console.log(`✅ Created NALTH project: ${projectName}`)
    console.log(`📁 Project location: ${projectPath}`)
    console.log(`🚀 Run 'cd ${projectName} && npm install && npm run dev' to get started`)
    
  } catch (error) {
    console.error(`❌ Failed to create project: ${error}`)
    throw error
  }
}
