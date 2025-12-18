import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'cross-spawn'
import mri from 'mri'
import * as prompts from '@clack/prompts'
import colors from 'picocolors'

const { blue, cyan, green, magenta, red, redBright, yellow } = colors

// Unused color variables removed: blueBright, greenBright, reset

const argv = mri<{
  template?: string
  help?: boolean
  overwrite?: boolean
}>(process.argv.slice(2), {
  alias: { h: 'help', t: 'template' },
  boolean: ['help', 'overwrite'],
  string: ['template'],
})
const cwd = process.cwd()

// prettier-ignore
const helpMessage = `\
  ${colors.cyan('   _   __      ____  __    ')}
${colors.cyan('  / | / /___ _/ / /_/ /_   ')}
${colors.cyan(' /  |/ / __ `/ / __/ __ \\  ')}
${colors.magenta('/ /|  / /_/ / / /_/ / / /  ')}
${colors.magenta('/_/ |_/\\__,_/_/\\__/_/ /_/   ')}
${colors.magenta('      SECURITY FIRST        ')}

${blue('┌─────────────────────────────────────────────────────────────┐')}
${blue('│')}        ${colors.cyan('Security-First Unified Toolchain')} v${process.env.npm_package_version || '2.2.0'}         ${blue('│')}
${blue('└─────────────────────────────────────────────────────────────┘')}

${yellow('USAGE:')}
  ${green('create-nalth')} ${magenta('[OPTIONS]')} ${cyan('[DIRECTORY]')}

${yellow('DESCRIPTION:')}
  Bootstrap secure, enterprise - ready web applications with:
  ${green('✓')} HTTPS & TLS encryption by default
  ${green('✓')} Content Security Policy(CSP) auto - generation
  ${green('✓')} Built -in testing, linting, and formatting
  ${green('✓')} Secure package management with typosquatting detection
  ${green('✓')} Real - time security monitoring & auditing
  ${green('✓')} Zero - config security headers & rate limiting

${yellow('OPTIONS:')}
  ${green('-t, --template')} ${cyan('NAME')}     Use a specific framework template
  ${green('-h, --help')}                Show this help message
  ${green('--overwrite')}               Overwrite existing directory

${yellow('AVAILABLE TEMPLATES:')}
  ${yellow('🟡 nalth-vanilla')}   Pure TypeScript with enterprise security
  ${green('🟢 nalth-vue')} Vue.js with security middleware
  ${cyan('🔵 nalth-react')}     React with CSP & security headers
  ${magenta('🟣 nalth-preact')}    Preact with HTTPS & monitoring
  ${redBright('🔴 nalth-lit')}       Lit components with security features
  ${red('⭐ nalth-svelte')}    Svelte with built -in protection
  ${blue('💙 nalth-solid')}     SolidJS with enterprise security
  ${cyan('⚡ nalth-qwik')}      Qwik with zero - config security

${yellow('EXAMPLES:')}
  ${green('create-nalth')}                    # Interactive mode
  ${green('create-nalth')} ${cyan('my-secure-app')}      # Create with default template
  ${green('create-nalth')} ${cyan('my-app')} ${magenta('--template nalth-react')}  # Use React template

${blue('────────────────────────────────────────────────────────────────')}
${cyan('🌐 Learn more:')} https://www.nalthjs.com
${cyan('📚 Documentation:')} https://www.nalthjs.com/docs
${cyan('🔧 GitHub:')} https://github.com/nalikiru-dev/nalth.js`

type ColorFunc = (str: string | number) => string
type Framework = {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}
type FrameworkVariant = {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
}

const FRAMEWORKS: Framework[] = [
  {
    name: 'nalth-vanilla',
    display: '🟡 Vanilla TypeScript (Enterprise Security)',
    color: yellow,
    variants: [
      {
        name: 'nalth-vanilla',
        display: '🛡️ TypeScript + Security Headers + HTTPS',
        color: blue,
      },
    ],
  },
  {
    name: 'nalth-vue',
    display: '🟢 Vue.js (Security + Reactivity)',
    color: green,
    variants: [
      {
        name: 'nalth-vue',
        display: '🛡️ Vue.js + CSP + Security Middleware',
        color: green,
      },
    ],
  },
  {
    name: 'nalth-react',
    display: '🔵 React (Enterprise Security)',
    color: cyan,
    variants: [
      {
        name: 'nalth-react',
        display: '🛡️ React + Security Headers + Monitoring',
        color: cyan,
      },
    ],
  },
  {
    name: 'nalth-preact',
    display: '🟣 Preact (Lightweight + Secure)',
    color: magenta,
    variants: [
      {
        name: 'nalth-preact',
        display: '🛡️ Preact + HTTPS + Real-time Security',
        color: magenta,
      },
    ],
  },
  {
    name: 'nalth-lit',
    display: '🔴 Lit (Web Components + Security)',
    color: redBright,
    variants: [
      {
        name: 'nalth-lit',
        display: '🛡️ Lit Components + Security Features',
        color: redBright,
      },
    ],
  },
  {
    name: 'nalth-svelte',
    display: '⭐ Svelte (Compiled + Protected)',
    color: red,
    variants: [
      {
        name: 'nalth-svelte',
        display: '🛡️ Svelte + Built-in Security Protection',
        color: red,
      },
    ],
  },
  {
    name: 'nalth-solid',
    display: '💙 SolidJS (Performance + Security)',
    color: blue,
    variants: [
      {
        name: 'nalth-solid',
        display: '🛡️ SolidJS + Enterprise Security Suite',
        color: blue,
      },
    ],
  },
  {
    name: 'nalth-qwik',
    display: '⚡ Qwik (Zero-Config Security)',
    color: cyan,
    variants: [
      {
        name: 'nalth-qwik',
        display: '🛡️ Qwik + Automatic Security Configuration',
        color: cyan,
      },
    ],
  },
]

const TEMPLATES = FRAMEWORKS.map((f) => f.variants.map((v) => v.name)).reduce(
  (a, b) => a.concat(b),
  [],
)

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}

const defaultTargetDir = 'nalth-project'

async function init() {
  const argTargetDir = argv._[0]
    ? formatTargetDir(String(argv._[0]))
    : undefined
  const argTemplate = argv.template
  const argOverwrite = argv.overwrite

  const help = argv.help
  if (help) {
    console.log(helpMessage)
    return
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const cancel = () => prompts.cancel('Operation cancelled')

  // 1. Get project name and target dir
  let targetDir = argTargetDir
  if (!targetDir) {
    const projectName = await prompts.text({
      message: 'Project name:',
      defaultValue: defaultTargetDir,
      placeholder: defaultTargetDir,
      validate: (value) => {
        return value.length === 0 || formatTargetDir(value).length > 0
          ? undefined
          : 'Invalid project name'
      },
    })
    if (prompts.isCancel(projectName)) return cancel()
    targetDir = formatTargetDir(projectName)
  }

  // 2. Handle directory if exist and not empty
  if (fs.existsSync(targetDir) && !isEmpty(targetDir)) {
    const overwrite = argOverwrite
      ? 'yes'
      : await prompts.select({
        message:
          (targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`) +
          ` is not empty. Please choose how to proceed:`,
        options: [
          {
            label: 'Cancel operation',
            value: 'no',
          },
          {
            label: 'Remove existing files and continue',
            value: 'yes',
          },
          {
            label: 'Ignore files and continue',
            value: 'ignore',
          },
        ],
      })
    if (prompts.isCancel(overwrite)) return cancel()
    switch (overwrite) {
      case 'yes':
        emptyDir(targetDir)
        break
      case 'no':
        cancel()
        return
    }
  }

  // 3. Get package name
  let packageName = path.basename(path.resolve(targetDir))
  if (!isValidPackageName(packageName)) {
    const packageNameResult = await prompts.text({
      message: 'Package name:',
      defaultValue: toValidPackageName(packageName),
      placeholder: toValidPackageName(packageName),
      validate(dir) {
        if (!isValidPackageName(dir)) {
          return 'Invalid package.json name'
        }
      },
    })
    if (prompts.isCancel(packageNameResult)) return cancel()
    packageName = packageNameResult
  }

  // 4. Choose a framework and variant
  let template = argTemplate
  let hasInvalidArgTemplate = false
  if (argTemplate && !TEMPLATES.includes(argTemplate)) {
    template = undefined
    hasInvalidArgTemplate = true
  }
  if (!template) {
    const framework = await prompts.select({
      message: hasInvalidArgTemplate
        ? `"${argTemplate}" isn't a valid template. Please choose from below: `
        : 'Select a framework:',
      options: FRAMEWORKS.map((framework) => {
        const frameworkColor = framework.color
        return {
          label: frameworkColor(framework.display || framework.name),
          value: framework,
        }
      }),
    })
    if (prompts.isCancel(framework)) return cancel()

    const variant = await prompts.select({
      message: 'Select a variant:',
      options: framework.variants.map((variant) => {
        const variantColor = variant.color
        const command = variant.customCommand
          ? getFullCustomCommand(variant.customCommand, pkgInfo).replace(
            / TARGET_DIR$/,
            '',
          )
          : undefined
        return {
          label: variantColor(variant.display || variant.name),
          value: variant.name,
          hint: command,
        }
      }),
    })
    if (prompts.isCancel(variant)) return cancel()

    template = variant
  }

  const root = path.join(cwd, targetDir)
  fs.mkdirSync(root, { recursive: true })

  // determine template
  let isReactSwc = false
  if (template.includes('-swc')) {
    isReactSwc = true
    template = template.replace('-swc', '')
  }

  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  const { customCommand } =
    FRAMEWORKS.flatMap((f) => f.variants).find((v) => v.name === template) ?? {}

  if (customCommand) {
    const fullCustomCommand = getFullCustomCommand(customCommand, pkgInfo)

    const [command, ...args] = fullCustomCommand.split(' ')
    // we replace TARGET_DIR here because targetDir may include a space
    const replacedArgs = args.map((arg) =>
      arg.replace('TARGET_DIR', () => targetDir),
    )
    const { status } = spawn.sync(command, replacedArgs, {
      stdio: 'inherit',
    })
    process.exit(status ?? 0)
  }

  prompts.log.step(`🛡️ Scaffolding secure Nalth project in ${green(root)}...`)
  prompts.log.info(`🔍 Setting up enterprise-grade security features...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    template,
  )

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  )

  pkg.name = packageName

  write('package.json', JSON.stringify(pkg, null, 2) + '\n')

  if (isReactSwc) {
    setupReactSwc(root, template.endsWith('-ts'))
  }

  let doneMessage = ''
  const cdProjectName = path.relative(cwd, root)

  // Header
  doneMessage += `${blue('┌─────────────────────────────────────────────┐')}\n`
  doneMessage += `${blue('│')}     🎉 ${green('PROJECT CREATED SUCCESSFULLY!')} 🎉     ${blue('│')}\n`
  doneMessage += `${blue('└─────────────────────────────────────────────┘')}\n\n`

  // Project info
  doneMessage += `📋 ${yellow('Project:')} ${cyan(path.basename(root))}\n`
  doneMessage += `📁 ${yellow('Location:')} ${cyan(root)}\n`
  doneMessage += `🔥 ${yellow('Template:')} ${magenta(template)}\n\n`

  // Security features and tooling
  doneMessage += `${green('✨ UNIFIED TOOLCHAIN READY:')}\n`
  doneMessage += `  ${green('✓')} HTTPS & TLS encryption\n`
  doneMessage += `  ${green('✓')} Content Security Policy (CSP)\n`
  doneMessage += `  ${green('✓')} Security headers & rate limiting\n`
  doneMessage += `  ${green('✓')} Real-time security monitoring\n`
  doneMessage += `  ${green('✓')} Testing with Vitest\n`
  doneMessage += `  ${green('✓')} Linting with ESLint + security plugins\n`
  doneMessage += `  ${green('✓')} Formatting with Prettier\n`
  doneMessage += `  ${green('✓')} Secure package management\n\n`

  // Next steps
  doneMessage += `${yellow('🚀 NEXT STEPS:')}\n`
  if (root !== cwd) {
    doneMessage += `\n  1. ${cyan('cd')} ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`
  }
  switch (pkgManager) {
    case 'yarn':
      doneMessage += `\n  ${root !== cwd ? '2' : '1'}. ${cyan('yarn')} ${magenta('# Install dependencies')}`
      doneMessage += `\n  ${root !== cwd ? '3' : '2'}. ${cyan('yarn dev')} ${magenta('# Start secure HTTPS development server')}`
      break
    default:
      doneMessage += `\n  ${root !== cwd ? '2' : '1'}. ${cyan(`${pkgManager} install`)} ${magenta('# Install dependencies')}`
      doneMessage += `\n  ${root !== cwd ? '3' : '2'}. ${cyan(`${pkgManager} run dev`)} ${magenta('# Start secure HTTPS development server')}`
      break
  }

  // Additional info
  doneMessage += `\n\n${blue('═══════════════════════════════════════════════')}\n`
  doneMessage += `🌐 ${cyan('Your app will be available at:')} ${green('https://localhost:3000')}\n`
  doneMessage += `🔒 ${cyan('Security dashboard:')} ${green('https://localhost:3000/__nalth')}\n`
  doneMessage += `📚 ${cyan('Documentation:')} ${blue('https://www.nalthjs.com/docs')}\n`
  doneMessage += `${blue('═══════════════════════════════════════════════')}`

  prompts.outro(doneMessage)
}

function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, '')
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  )
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

interface PkgInfo {
  name: string
  version: string
}

function pkgFromUserAgent(userAgent: string | undefined): PkgInfo | undefined {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

function setupReactSwc(root: string, isTs: boolean) {
  // renovate: datasource=npm depName=@nalthjs/plugin-react-swc
  const reactSwcPluginVersion = '4.0.0'

  editFile(path.resolve(root, 'package.json'), (content) => {
    return content.replace(
      /"@nalthjs\/plugin-react": ".+?"/,
      `"@nalthjs/plugin-react-swc": "^${reactSwcPluginVersion}"`,
    )
  })
  editFile(
    path.resolve(root, `vite.config.${isTs ? 'ts' : 'js'}`),
    (content) => {
      return content.replace('@nalthjs/plugin-react', '@nalthjs/plugin-react-swc')
    },
  )
}

function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, 'utf-8')
  fs.writeFileSync(file, callback(content), 'utf-8')
}

function getFullCustomCommand(customCommand: string, pkgInfo?: PkgInfo) {
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.')

  return (
    customCommand
      .replace(/^npm create (?:-- )?/, () => {
        // `bun create` uses it's own set of templates,
        // the closest alternative is using `bun x` directly on the package
        if (pkgManager === 'bun') {
          return 'bun x create-'
        }
        // pnpm doesn't support the -- syntax
        if (pkgManager === 'pnpm') {
          return 'pnpm create '
        }
        // For other package managers, preserve the original format
        return customCommand.startsWith('npm create -- ')
          ? `${pkgManager} create -- `
          : `${pkgManager} create `
      })
      // Only Yarn 1.x doesn't support `@version` in the `create` command
      .replace('@latest', () => (isYarn1 ? '' : '@latest'))
      .replace(/^npm exec/, () => {
        // Prefer `pnpm dlx`, `yarn dlx`, or `bun x`
        if (pkgManager === 'pnpm') {
          return 'pnpm dlx'
        }
        if (pkgManager === 'yarn' && !isYarn1) {
          return 'yarn dlx'
        }
        if (pkgManager === 'bun') {
          return 'bun x'
        }
        // Use `npm exec` in all other cases,
        // including Yarn 1.x and other custom npm clients.
        return 'npm exec'
      })
  )
}

init().catch((e) => {
  console.error(e)
})
