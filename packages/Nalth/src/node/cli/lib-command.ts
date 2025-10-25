import { resolve } from 'path'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import colors from 'picocolors'

export async function libCommand(options: { watch?: boolean }) {
  console.log(colors.cyan('📦 Building library...\n'))
  
  try {
    const args = ['rolldown', '--config', 'rolldown.config.ts']
    if (options.watch) args.push('-w')
    
    execSync(`npx ${args.join(' ')}`, {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    
    console.log(colors.green('\n✅ Library built successfully'))
  } catch (error: any) {
    console.error(colors.red('\n❌ Library build failed'))
    process.exit(1)
  }
}

export async function initLibCommand() {
  const projectPath = process.cwd()
  console.log(colors.cyan('📦 Initializing library setup...\n'))

  const libConfig = `import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true
  }
})
`
  writeFileSync(resolve(projectPath, 'rolldown.config.ts'), libConfig)
  console.log(colors.green('✅ Created rolldown.config.ts'))
}
