import { readFileSync, existsSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import type { NalthDevServer, HMRPayload, ModuleNode } from '../types'
import { normalizePath, debounce } from '../utils'
import colors from 'picocolors'

export interface HMRServer {
  middleware: (req: any, res: any, next: any) => void
  handleFileChange: (file: string) => void
  handleUpdate: (updates: ModuleNode[]) => void
}

export function createHMRServer(server: NalthDevServer): HMRServer {
  const { config, ws, moduleGraph } = server
  
  // Debounced file change handler to batch updates
  const handleFileChange = debounce((file: string) => {
    const timestamp = Date.now()
    const modules = moduleGraph.getModulesByFile(file)
    
    if (!modules || modules.size === 0) {
      // File not in module graph, trigger full reload
      ws.send({
        type: 'full-reload',
        path: relative(config.root, file)
      })
      return
    }

    const updates: ModuleNode[] = []
    const visited = new Set<ModuleNode>()

    // Collect all affected modules
    for (const mod of modules) {
      collectUpdates(mod, updates, visited, timestamp)
    }

    if (updates.length === 0) {
      ws.send({
        type: 'full-reload',
        path: relative(config.root, file)
      })
      return
    }

    // Send HMR update
    ws.send({
      type: 'update',
      updates: updates.map(mod => ({
        type: mod.type,
        path: mod.file,
        acceptedPath: mod.file,
        timestamp
      }))
    })

    config.logger.info(
      colors.green('hmr update ') +
      colors.dim(relative(config.root, file)) +
      colors.dim(` (${updates.length} modules)`)
    )
  }, 50)

  const handleUpdate = (updates: ModuleNode[]) => {
    const timestamp = Date.now()
    
    ws.send({
      type: 'update',
      updates: updates.map(mod => ({
        type: mod.type,
        path: mod.file,
        acceptedPath: mod.file,
        timestamp
      }))
    })
  }

  const middleware = (req: any, res: any, next: any) => {
    if (req.url === '/client') {
      // Serve HMR client code
      res.setHeader('Content-Type', 'application/javascript')
      res.end(getHMRClientCode())
    } else {
      next()
    }
  }

  return {
    middleware,
    handleFileChange,
    handleUpdate
  }
}

function collectUpdates(
  mod: ModuleNode,
  updates: ModuleNode[],
  visited: Set<ModuleNode>,
  timestamp: number
) {
  if (visited.has(mod)) return
  visited.add(mod)

  mod.lastHMRTimestamp = timestamp
  
  if (mod.isSelfAccepting) {
    updates.push(mod)
    return
  }

  // Check if any importer accepts this module
  for (const importer of mod.importers) {
    if (importer.acceptedHmrDeps.has(mod)) {
      updates.push(importer)
      continue
    }
    
    // Recursively check importers
    collectUpdates(importer, updates, visited, timestamp)
  }
}

function getHMRClientCode(): string {
  return `
// Nalth HMR Client
console.log('[nalth] connecting...')

const socketProtocol = location.protocol === 'https:' ? 'wss' : 'ws'
const socketHost = \`\${socketProtocol}://\${location.host}/__nalth_ws\`
const socket = new WebSocket(socketHost, 'nalth-hmr')

socket.addEventListener('message', async ({ data }) => {
  handleMessage(JSON.parse(data))
})

socket.addEventListener('open', () => {
  console.log('[nalth] connected.')
})

socket.addEventListener('close', async ({ wasClean }) => {
  if (wasClean) return
  
  console.log('[nalth] server connection lost. polling for restart...')
  await waitForSuccessfulPing()
  location.reload()
})

async function handleMessage(payload) {
  switch (payload.type) {
    case 'connected':
      console.log('[nalth] connected.')
      break
      
    case 'update':
      notifyListeners('nalth:beforeUpdate', payload)
      
      // Apply updates
      for (const update of payload.updates) {
        await applyUpdate(update)
      }
      
      notifyListeners('nalth:afterUpdate', payload)
      break
      
    case 'full-reload':
      notifyListeners('nalth:beforeFullReload', payload)
      location.reload()
      break
      
    case 'security-violation':
      handleSecurityViolation(payload.violation)
      break
      
    case 'prune':
      notifyListeners('nalth:beforePrune', payload)
      // Remove unused modules
      payload.paths.forEach(path => {
        delete hotModulesMap[path]
      })
      break
      
    case 'error':
      notifyListeners('nalth:error', payload)
      console.error(\`[nalth] Internal Server Error\\n\${payload.err.message}\\n\${payload.err.stack}\`)
      break
      
    default:
      console.warn(\`[nalth] Unknown message type: \${payload.type}\`)
  }
}

const hotModulesMap = new Map()
const disposeMap = new Map()
const pruneMap = new Map()
const dataMap = new Map()
const customListenersMap = new Map()

export const createHotContext = (ownerPath) => {
  if (!dataMap.has(ownerPath)) {
    dataMap.set(ownerPath, {})
  }

  const mod = hotModulesMap.get(ownerPath)
  if (mod) {
    mod.callbacks = []
  }

  const hot = {
    get data() {
      return dataMap.get(ownerPath)
    },

    accept(deps, callback) {
      const mod = hotModulesMap.get(ownerPath) || {
        id: ownerPath,
        callbacks: []
      }
      
      if (typeof deps === 'function' || !deps) {
        // self-accept
        mod.isSelfAccepting = true
        mod.selfAcceptCallbacks = callback ? [callback] : []
      } else if (typeof deps === 'string') {
        // single dep
        mod.callbacks.push([deps, callback])
      } else if (Array.isArray(deps)) {
        // multiple deps
        deps.forEach(dep => mod.callbacks.push([dep, callback]))
      }
      
      hotModulesMap.set(ownerPath, mod)
    },

    dispose(cb) {
      disposeMap.set(ownerPath, cb)
    },

    prune(cb) {
      pruneMap.set(ownerPath, cb)
    },

    decline() {
      // Mark as non-acceptable
    },

    invalidate() {
      // Invalidate the module
      notifyListeners('nalth:invalidate', { path: ownerPath })
      location.reload()
    },

    on(event, cb) {
      const addToMap = (map) => {
        const existing = map.get(event) || []
        existing.push(cb)
        map.set(event, existing)
      }
      addToMap(customListenersMap)
    },

    send(event, data) {
      socket.send(JSON.stringify({ type: 'custom', event, data }))
    }
  }

  return hot
}

async function applyUpdate({ path, timestamp }) {
  const mod = hotModulesMap.get(path)
  if (!mod) {
    // Module not found, full reload
    location.reload()
    return
  }

  const moduleMap = new Map()
  const isSelfUpdate = path === mod.id

  if (isSelfUpdate) {
    // Self-accepting module
    moduleMap.set(mod.id, [mod.id])
  } else {
    // Check accepting modules
    for (const { deps, fn } of mod.callbacks) {
      if (deps.includes(path)) {
        moduleMap.set(mod.id, deps)
      }
    }
  }

  return Promise.all(
    Array.from(moduleMap).map(async ([id, deps]) => {
      const disposer = disposeMap.get(id)
      if (disposer) await disposer(dataMap.get(id))
      
      const [path, query] = id.split(\`?\`)
      try {
        const newMod = await import(
          /* @vite-ignore */
          path + \`?import&t=\${timestamp}\${query ? \`&\${query}\` : ''}\`
        )
        
        if (isSelfUpdate) {
          // Self-accepting module
          const selfAcceptCallbacks = mod.selfAcceptCallbacks || []
          selfAcceptCallbacks.forEach(cb => cb(newMod))
        } else {
          // Accepting module
          const callbacks = mod.callbacks.filter(([deps]) => 
            deps.some(dep => dep === path)
          )
          callbacks.forEach(([, callback]) => callback?.(newMod))
        }
      } catch (e) {
        console.error(\`[nalth] Failed to reload \${path}. This could be due to syntax errors or importing non-existent modules.\`)
        console.error(e)
        location.reload()
      }
    })
  )
}

function handleSecurityViolation(violation) {
  console.warn(\`[nalth] Security violation detected: \${violation.message}\`)
  
  // Show security notification
  if (typeof window !== 'undefined') {
    const notification = document.createElement('div')
    notification.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4757;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 14px;
      z-index: 9999;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    \`
    notification.textContent = \`🛡️ Security: \${violation.message}\`
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 5000)
  }
}

function notifyListeners(event, data) {
  const cbs = customListenersMap.get(event)
  if (cbs) {
    cbs.forEach(cb => cb(data))
  }
}

async function waitForSuccessfulPing(ms = 1000) {
  while (true) {
    try {
      await fetch(\`\${location.origin}/__nalth_ping\`)
      break
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}

// Ping endpoint for reconnection
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    socket.close()
  })
}
`
}
