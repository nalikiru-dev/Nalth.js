import { createWriteStream, WriteStream } from 'node:fs'
import { resolve } from 'node:path'
import colors from 'picocolors'
import type { Logger, LogLevel, LogType, LogOptions, LogErrorOptions } from './types'

export interface LoggerOptions {
  prefix?: string
  allowClearScreen?: boolean
  customLogger?: Logger
  logFile?: string
}

export function createLogger(
  level: LogLevel = 'info',
  options: LoggerOptions = {}
): Logger {
  const { prefix = '[nalth]', allowClearScreen = true, customLogger, logFile } = options
  
  if (customLogger) {
    return customLogger
  }

  const thresh = LogLevels[level]
  const canClearScreen = allowClearScreen && process.stdout.isTTY && !process.env.CI
  const clear = canClearScreen ? '\x1b[2J\x1b[0f' : ''
  
  let fileStream: WriteStream | undefined
  if (logFile) {
    fileStream = createWriteStream(resolve(logFile), { flags: 'a' })
  }

  const warnedMessages = new Set<string>()
  const loggedErrors = new WeakSet<Error>()

  const logger: Logger = {
    hasWarned: false,
    
    info(msg: string, opts: LogOptions = {}) {
      if (thresh > LogLevels.info) return
      
      const formatted = formatMessage('info', msg, prefix, opts)
      console.log(opts.clear ? clear + formatted : formatted)
      
      if (fileStream) {
        fileStream.write(stripColors(formatted) + '\n')
      }
    },

    warn(msg: string, opts: LogOptions = {}) {
      if (thresh > LogLevels.warn) return
      
      logger.hasWarned = true
      const formatted = formatMessage('warn', msg, prefix, opts)
      console.warn(opts.clear ? clear + formatted : formatted)
      
      if (fileStream) {
        fileStream.write(stripColors(formatted) + '\n')
      }
    },

    warnOnce(msg: string, opts: LogOptions = {}) {
      if (warnedMessages.has(msg)) return
      logger.warn(msg, opts)
      warnedMessages.add(msg)
    },

    error(msg: string, opts: LogErrorOptions = {}) {
      if (thresh > LogLevels.error) return
      
      logger.hasWarned = true
      const formatted = formatMessage('error', msg, prefix, opts)
      console.error(opts.clear ? clear + formatted : formatted)
      
      if (opts.error && !loggedErrors.has(opts.error)) {
        loggedErrors.add(opts.error)
        console.error(colors.red(opts.error.stack || opts.error.message))
      }
      
      if (fileStream) {
        fileStream.write(stripColors(formatted) + '\n')
        if (opts.error) {
          fileStream.write(stripColors(opts.error.stack || opts.error.message) + '\n')
        }
      }
    },

    clearScreen(type: LogType) {
      if (thresh > LogLevels[type] || !canClearScreen) return
      console.log(clear)
    },

    hasErrorLogged(error: Error) {
      return loggedErrors.has(error)
    }
  }

  return logger
}

const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3
}

function formatMessage(
  type: LogType,
  msg: string,
  prefix: string,
  opts: LogOptions = {}
): string {
  const timestamp = opts.timestamp !== false ? getTimestamp() : ''
  const coloredPrefix = colorizePrefix(prefix, type)
  const coloredMsg = colorizeMessage(msg, type)
  
  return `${timestamp}${coloredPrefix} ${coloredMsg}`
}

function colorizePrefix(prefix: string, type: LogType): string {
  switch (type) {
    case 'info':
      return colors.cyan(prefix)
    case 'warn':
      return colors.yellow(prefix)
    case 'error':
      return colors.red(prefix)
    default:
      return prefix
  }
}

function colorizeMessage(msg: string, type: LogType): string {
  switch (type) {
    case 'info':
      return msg
    case 'warn':
      return colors.yellow(msg)
    case 'error':
      return colors.red(msg)
    default:
      return msg
  }
}

function getTimestamp(): string {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour12: false })
  return colors.dim(`${time} `)
}

function stripColors(str: string): string {
  // Remove ANSI color codes
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

// Security-focused logging utilities
export function logSecurityViolation(
  type: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  message: string,
  details?: any
): void {
  const logger = createLogger('info', { prefix: '[🛡️ SECURITY]' })
  const icon = getSeverityIcon(severity)
  const coloredMessage = colorizeSeverity(message, severity)
  
  logger.warn(`${icon} ${type.toUpperCase()}: ${coloredMessage}`)
  
  if (details) {
    console.log(colors.dim(JSON.stringify(details, null, 2)))
  }
}

export function logSecurityScan(
  scanType: string,
  results: { passed: number; failed: number; total: number }
): void {
  const logger = createLogger('info', { prefix: '[🔍 SCAN]' })
  const { passed, failed, total } = results
  const passRate = ((passed / total) * 100).toFixed(1)
  
  if (failed === 0) {
    logger.info(`${colors.green('✓')} ${scanType}: ${colors.green(`${passed}/${total} passed`)} (${passRate}%)`)
  } else {
    logger.warn(`${colors.yellow('⚠')} ${scanType}: ${colors.red(`${failed} failed`)}, ${colors.green(`${passed} passed`)} (${passRate}%)`)
  }
}

export function logSecurityMetrics(metrics: {
  securityScore: number
  vulnerabilities: number
  violations: number
  lastScan: number
}): void {
  const logger = createLogger('info', { prefix: '[📊 METRICS]' })
  const { securityScore, vulnerabilities, violations, lastScan } = metrics
  
  const scoreColor = securityScore >= 80 ? colors.green : securityScore >= 60 ? colors.yellow : colors.red
  const lastScanTime = new Date(lastScan).toLocaleString()
  
  logger.info(`Security Score: ${scoreColor(securityScore.toString())}/100`)
  logger.info(`Vulnerabilities: ${vulnerabilities > 0 ? colors.red(vulnerabilities.toString()) : colors.green('0')}`)
  logger.info(`Violations: ${violations > 0 ? colors.yellow(violations.toString()) : colors.green('0')}`)
  logger.info(`Last Scan: ${colors.dim(lastScanTime)}`)
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical':
      return '🚨'
    case 'high':
      return '⚠️'
    case 'medium':
      return '⚡'
    case 'low':
      return 'ℹ️'
    default:
      return '🔍'
  }
}

function colorizeSeverity(message: string, severity: string): string {
  switch (severity) {
    case 'critical':
      return colors.red(colors.bold(message))
    case 'high':
      return colors.red(message)
    case 'medium':
      return colors.yellow(message)
    case 'low':
      return colors.blue(message)
    default:
      return message
  }
}
