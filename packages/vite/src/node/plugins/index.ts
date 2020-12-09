import { Plugin, ResolvedConfig } from '..'
import { resolvePlugin } from './resolve'
import { esbuildPlugin } from './esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

export async function getInternalPlugins(
  command: 'build' | 'serve',
  config: ResolvedConfig
): Promise<Plugin[]> {
  return [
    resolvePlugin(config),
    nodeResolve({
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      mainFields: ['module', 'jsnext', 'jsnext:main', 'browser', 'main']
    }),
    esbuildPlugin(config.esbuild || {}),
    json()
  ].filter(Boolean) as Plugin[]
}
