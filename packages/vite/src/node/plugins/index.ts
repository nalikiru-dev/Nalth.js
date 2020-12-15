import { Plugin, ResolvedConfig } from '..'
import aliasPlugin from '@rollup/plugin-alias'
import jsonPlugin from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { resolvePlugin, supportedExts } from './resolve'
import { esbuildPlugin } from './esbuild'
import { importAnalysisPlugin } from './importsAnalysis'
import { cssPlugin } from './css'
import { assetPlugin } from './asset'
import { clientInjectionsPlugin } from './clientInjections'
import { htmlPlugin } from './html'

export function resolvePlugins(
  command: 'build' | 'serve',
  config: ResolvedConfig,
  prePlugins: Plugin[],
  normalPlugins: Plugin[],
  postPlugins: Plugin[]
): Plugin[] {
  const isBuild = command === 'build'

  return [
    aliasPlugin({ entries: config.alias }),
    ...prePlugins,
    ...normalPlugins,
    resolvePlugin(config),
    nodeResolve({
      extensions: supportedExts,
      mainFields: ['module', 'jsnext', 'jsnext:main', 'browser', 'main']
    }),
    htmlPlugin(),
    cssPlugin(config, isBuild),
    esbuildPlugin(config.esbuild || {}),
    jsonPlugin(),
    assetPlugin(config, isBuild),
    ...postPlugins,
    // internal server-only plugins are always applied after everything else
    ...(isBuild
      ? []
      : [clientInjectionsPlugin(config), importAnalysisPlugin(config)])
  ].filter(Boolean) as Plugin[]
}
