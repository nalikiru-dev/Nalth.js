import colors from 'picocolors'
import type { Logger } from './logger'

export interface CLISpinner {
  start(text: string): void
  succeed(text?: string): void
  fail(text?: string): void
  warn(text?: string): void
  info(text?: string): void
  stop(): void
}

/**
 * Create a simple CLI spinner
 */
export function createSpinner(logger?: Logger): CLISpinner {
  let currentText = ''
  let interval: NodeJS.Timeout | null = null
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let frameIndex = 0

  return {
    start(text: string) {
      currentText = text
      frameIndex = 0
      
      if (interval) clearInterval(interval)
      
      interval = setInterval(() => {
        const frame = frames[frameIndex]
        process.stdout.write(`\r${colors.cyan(frame)} ${currentText}`)
        frameIndex = (frameIndex + 1) % frames.length
      }, 80)
    },

    succeed(text?: string) {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      process.stdout.write(`\r${colors.green('✓')} ${text || currentText}\n`)
    },

    fail(text?: string) {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      process.stdout.write(`\r${colors.red('✗')} ${text || currentText}\n`)
    },

    warn(text?: string) {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      process.stdout.write(`\r${colors.yellow('⚠')} ${text || currentText}\n`)
    },

    info(text?: string) {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      process.stdout.write(`\r${colors.blue('ℹ')} ${text || currentText}\n`)
    },

    stop() {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      process.stdout.write('\r\x1b[K') // Clear line
    },
  }
}

/**
 * Display a beautiful banner
 */
export function displayBanner(version: string): void {
  console.log()
  console.log(colors.cyan('  ███╗   ██╗ █████╗ ██╗  ████████╗██╗  ██╗'))
  console.log(colors.cyan('  ████╗  ██║██╔══██╗██║  ╚══██╔══╝██║  ██║'))
  console.log(colors.cyan('  ██╔██╗ ██║███████║██║     ██║   ███████║'))
  console.log(colors.cyan('  ██║╚██╗██║██╔══██║██║     ██║   ██╔══██║'))
  console.log(colors.cyan('  ██║ ╚████║██║  ██║███████╗██║   ██║  ██║'))
  console.log(colors.cyan('  ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝'))
  console.log()
  console.log(colors.bold(`  Security-First Web Framework ${colors.dim(`v${version}`)}`))
  console.log(colors.dim('  https://nalthjs.com'))
  console.log()
}

/**
 * Display helpful tips
 */
export function displayTips(): void {
  const tips = [
    '💡 Use --force to clear cache and rebuild',
    '💡 Press h in dev mode to see keyboard shortcuts',
    '💡 Run "nalth security:report" to check vulnerabilities',
    '💡 Use "nalth ui" to open the advanced devtools',
    '💡 Add import.meta.hot.accept() for better HMR',
    '💡 Use dynamic imports for code splitting',
    '💡 Enable source maps for better debugging',
    '💡 Check out examples at https://nalthjs.com/examples',
  ]

  const randomTip = tips[Math.floor(Math.random() * tips.length)]
  console.log(colors.dim(`\n  ${randomTip}\n`))
}

/**
 * Display progress bar
 */
export function createProgressBar(total: number): {
  update: (current: number, text?: string) => void
  complete: (text?: string) => void
} {
  const barLength = 30
  let lastOutput = ''

  return {
    update(current: number, text = '') {
      const percentage = Math.min(100, Math.max(0, (current / total) * 100))
      const filled = Math.floor((percentage / 100) * barLength)
      const empty = barLength - filled
      
      const bar = colors.cyan('█'.repeat(filled)) + colors.dim('░'.repeat(empty))
      const output = `\r  ${bar} ${percentage.toFixed(0)}% ${text}`
      
      if (output !== lastOutput) {
        process.stdout.write(output)
        lastOutput = output
      }
    },

    complete(text = 'Complete!') {
      const bar = colors.green('█'.repeat(barLength))
      process.stdout.write(`\r  ${bar} 100% ${text}\n`)
    },
  }
}

/**
 * Prompt user for input
 */
export async function prompt(question: string, defaultValue?: string): Promise<string> {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const defaultText = defaultValue ? colors.dim(` (${defaultValue})`) : ''
    readline.question(`${colors.cyan('?')} ${question}${defaultText}: `, (answer: string) => {
      readline.close()
      resolve(answer.trim() || defaultValue || '')
    })
  })
}

/**
 * Confirm action
 */
export async function confirm(question: string, defaultValue = false): Promise<boolean> {
  const defaultText = defaultValue ? '[Y/n]' : '[y/N]'
  const answer = await prompt(`${question} ${colors.dim(defaultText)}`)
  
  if (!answer) return defaultValue
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

/**
 * Select from options
 */
export async function select(
  question: string,
  options: string[],
  defaultIndex = 0,
): Promise<string> {
  console.log(colors.cyan('?') + ' ' + question)
  
  options.forEach((option, index) => {
    const prefix = index === defaultIndex ? colors.cyan('❯') : ' '
    console.log(`  ${prefix} ${option}`)
  })

  const answer = await prompt('Select option', String(defaultIndex + 1))
  const index = parseInt(answer) - 1
  
  if (index >= 0 && index < options.length) {
    return options[index]
  }
  
  return options[defaultIndex]
}

/**
 * Display a table
 */
export function displayTable(
  headers: string[],
  rows: string[][],
  options: { align?: ('left' | 'right' | 'center')[] } = {},
): void {
  const columnWidths = headers.map((header, i) => {
    const maxRowWidth = Math.max(...rows.map(row => (row[i] || '').length))
    return Math.max(header.length, maxRowWidth)
  })

  // Header
  const headerRow = headers
    .map((header, i) => header.padEnd(columnWidths[i]))
    .join('  ')
  console.log(colors.bold(headerRow))
  
  // Separator
  const separator = columnWidths.map(width => '─'.repeat(width)).join('  ')
  console.log(colors.dim(separator))

  // Rows
  rows.forEach(row => {
    const formattedRow = row
      .map((cell, i) => {
        const width = columnWidths[i]
        const align = options.align?.[i] || 'left'
        
        if (align === 'right') {
          return cell.padStart(width)
        } else if (align === 'center') {
          const padding = width - cell.length
          const leftPad = Math.floor(padding / 2)
          const rightPad = padding - leftPad
          return ' '.repeat(leftPad) + cell + ' '.repeat(rightPad)
        }
        
        return cell.padEnd(width)
      })
      .join('  ')
    console.log(formattedRow)
  })
  
  console.log()
}

/**
 * Display a box with text
 */
export function displayBox(
  title: string,
  content: string[],
  options: { color?: 'cyan' | 'green' | 'yellow' | 'red' } = {},
): void {
  const color = options.color || 'cyan'
  const colorFn = colors[color]
  
  const maxLength = Math.max(
    title.length,
    ...content.map(line => line.length),
  )
  
  const width = maxLength + 4
  const top = '┌' + '─'.repeat(width - 2) + '┐'
  const bottom = '└' + '─'.repeat(width - 2) + '┘'
  
  console.log(colorFn(top))
  console.log(colorFn('│ ') + colors.bold(title.padEnd(width - 4)) + colorFn(' │'))
  console.log(colorFn('├' + '─'.repeat(width - 2) + '┤'))
  
  content.forEach(line => {
    console.log(colorFn('│ ') + line.padEnd(width - 4) + colorFn(' │'))
  })
  
  console.log(colorFn(bottom))
  console.log()
}

/**
 * Format file size
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Format duration
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}m ${seconds}s`
}

/**
 * Clear console
 */
export function clearConsole(): void {
  process.stdout.write('\x1Bc')
}

/**
 * Display success message
 */
export function success(message: string): void {
  console.log(colors.green('✓') + ' ' + message)
}

/**
 * Display error message
 */
export function error(message: string): void {
  console.error(colors.red('✗') + ' ' + message)
}

/**
 * Display warning message
 */
export function warning(message: string): void {
  console.warn(colors.yellow('⚠') + ' ' + message)
}

/**
 * Display info message
 */
export function info(message: string): void {
  console.log(colors.blue('ℹ') + ' ' + message)
}
