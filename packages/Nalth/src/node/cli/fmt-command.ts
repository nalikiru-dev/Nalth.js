import { resolve } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import colors from 'picocolors'

export interface FmtCommandOptions {
  check?: boolean
  write?: boolean
  cache?: boolean
  parser?: string
  config?: string
  ignoreUnknown?: boolean
}

export async function fmtCommand(
  pattern?: string,
  options: FmtCommandOptions = {}
) {
  const projectPath = process.cwd()
  
  console.log(colors.cyan('✨ Running Nalth Format...\n'))

  // Check for Prettier installation
  const packageJsonPath = resolve(projectPath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    console.error(colors.red('❌ No package.json found'))
    process.exit(1)
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const hasPrettier = 
    packageJson.dependencies?.prettier || 
    packageJson.devDependencies?.prettier

  if (!hasPrettier) {
    console.log(colors.yellow('⚠️  Prettier not found. Installing...'))
    await installPrettier(projectPath)
  }

  // Build Prettier command
  const args: string[] = ['prettier']

  // Pattern (default to current directory)
  const formatPattern = pattern || '.'
  args.push(formatPattern)

  // Check mode (don't write)
  if (options.check) {
    args.push('--check')
  } else if (options.write !== false) {
    // Write by default unless check mode
    args.push('--write')
  }

  // Cache
  if (options.cache !== false) {
    args.push('--cache')
  }

  // Parser
  if (options.parser) {
    args.push('--parser', options.parser)
  }

  // Config
  if (options.config) {
    args.push('--config', options.config)
  }

  // Ignore unknown files
  if (options.ignoreUnknown !== false) {
    args.push('--ignore-unknown')
  }

  try {
    console.log(colors.dim(`$ npx ${args.join(' ')}\n`))
    
    execSync(`npx ${args.join(' ')}`, {
      cwd: projectPath,
      stdio: 'inherit'
    })

    if (options.check) {
      console.log(colors.green('\n✅ All files are formatted correctly'))
    } else {
      console.log(colors.green('\n✅ Formatting completed successfully'))
    }
    
  } catch (error: any) {
    if (error.status !== 0) {
      if (options.check) {
        console.error(colors.red('\n❌ Some files need formatting'))
        console.log(colors.dim('Run "nalth fmt" to format them'))
      } else {
        console.error(colors.red('\n❌ Formatting failed'))
      }
      process.exit(error.status || 1)
    }
  }
}

async function installPrettier(projectPath: string) {
  try {
    console.log(colors.dim('Installing Prettier...'))
    
    const packages = [
      'prettier',
      'prettier-plugin-organize-imports'
    ]

    execSync(`npm install -D ${packages.join(' ')}`, {
      cwd: projectPath,
      stdio: 'inherit'
    })

    console.log(colors.green('✅ Prettier installed\n'))
  } catch (error) {
    console.error(colors.red('❌ Failed to install Prettier'))
    throw error
  }
}

export async function initFmtCommand(options: { strict?: boolean }) {
  const projectPath = process.cwd()

  console.log(colors.cyan('✨ Initializing Prettier configuration...\n'))

  // Install Prettier
  await installPrettier(projectPath)

  // Create .prettierrc.json
  const prettierConfig = {
    semi: true,
    trailingComma: 'es5' as const,
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    arrowParens: 'always' as const,
    endOfLine: 'lf' as const,
    bracketSpacing: true,
    plugins: ['prettier-plugin-organize-imports'],
    ...(options.strict ? {
      printWidth: 100,
      trailingComma: 'all' as const,
    } : {})
  }

  writeFileSync(
    resolve(projectPath, '.prettierrc.json'),
    JSON.stringify(prettierConfig, null, 2)
  )
  console.log(colors.green('✅ Created .prettierrc.json'))

  // Create .prettierignore
  const prettierIgnore = `# Dependencies
node_modules/
pnpm-lock.yaml
package-lock.json
yarn.lock

# Build output
dist/
build/
out/
coverage/

# Environment files
.env
.env.*

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Cache
.cache/
.next/
.nuxt/
.vuepress/
.cache

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Generated files
*.min.js
*.bundle.js
*.map
`

  writeFileSync(resolve(projectPath, '.prettierignore'), prettierIgnore)
  console.log(colors.green('✅ Created .prettierignore'))

  // Update package.json scripts
  const packageJsonPath = resolve(projectPath, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  
  if (!packageJson.scripts) packageJson.scripts = {}
  packageJson.scripts['format'] = 'nalth fmt'
  packageJson.scripts['format:check'] = 'nalth fmt --check'

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log(colors.green('✅ Updated package.json scripts'))

  console.log(colors.cyan('\n✨ Format setup complete!\n'))
  console.log('Run formatting with:')
  console.log(colors.white('  nalth fmt          ') + colors.dim('# Format all files'))
  console.log(colors.white('  nalth fmt --check  ') + colors.dim('# Check formatting'))
  console.log(colors.white('  nalth fmt src/     ') + colors.dim('# Format specific directory'))
}
