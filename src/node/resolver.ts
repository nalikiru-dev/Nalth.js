import path from 'path'
import slash from 'slash'
import { statSync } from 'fs'

export interface Resolver {
  requestToFile(publicPath: string, root: string): string | undefined
  fileToRequest(filePath: string, root: string): string | undefined
  idToRequest?(id: string): string | undefined
}

export interface InternalResolver {
  requestToFile(publicPath: string): string
  fileToRequest(filePath: string): string
  idToRequest(id: string): string | undefined
}

const defaultRequestToFile = (publicPath: string, root: string) =>
  path.join(root, publicPath.slice(1))

const defaultFileToRequest = (filePath: string, root: string) =>
  `/${slash(path.relative(root, filePath))}`

const defaultIdToRequest = (id: string) => {
  if (id.startsWith('@') && id.indexOf('/') < 0) {
    return `/${id}`
  }
}

const queryRE = /\?.*$/
const ensureJs = (id: string) => {
  const cleanId = id.replace(queryRE, '')
  if (!/\.\w+$/.test(cleanId)) {
    // try to see if there is actually a corresponding .js file on disk.
    // if not, return the id as-is
    try {
      statSync(cleanId + '.js')
    } catch (e) {
      return id
    }
    const queryMatch = id.match(queryRE)
    const query = queryMatch ? queryMatch[0] : ''
    return cleanId + '.js' + query
  }
  return id
}

export function createResolver(
  root: string,
  resolvers: Resolver[]
): InternalResolver {
  return {
    requestToFile: (publicPath) => {
      let resolved: string | undefined
      for (const r of resolvers) {
        const filepath = r.requestToFile(publicPath, root)
        if (filepath) {
          resolved = filepath
          break
        }
      }
      if (!resolved) {
        resolved = defaultRequestToFile(publicPath, root)
      }
      resolved = ensureJs(resolved)
      return resolved
    },
    fileToRequest: (filePath) => {
      for (const r of resolvers) {
        const request = r.fileToRequest(filePath, root)
        if (request) return request
      }
      return defaultFileToRequest(filePath, root)
    },
    idToRequest: (id: string) => {
      for (const r of resolvers) {
        const request = r.idToRequest && r.idToRequest(id)
        if (request) return request
      }
      return defaultIdToRequest(id)
    }
  }
}
