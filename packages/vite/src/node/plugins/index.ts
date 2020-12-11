import { Plugin, ResolvedConfig } from '..'
import { resolvePlugin } from './resolve'
import { esbuildPlugin } from './esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { rewritePlugin } from './rewrite'
import { cssPlugin } from './css'
import { assetPlugin } from './asset'

export function resolvePlugins(
  command: 'build' | 'serve',
  config: ResolvedConfig,
  prePlugins: Plugin[],
  postPlugins: Plugin[]
): Plugin[] {
  const isBuild = command === 'build'

  return [
    ...prePlugins,
    resolvePlugin(config),
    nodeResolve({
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      mainFields: ['module', 'jsnext', 'jsnext:main', 'browser', 'main']
    }),
    esbuildPlugin(config.esbuild || {}),
    cssPlugin(config, isBuild),
    json(),
    assetPlugin(config, isBuild),
    ...postPlugins,
    // rewrite is always applied last, even after post plugins
    isBuild ? null : rewritePlugin(config)
  ].filter(Boolean) as Plugin[]
}
