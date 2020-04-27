import { promises as fs } from 'fs'
import { Plugin } from './server'
import {
  SFCDescriptor,
  SFCTemplateBlock,
  SFCStyleBlock,
  SFCStyleCompileResults
} from '@vue/compiler-sfc'
import { resolveCompiler } from './resolveVue'
import hash_sum from 'hash-sum'
import LRUCache from 'lru-cache'
import { hmrClientPublicPath } from './serverPluginHmr'
import resolve from 'resolve-from'
import { Context } from 'koa'
import { cachedRead } from './utils'

const getEtag = require('etag')
const debug = require('debug')('vite:sfc')

interface CacheEntry {
  descriptor?: SFCDescriptor
  template?: string
  script?: string
  styles: SFCStyleCompileResults[]
}

export const vueCache = new LRUCache<string, CacheEntry>({
  max: 65535
})

export const vuePlugin: Plugin = ({ root, app, resolver }) => {
  app.use(async (ctx, next) => {
    if (!ctx.path.endsWith('.vue')) {
      return next()
    }

    const query = ctx.query
    const publicPath = ctx.path
    const filePath = resolver.publicToFile(publicPath)
    const timestamp = query.t

    await cachedRead(ctx, filePath)
    const descriptor = await parseSFC(root, filePath, ctx.body)

    if (!descriptor) {
      debug(`${ctx.url} - 404`)
      ctx.status = 404
      return
    }

    if (!query.type) {
      ctx.type = 'js'
      ctx.body = compileSFCMain(descriptor, filePath, publicPath, timestamp)
      return
    }

    if (query.type === 'template') {
      ctx.type = 'js'
      ctx.body = compileSFCTemplate(
        ctx,
        root,
        descriptor.template!,
        filePath,
        publicPath,
        descriptor.styles.some((s) => s.scoped),
        timestamp
      )
      return
    }

    if (query.type === 'style') {
      const index = Number(query.index)
      const styleBlock = descriptor.styles[index]
      const result = await compileSFCStyle(
        ctx,
        root,
        styleBlock,
        index,
        filePath,
        publicPath,
        timestamp
      )
      if (query.module != null) {
        ctx.type = 'js'
        ctx.body = `export default ${JSON.stringify(result.modules)}`
      } else {
        ctx.type = 'css'
        ctx.body = result.code
      }
      return
    }

    // TODO custom blocks
  })
}

export async function parseSFC(
  root: string,
  filename: string,
  content?: string | Buffer
): Promise<SFCDescriptor | undefined> {
  let cached = vueCache.get(filename)
  if (cached && cached.descriptor) {
    return cached.descriptor
  }

  if (!content) {
    try {
      content = await fs.readFile(filename, 'utf-8')
    } catch (e) {
      return
    }
  }

  if (typeof content !== 'string') {
    content = content.toString()
  }

  const { descriptor, errors } = resolveCompiler(root).parse(content, {
    filename
  })

  if (errors) {
    // TODO
  }

  cached = cached || { styles: [] }
  cached.descriptor = descriptor
  vueCache.set(filename, cached)
  return descriptor
}

function compileSFCMain(
  descriptor: SFCDescriptor,
  filename: string,
  pathname: string,
  timestamp: string | undefined
): string {
  let cached = vueCache.get(filename)
  if (cached && cached.script) {
    return cached.script
  }

  timestamp = timestamp ? `&t=${timestamp}` : ``
  // inject hmr client
  let code = `import { updateStyle } from "${hmrClientPublicPath}"\n`
  if (descriptor.script) {
    code += descriptor.script.content.replace(
      `export default`,
      'const __script ='
    )
  } else {
    code += `const __script = {}`
  }

  const id = hash_sum(pathname)
  let hasScoped = false
  let hasCSSModules = false
  if (descriptor.styles) {
    descriptor.styles.forEach((s, i) => {
      const styleRequest = pathname + `?type=style&index=${i}${timestamp}`
      if (s.scoped) hasScoped = true
      if (s.module) {
        if (!hasCSSModules) {
          code += `\nconst __cssModules = __script.__cssModules = {}`
          hasCSSModules = true
        }
        const styleVar = `__style${i}`
        const moduleName = typeof s.module === 'string' ? s.module : '$style'
        code += `\nimport ${styleVar} from ${JSON.stringify(
          styleRequest + '&module'
        )}`
        code += `\n__cssModules[${JSON.stringify(moduleName)}] = ${styleVar}`
      }
      code += `\nupdateStyle("${id}-${i}", ${JSON.stringify(styleRequest)})`
    })
    if (hasScoped) {
      code += `\n__script.__scopeId = "data-v-${id}"`
    }
  }

  if (descriptor.template) {
    code += `\nimport { render as __render } from ${JSON.stringify(
      pathname + `?type=template${timestamp}`
    )}`
    code += `\n__script.render = __render`
  }
  code += `\n__script.__hmrId = ${JSON.stringify(pathname)}`
  code += `\n__script.__file = ${JSON.stringify(filename)}`
  code += `\nexport default __script`

  cached = cached || { styles: [] }
  cached.script = code
  vueCache.set(filename, cached)
  return code
}

function compileSFCTemplate(
  ctx: Context,
  root: string,
  template: SFCTemplateBlock,
  filename: string,
  pathname: string,
  scoped: boolean,
  timestamp: string | undefined
): string {
  let cached = vueCache.get(filename)
  if (cached && cached.template) {
    if (timestamp) {
      ctx.status = 200
    } else {
      ctx.etag = getEtag(cached.template)
    }
    return cached.template
  }

  ctx.status = 200
  const { code, errors } = resolveCompiler(root).compileTemplate({
    source: template.content,
    filename,
    compilerOptions: {
      scopeId: scoped ? `data-v-${hash_sum(pathname)}` : null,
      runtimeModuleName: '/@modules/vue'
    }
  })

  if (errors) {
    // TODO
  }

  cached = cached || { styles: [] }
  cached.template = code
  vueCache.set(filename, cached)
  return code
}

async function compileSFCStyle(
  ctx: Context,
  root: string,
  style: SFCStyleBlock,
  index: number,
  filename: string,
  pathname: string,
  timestamp: string | undefined
): Promise<SFCStyleCompileResults> {
  let cached = vueCache.get(filename)
  const cachedEntry = cached && cached.styles && cached.styles[index]
  if (cachedEntry) {
    if (timestamp) {
      ctx.status = 200
    } else {
      ctx.etag = getEtag(cachedEntry.code)
    }
    return cachedEntry
  }

  ctx.status = 200
  const id = hash_sum(pathname)
  const result = await resolveCompiler(root).compileStyleAsync({
    source: style.content,
    filename,
    id: `data-v-${id}`,
    scoped: style.scoped != null,
    modules: style.module != null,
    preprocessLang: style.lang as any,
    preprocessCustomRequire: (id: string) => require(resolve(root, id))
    // TODO load postcss config if present
  })

  if (result.errors) {
    // TODO
  }

  cached = cached || { styles: [] }
  cached.styles[index] = result
  vueCache.set(filename, cached)
  return result
}
