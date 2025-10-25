import { execSync } from 'child_process'
import colors from 'picocolors'

export async function uiCommand() {
  console.log(colors.cyan('🎨 Opening Nalth UI...\n'))
  
  try {
    execSync('npx vitest --ui', {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
  } catch (error: any) {
    console.error(colors.red('❌ Failed to open UI'))
    process.exit(1)
  }
}
