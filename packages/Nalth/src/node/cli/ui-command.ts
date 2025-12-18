import { execSync } from 'child_process'
import colors from 'picocolors'

import { resolve } from 'path'
import { existsSync } from 'fs'

export async function uiCommand() {
  console.log(colors.cyan('🎨 Opening Nalth UI...\n'))

  const projectPath = process.cwd()
  const vitestBin = getVitestBinary(projectPath)

  try {
    // console.log(colors.dim(`$ ${vitestBin} --ui\n`))
    execSync(`${vitestBin} --ui`, {
      cwd: projectPath,
      stdio: 'inherit'
    })
  } catch (error: any) {
    if (error.status !== 0) {
      // User likely exited the UI process
      process.exit(0)
    }
    console.error(colors.red('❌ Failed to open UI'))
    process.exit(1)
  }
}

function getVitestBinary(projectPath: string): string {
  const possiblePaths = [
    resolve(projectPath, 'node_modules/.bin/vitest'),
    resolve(projectPath, '../node_modules/.bin/vitest'),
    resolve(projectPath, '../../node_modules/.bin/vitest')
  ]

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path
    }
  }

  return 'npx vitest'
}
