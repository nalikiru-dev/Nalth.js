import { resolve, relative } from 'path'
import { existsSync, readFileSync, writeFileSync, statSync } from 'fs'
import { execSync, spawn } from 'child_process'
import colors from 'picocolors'
import crypto from 'crypto'

export interface RunCommandOptions {
  cache?: boolean
  force?: boolean
  parallel?: boolean
  filter?: string[]
  graph?: boolean
  dryRun?: boolean
}

interface TaskCache {
  [taskName: string]: {
    hash: string
    timestamp: number
    outputs?: string[]
  }
}

export async function runCommand(
  taskName: string,
  options: RunCommandOptions = {}
) {
  const projectPath = process.cwd()
  
  console.log(colors.cyan(`🚀 Running task: ${colors.bold(taskName)}\n`))

  // Load package.json
  const packageJsonPath = resolve(projectPath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    console.error(colors.red('❌ No package.json found'))
    process.exit(1)
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  
  if (!packageJson.scripts || !packageJson.scripts[taskName]) {
    console.error(colors.red(`❌ Task "${taskName}" not found in package.json scripts`))
    console.log(colors.dim('\nAvailable scripts:'))
    if (packageJson.scripts) {
      Object.keys(packageJson.scripts).forEach(script => {
        console.log(colors.white(`  - ${script}`))
      })
    }
    process.exit(1)
  }

  const command = packageJson.scripts[taskName]

  // Check cache
  if (options.cache !== false && !options.force) {
    const cached = await checkTaskCache(projectPath, taskName, command)
    if (cached) {
      console.log(colors.green(`✅ Task "${taskName}" cached - skipping`))
      console.log(colors.dim('Use --force to run anyway\n'))
      return
    }
  }

  // Dry run
  if (options.dryRun) {
    console.log(colors.cyan('Dry run - would execute:'))
    console.log(colors.white(`  ${command}\n`))
    return
  }

  // Execute task
  try {
    console.log(colors.dim(`$ ${command}\n`))
    
    const startTime = Date.now()
    
    execSync(command, {
      cwd: projectPath,
      stdio: 'inherit',
      env: {
        ...process.env,
        NALTH_TASK_NAME: taskName,
        FORCE_COLOR: '1'
      }
    })

    const duration = Date.now() - startTime
    
    console.log(colors.green(`\n✅ Task "${taskName}" completed in ${duration}ms`))
    
    // Update cache
    if (options.cache !== false) {
      await updateTaskCache(projectPath, taskName, command)
    }
    
  } catch (error: any) {
    console.error(colors.red(`\n❌ Task "${taskName}" failed`))
    process.exit(error.status || 1)
  }
}

export async function runManyCommand(
  tasks: string[],
  options: RunCommandOptions = {}
) {
  const projectPath = process.cwd()
  
  console.log(colors.cyan(`🚀 Running ${tasks.length} task(s)...\n`))

  if (options.parallel) {
    await runTasksParallel(projectPath, tasks, options)
  } else {
    await runTasksSequential(projectPath, tasks, options)
  }
}

async function runTasksSequential(
  projectPath: string,
  tasks: string[],
  options: RunCommandOptions
) {
  for (const task of tasks) {
    console.log(colors.cyan(`\n▶ Running: ${task}`))
    await runCommand(task, { ...options, parallel: false })
  }
  
  console.log(colors.green(`\n✅ All ${tasks.length} task(s) completed`))
}

async function runTasksParallel(
  projectPath: string,
  tasks: string[],
  options: RunCommandOptions
) {
  const packageJsonPath = resolve(projectPath, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

  console.log(colors.cyan(`Running ${tasks.length} tasks in parallel...\n`))

  const processes = tasks.map(task => {
    const command = packageJson.scripts?.[task]
    
    if (!command) {
      console.error(colors.red(`❌ Task "${task}" not found`))
      return null
    }

    return new Promise<{ task: string; success: boolean; duration: number }>((resolve) => {
      const startTime = Date.now()
      console.log(colors.dim(`Starting: ${task}`))
      
      const child = spawn('npm', ['run', task], {
        cwd: projectPath,
        stdio: 'pipe',
        env: {
          ...process.env,
          NALTH_TASK_NAME: task,
          FORCE_COLOR: '1'
        }
      })

      let output = ''
      
      child.stdout?.on('data', (data) => {
        output += data.toString()
      })
      
      child.stderr?.on('data', (data) => {
        output += data.toString()
      })

      child.on('close', (code) => {
        const duration = Date.now() - startTime
        const success = code === 0
        
        if (success) {
          console.log(colors.green(`✅ ${task} (${duration}ms)`))
        } else {
          console.log(colors.red(`❌ ${task} failed (${duration}ms)`))
          console.log(colors.dim(output))
        }
        
        resolve({ task, success, duration })
      })
    })
  }).filter(Boolean) as Promise<{ task: string; success: boolean; duration: number }>[]

  const results = await Promise.all(processes)
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(colors.cyan('\n📊 Results:'))
  console.log(colors.green(`  ✅ Successful: ${successful}`))
  if (failed > 0) {
    console.log(colors.red(`  ❌ Failed: ${failed}`))
  }
  
  if (failed > 0) {
    process.exit(1)
  }
}

async function checkTaskCache(
  projectPath: string,
  taskName: string,
  command: string
): Promise<boolean> {
  const cacheDir = resolve(projectPath, '.nalth', 'cache')
  const cachePath = resolve(cacheDir, 'tasks.json')
  
  if (!existsSync(cachePath)) {
    return false
  }

  try {
    const cache: TaskCache = JSON.parse(readFileSync(cachePath, 'utf-8'))
    const cached = cache[taskName]
    
    if (!cached) {
      return false
    }

    // Check if inputs changed
    const currentHash = await computeTaskHash(projectPath, command)
    
    if (cached.hash !== currentHash) {
      return false
    }

    // Cache is valid
    return true
  } catch {
    return false
  }
}

async function updateTaskCache(
  projectPath: string,
  taskName: string,
  command: string
) {
  const cacheDir = resolve(projectPath, '.nalth', 'cache')
  const cachePath = resolve(cacheDir, 'tasks.json')
  
  // Create cache directory
  const fs = require('fs')
  if (!existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }

  // Load existing cache
  let cache: TaskCache = {}
  if (existsSync(cachePath)) {
    try {
      cache = JSON.parse(readFileSync(cachePath, 'utf-8'))
    } catch {}
  }

  // Update cache
  const hash = await computeTaskHash(projectPath, command)
  cache[taskName] = {
    hash,
    timestamp: Date.now()
  }

  writeFileSync(cachePath, JSON.stringify(cache, null, 2))
}

async function computeTaskHash(projectPath: string, command: string): Promise<string> {
  const hash = crypto.createHash('sha256')
  
  // Hash the command
  hash.update(command)
  
  // Hash key files
  const keyFiles = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'nalth.config.js',
    'nalth.config.ts'
  ]

  for (const file of keyFiles) {
    const filePath = resolve(projectPath, file)
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8')
      hash.update(content)
      
      const stat = statSync(filePath)
      hash.update(stat.mtime.toISOString())
    }
  }

  return hash.digest('hex')
}

export async function initRunCommand() {
  const projectPath = process.cwd()

  console.log(colors.cyan('🚀 Initializing task runner...\n'))

  // Create .nalth/cache directory
  const cacheDir = resolve(projectPath, '.nalth', 'cache')
  const fs = require('fs')
  if (!existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }

  // Create task configuration
  const taskConfig = {
    cache: {
      enabled: true,
      directory: '.nalth/cache'
    },
    tasks: {
      build: {
        dependsOn: ['lint', 'test'],
        outputs: ['dist/**']
      },
      test: {
        cache: true
      },
      lint: {
        cache: true
      }
    }
  }

  const configPath = resolve(projectPath, '.nalth', 'tasks.json')
  writeFileSync(configPath, JSON.stringify(taskConfig, null, 2))
  console.log(colors.green('✅ Created task configuration'))

  // Update package.json scripts
  const packageJsonPath = resolve(projectPath, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  
  if (!packageJson.scripts) packageJson.scripts = {}
  
  // Add example parallel tasks
  if (!packageJson.scripts['build:all']) {
    packageJson.scripts['build:all'] = 'nalth run build --parallel'
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log(colors.green('✅ Updated package.json'))

  console.log(colors.cyan('\n✨ Task runner setup complete!\n'))
  console.log('Run tasks with:')
  console.log(colors.white('  nalth run build        ') + colors.dim('# Run single task'))
  console.log(colors.white('  nalth run build --cache') + colors.dim('# Use caching'))
  console.log(colors.white('  nalth run build --force') + colors.dim('# Skip cache'))
}
