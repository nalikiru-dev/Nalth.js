/**
 * Nalth Secret Scanner Plugin
 * 
 * Build-time plugin that scans client bundles for accidentally leaked
 * secrets like API keys, tokens, and environment variables.
 */

import type { Plugin } from 'vite'
import colors from 'picocolors'

export interface SecretScannerOptions {
    /** Fail build on secret detection (default: true in production) */
    failOnDetection?: boolean
    /** Custom patterns to detect */
    customPatterns?: RegExp[]
    /** Environment variable prefixes that are safe to expose (default: ['VITE_', 'NEXT_PUBLIC_', 'REACT_APP_']) */
    safeEnvPrefixes?: string[]
    /** Skip specific files */
    skipFiles?: string[]
}

interface DetectedSecret {
    type: string
    file: string
    line?: number
    snippet: string
}

// Common secret patterns
const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
    // API Keys
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g },
    { name: 'AWS Secret Key', pattern: /[A-Za-z0-9/+=]{40}/g },
    { name: 'Google API Key', pattern: /AIza[0-9A-Za-z_-]{35}/g },
    { name: 'GitHub Token', pattern: /gh[pousr]_[A-Za-z0-9_]{36}/g },
    { name: 'Slack Token', pattern: /xox[baprs]-[0-9A-Za-z-]{10,}/g },
    { name: 'Stripe Key', pattern: /sk_live_[0-9a-zA-Z]{24}/g },
    { name: 'Stripe Test Key', pattern: /sk_test_[0-9a-zA-Z]{24}/g },

    // Private Keys
    { name: 'RSA Private Key', pattern: /-----BEGIN RSA PRIVATE KEY-----/g },
    { name: 'SSH Private Key', pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g },
    { name: 'PGP Private Key', pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/g },

    // Database URLs
    { name: 'Database URL', pattern: /(mongodb|postgres|mysql|redis):\/\/[^\s"']+:[^\s"']+@/gi },

    // Generic patterns
    { name: 'JWT Token', pattern: /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g },
    { name: 'Basic Auth', pattern: /Basic [A-Za-z0-9+/=]{20,}/g },
    { name: 'Bearer Token', pattern: /Bearer [A-Za-z0-9_-]{20,}/g },

    // Environment variable patterns (non-public)
    { name: 'Env Variable (SECRET)', pattern: /process\.env\.(SECRET|PRIVATE|PASSWORD|TOKEN|KEY|API_KEY|AUTH)[_A-Z]*/g },
    { name: 'Env Variable (DB)', pattern: /process\.env\.(DATABASE|DB|MONGO|POSTGRES|MYSQL)[_A-Z]*(URL|URI|PASSWORD|PWD)/g },
]

/**
 * Nalth Secret Scanner Plugin
 * 
 * @example
 * ```ts
 * import { nalthSecretScanner } from 'nalth/plugins/secrets'
 * 
 * export default defineConfig({
 *   plugins: [nalthSecretScanner({ failOnDetection: true })]
 * })
 * ```
 */
export function nalthSecretScanner(options: SecretScannerOptions = {}): Plugin {
    const {
        failOnDetection,
        customPatterns = [],
        safeEnvPrefixes = ['VITE_', 'NEXT_PUBLIC_', 'REACT_APP_'],
        skipFiles = ['node_modules', '.map']
    } = options

    const allPatterns = [
        ...SECRET_PATTERNS,
        ...customPatterns.map((p, i) => ({ name: `Custom Pattern ${i + 1}`, pattern: p }))
    ]

    let isProduction = false

    return {
        name: 'nalth:secret-scanner',

        configResolved(config) {
            isProduction = config.command === 'build' && config.mode === 'production'
        },

        generateBundle(_options, bundle) {
            const detectedSecrets: DetectedSecret[] = []
            const shouldFail = failOnDetection ?? isProduction

            for (const [fileName, chunk] of Object.entries(bundle)) {
                // Skip excluded files
                if (skipFiles.some(skip => fileName.includes(skip))) continue

                const code = 'code' in chunk ? chunk.code :
                    'source' in chunk ? String(chunk.source) : ''

                if (!code) continue

                // Check each pattern
                for (const { name, pattern } of allPatterns) {
                    // Reset regex state
                    pattern.lastIndex = 0

                    let match
                    while ((match = pattern.exec(code)) !== null) {
                        const snippet = match[0]

                        // Skip safe env prefixes
                        if (name.includes('Env Variable')) {
                            const isSafe = safeEnvPrefixes.some(prefix =>
                                snippet.includes(`process.env.${prefix}`)
                            )
                            if (isSafe) continue
                        }

                        // Calculate approximate line number
                        const beforeMatch = code.substring(0, match.index)
                        const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1

                        detectedSecrets.push({
                            type: name,
                            file: fileName,
                            line: lineNumber,
                            snippet: snippet.length > 50 ? snippet.substring(0, 47) + '...' : snippet
                        })
                    }
                }
            }

            if (detectedSecrets.length > 0) {
                console.log('')
                console.log(colors.red(colors.bold('🚨 SECURITY ALERT: Potential secrets detected in build output!')))
                console.log(colors.yellow('─'.repeat(60)))

                for (const secret of detectedSecrets) {
                    console.log(colors.red(`  ⚠ ${secret.type}`))
                    console.log(colors.gray(`    File: ${secret.file}:${secret.line}`))
                    console.log(colors.gray(`    Match: ${secret.snippet}`))
                    console.log('')
                }

                console.log(colors.yellow('─'.repeat(60)))
                console.log(colors.cyan('💡 Recommendations:'))
                console.log(colors.white('   • Move secrets to server-side code'))
                console.log(colors.white('   • Use environment variables with safe prefixes (VITE_*)'))
                console.log(colors.white('   • Never commit secrets to version control'))
                console.log('')

                if (shouldFail) {
                    this.error('Build aborted: Secrets detected in client bundle. See above for details.')
                }
            }
        }
    }
}

export default nalthSecretScanner
