import fs from 'fs'
import _debug from 'debug'
import { parse, SFCBlock, SFCDescriptor } from '@vue/compiler-sfc'
import {
  getDescriptor,
  setDescriptor,
  setPrevDescriptor
} from './utils/descriptorCache'
import { getResolvedScript, setResolvedScript } from './script'
import { ModuleNode } from 'vite'

const debug = _debug('vite:hmr')

/**
 * Vite-specific HMR handling
 */
export async function handleHotUpdate(
  file: string,
  modules: ModuleNode[]
): Promise<ModuleNode[] | void> {
  if (!file.endsWith('.vue')) {
    return
  }

  const prevDescriptor = getDescriptor(file)
  if (!prevDescriptor) {
    // file hasn't been requested yet (e.g. async component)
    return
  }

  let content = fs.readFileSync(file, 'utf-8')
  if (!content) {
    await untilModified(file)
    content = fs.readFileSync(file, 'utf-8')
  }

  const { descriptor } = parse(content, {
    filename: file,
    sourceMap: true
  })
  setDescriptor(file, descriptor)
  setPrevDescriptor(file, prevDescriptor)

  let needRerender = false
  const affectedModules = new Set<ModuleNode | undefined>()
  const mainModule = modules.find(
    (m) => !/type=/.test(m.url) || /type=script/.test(m.url)
  )
  const templateModule = modules.find((m) => /type=template/.test(m.url))

  if (
    !isEqualBlock(descriptor.script, prevDescriptor.script) ||
    !isEqualBlock(descriptor.scriptSetup, prevDescriptor.scriptSetup)
  ) {
    affectedModules.add(mainModule)
  }

  if (!isEqualBlock(descriptor.template, prevDescriptor.template)) {
    // when a <script setup> component's template changes, it will need correct
    // binding metadata. However, when reloading the template alone the binding
    // metadata will not be available since the script part isn't loaded.
    // in this case, reuse the compiled script from previous descriptor.
    if (mainModule && !affectedModules.has(mainModule)) {
      setResolvedScript(descriptor, getResolvedScript(prevDescriptor)!)
    }
    affectedModules.add(templateModule)
    needRerender = true
  }

  let didUpdateStyle = false
  const prevStyles = prevDescriptor.styles || []
  const nextStyles = descriptor.styles || []

  // force reload if CSS vars injection changed
  if (prevDescriptor.cssVars.join('') !== descriptor.cssVars.join('')) {
    affectedModules.add(mainModule)
  }

  // force reload if scoped status has changed
  if (prevStyles.some((s) => s.scoped) !== nextStyles.some((s) => s.scoped)) {
    // template needs to be invalidated as well
    affectedModules.add(templateModule)
    affectedModules.add(mainModule)
  }

  // only need to update styles if not reloading, since reload forces
  // style updates as well.
  for (let i = 0; i < nextStyles.length; i++) {
    const prev = prevStyles[i]
    const next = nextStyles[i]
    if (!prev || !isEqualBlock(prev, next)) {
      didUpdateStyle = true
      const mod = modules.find((m) => m.url.includes(`type=style&index=${i}`))
      if (mod) {
        affectedModules.add(mod)
      } else {
        // new style block - force reload
        affectedModules.add(mainModule)
      }
    }
  }
  if (prevStyles.length > nextStyles.length) {
    // style block removed - force reload
    affectedModules.add(mainModule)
  }

  const prevCustoms = prevDescriptor.customBlocks || []
  const nextCustoms = descriptor.customBlocks || []

  // custom blocks update causes a reload
  // because the custom block contents is changed and it may be used in JS.
  for (let i = 0; i < nextCustoms.length; i++) {
    const prev = prevCustoms[i]
    const next = nextCustoms[i]
    if (!prev || !isEqualBlock(prev, next)) {
      const mod = modules.find((m) =>
        m.url.includes(`type=${prev.type}&index=${i}`)
      )
      if (mod) {
        affectedModules.add(mod)
      } else {
        affectedModules.add(mainModule)
      }
    }
  }
  if (prevCustoms.length > nextCustoms.length) {
    // block rmeoved, force reload
    affectedModules.add(mainModule)
  }

  let updateType = []
  if (needRerender) {
    updateType.push(`template`)
    // template is inlined into main, add main module instead
    if (!templateModule) {
      affectedModules.add(mainModule)
    }
  }
  if (didUpdateStyle) {
    updateType.push(`style`)
  }
  if (updateType.length) {
    debug(`[vue:update(${updateType.join('&')})] ${file}`)
  }
  return [...affectedModules].filter(Boolean) as ModuleNode[]
}

// vitejs/vite#610 when hot-reloading Vue files, we read immediately on file
// change event and sometimes this can be too early and get an empty buffer.
// Poll until the file's modified time has changed before reading again.
async function untilModified(file: string) {
  const mtime = fs.statSync(file).mtimeMs
  return new Promise((r) => {
    let n = 0
    const poll = async () => {
      n++
      const newMtime = fs.statSync(file).mtimeMs
      if (newMtime !== mtime || n > 10) {
        r(0)
      } else {
        setTimeout(poll, 10)
      }
    }
    setTimeout(poll, 10)
  })
}

function isEqualBlock(a: SFCBlock | null, b: SFCBlock | null) {
  if (!a && !b) return true
  if (!a || !b) return false
  // src imports will trigger their own updates
  if (a.src && b.src && a.src === b.src) return true
  if (a.content !== b.content) return false
  const keysA = Object.keys(a.attrs)
  const keysB = Object.keys(b.attrs)
  if (keysA.length !== keysB.length) {
    return false
  }
  return keysA.every((key) => a.attrs[key] === b.attrs[key])
}

export function isOnlyTemplateChanged(
  prev: SFCDescriptor,
  next: SFCDescriptor
) {
  return (
    isEqualBlock(prev.script, next.script) &&
    isEqualBlock(prev.scriptSetup, next.scriptSetup) &&
    prev.styles.length === next.styles.length &&
    prev.styles.every((s, i) => isEqualBlock(s, next.styles[i])) &&
    prev.customBlocks.length === next.customBlocks.length &&
    prev.customBlocks.every((s, i) => isEqualBlock(s, next.customBlocks[i]))
  )
}
