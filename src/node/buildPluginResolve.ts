import { Plugin } from 'rollup'
import { hmrClientId } from './serverPluginHmr'
import { InternalResolver } from './resolver'
import { resolveVue } from './vueResolver'
import { resolveWebModule } from './serverPluginModuleResolve'

const debug = require('debug')('vite:build:resolve')

export const createBuildResolvePlugin = (
  root: string,
  cdn: boolean,
  srcRoots: string[],
  resolver: InternalResolver
): Plugin => {
  return {
    name: 'vite:resolve',
    async resolveId(id: string) {
      if (id === hmrClientId) {
        return hmrClientId
      } else if (id.startsWith('/')) {
        // if id starts with any of the src root directories, it's a file request
        if (srcRoots.some((root) => id.startsWith(root))) {
          return
        }
        const resolved = resolver.requestToFile(id)
        debug(id, `-->`, resolved)
        return resolved
      } else if (id === 'vue') {
        if (!cdn) {
          return resolveVue(root).bundler
        } else {
          return {
            id: resolveVue(root).cdnLink,
            external: true
          }
        }
      } else if (!id.startsWith('.')) {
        const request = resolver.idToRequest(id)
        if (request) {
          const resolved = resolver.requestToFile(request)
          debug(id, `-->`, request, `--> `, resolved)
          return resolved
        } else {
          const webModulePath = await resolveWebModule(root, id)
          if (webModulePath) {
            return webModulePath
          }
        }
      }
    },
    load(id: string) {
      if (id === hmrClientId) {
        return `export const hot = {accept(){},on(){}}`
      }
    }
  }
}
