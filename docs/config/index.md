# Configuring Vite

## Config File

### Config File Resolving

When running `vite` from the command line, Vite will automatically try to resolve a config file named `vite.config.js` inside [project root](/guide/#project-root).

The most basic config file looks like this:

```js
// vite.config.js
export default {
  // config options
}
```

Note Vite supports using ES modules syntax in the config file even if the project is not using native Node ESM via `type: "module"`. In this case the config file is auto pre-processed before load.

You can also explicitly specify a config file to use with the `--config` CLI option (resolved relative to `cwd`):

```bash
vite --config my-config.js
```

### Config Intellisense

Since Vite ships with TypeScript typings, you can leverage your IDE's intellisense with jsdoc type hints:

```js
/**
 * type {import('vite').UserConfig}
 */
export default {
  // ...
}
```

Vite also directly supports TS config files. You can use `vite.config.ts` instead:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

### Conditional Config

If the config needs to conditional determine options based on the command (`serve` or `build`) or the [mode](/guide/env-and-mode) being used, it can export a function instead:

```js
export default ({ command, mode }) => {
  if (command === 'serve') {
    return {
      // serve specific config
    }
  } else {
    return {
      // build specific config
    }
  }
}
```

## Shared Options

### root

- **Type:** `string`
- **Default:** `process.cwd()`

  Project root directory. Can be an absolute path, or a path relative from the location of the config file itself. See [Project Root](/guide/#project-root) for more details.

### alias

- **Type:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`

  Will be passed to `@rollup/plugin-alias` as its [entries option](https://github.com/rollup/plugins/tree/master/packages/alias#entries). Can either be an object, or an array of `{ find, replacement }` pairs.

### define

- **Type:** `Record<string, string>`

  Define global variable replacements. Entries will be defined as globals during dev and statically replaced during build.

### plugins

- **Type:** ` (Plugin | Plugin[])[]`

  Array of plugins to use. See [Plugin API](/guide/api-plugin) for more details on Vite plugins.

### css.modules

- **Type:**

  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: string[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: 'camelCaseOnly'
     */
    localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
  }
  ```

  Configure CSS modules behavior. The options are passed on to [postcss-modules](https://github.com/css-modules/postcss-modules).

### css.preprocessorOptions

- **Type:** `Record<string, object>`

  Specify options to pass to CSS pre-processors. Example:

  ```js
  export default {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`
        }
      }
    }
  }
  ```

### esbuild

- **Type:** `ESBuildTransformOptions | ((file: string) => ESBuildTransformOptions) | false`

  Specify [esbuild transform options](https://esbuild.github.io/api/#transform-api). The most common use case is customizing JSX:

  ```js
  export default {
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  }
  ```

  The option can also be a function to conditionally return options based on the name of the file being transformed.

  Set to `false` to disable ESbuild transforms (applies to `.ts`. `.tsx` and `.jsx` files by default).

### assetsInclude

- **Type:** `string | RegExp | (string | RegExp)[]`
- **Related:** [Asset Handling](/guide/features#asset-handling)

  Specify additional file types to be treated as static assets (so that importing them will return their resolved URL).

### transformInclude

- **Type:** `string | RegExp | (string | RegExp)[]`

  By default, all statically analyzable `import` requests in your code are statically treated as part of the transform pipeline. However, if you are using full dynamic import to import non-js file types, for example:

  ```js
  // dynamicPath is a non-JS file type, e.g. "./foo.gql"
  import(dynamicPath).then(/* ... */)
  ```

  Vite will not be able to know that the file needs to be transformed to JavaScript (instead of being served directly as a static file). `transformInclude` allows you to explicitly declare the file type to always be transformed and served as JavaScript.

### dedupe

- **Type:** `string[]`

  If you have duplicated copies of the same depdendency in your app (likely due to hoisting or linked packages in monorepos), use this option to force Vite to always resolve listed dependencies to the same copy (from
  project root).

### logLevel

- **Type:** `'info' | 'warn' | 'error' | 'silent'`

  Adjust console output verbosity. Default is `'info'`.

## Server Options

### server.host

- **Type:** `string`

  Specify server hostname.

### server.port

- **Type:** `number`

  Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on.

### server.https

- **Type:** `boolean | https.ServerOptions`

  Enable TLS + HTTP/2. Note this downgrades to TLS only when the [`server.proxy` option](#server-proxy) is also used.

  The value can also be an [options object](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passed to `https.createServer()`.

### server.open

- **Type:** `boolean`

  Automatically open the app in the browser on server start.

### server.proxy

- **Type:** `Record<string, string | ProxyOptions>`

  Configure custom proxy rules for the dev server. Expects an object of `{ key: options }` pairs. Uses [`http-proxy`](https://github.com/http-party/node-http-proxy). Full options [here](https://github.com/http-party/node-http-proxy#options).

  **Example:**

  ```js
  export default {
    proxy: {
      // string shorthand
      '/foo': 'http://localhost:4567/foo',
      // with options
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
  ```

### server.cors

- **Type:** `boolean | CorsOptions`

  Configure CORS for the dev server. This is enabled by default and allows any origin. Pass an [options object](https://github.com/expressjs/cors) to fine tune the behavior or `false` to disable.

### server.force

- **Type:** `boolean`
- **Related:** [Dependency Pre-Bundling](/guide/dep-pre-bundling)

  Set to `true` to force dependency pre-bundling.

### server.hmr

- **Type:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean }`

  Disable or configure HMR connection (in cases where the HMR websocket must use a different address from the http server).

  Set `server.hmr.overlay` to `false` to disable the server error overlay.

### server.watch

- **Type:** `object`

  File system watcher options to pass on to [chokidar](https://github.com/paulmillr/chokidar#api).

## Build Options

### build.base

- **Type:** `string`
- **Default:** `/`

  Base public path when served in production. Note the path should start and end with `/`. See [Public Base Path](/guide/build#public-base-path) for more details.

### build.target

- **Type:** `string`
- **Default:** `es2020`
- **Related:** [Browser Compatibility](/guide/build#browser-compatibility)

  Browser compatibility target for the final bundle. The transform is performed with esbuild and the lowest supported target is `es2015`. The target can also be a browser with version, e.g. `chrome58` or `safari11`, or an array of multiple target strings.

  Note the build will fail if the code contains features that cannot be safely transpiled by `esbuild`. See [esbuid docs](https://esbuild.github.io/api/#target) for more details.

### build.outDir

- **Type:** `string`
- **Default:** `dist`

  Specify the output directory (relative to [project root](/guide/#project-root)).

### build.assetsDir

- **Type:** `string`
- **Default:** `assets`

  Specify the directory to nest generated assets under (relative to `build.outDir`).

### build.assetsInlineLimit

- **Type:** `number`
- **Default:** `4096` (4kb)

  Imported or referenced assets that are smaller than this threshold will be inlined as base64 URLs to avoid extra http requests. Set to `0` to disable inlining altogether.

### build.cssCodeSplit

- **Type:** `boolean`
- **Default:** `true`

  Enable/dsiable CSS code splitting. When enabled, CSS imported in async chunks will be inlined into the async chunk itself and inserted when the chunk is loaded.

  If disabled, all CSS in the entire project will be extracted into a single CSS file.

### build.sourcemap

- **Type:** `boolean`
- **Default:** `false`

  Generate production source maps.

### build.rollupOptions

- **Type:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  Directly customize the underlying Rollup bundle. This is the same as options that can be exported from a Rollup config file and will be merged with Vite's internal Rollup options. See [Rollup options docs](https://rollupjs.org/guide/en/#big-list-of-options) for more details.

### build.lib

- **Type:** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[] }`
- **Related:** [Library Mode](/guide/build#library-mode)

  Build as a library. `entry` is required since the library cannot use HTML as entry. `name` is the exposed global variable and is required when `formats` includes `'umd'` or `'iife'`. Default `formats` are `['es', 'umd']`.

### build.manifest

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [Backend Integration](/guide/backend-integration)

  When set to `true`, the build will also generate a `manifest.json` file that contains mapping of non-hashed asset filenames to their hashed versions, which can then be used by a server framework to render the correct asset links.

### build.minify

- **Type:** `boolean | 'terser' | 'esbuild'`
- **Default:** `'terser'`

  Set to `false` to disable minification, or specify the minifier to use. The default is [Terser](https://github.com/terser/terser) which is slower but produces smaller bundles in most cases. Esbuild minification is significantly faster, but will result in slightly larger bundles.

### build.terserOptions

- **Type:** `TerserOptions`

  Additional [minify options](https://terser.org/docs/api-reference#minify-options) to pass on to Terser.

### build.write

- **Type:** `boolean`
- **Default:** `true`

  Set to `false` to disable writing the bundle to disk. This is mostly used in [programmatic `build()` calls](/guide/api-javascript#build) where further post processing of the bundle is needed before writing to disk.

## Dep Optimization Options

- **Related:** [Dependency Pre-Bundling](/guide/dep-pre-bundling)

### optimizeDeps.include

- **Type:** `string[]`

  Dependencies to force include in pre-bundling.

### optimizeDeps.exclude

- **Type:** `string[]`

  Dependencies to force exclude in pre-bundling.

### optimizeDeps.link

- **Type:** `string[]`

  Dependencies to be explicitly treated as linked source in pre-bundling. Note Vite 2.0 automatically detects linked packages (deps whose resolved path is not inside `node_modules`) so this should only be needed in rare cases.

### optimizeDeps.allowNodeBuiltins

- **Type:** `string[]`

  A list of dependencies that imports Node built-ins, but do not actually use them in browsers. Suppresses related warnings.

### optimizeDeps.auto

- **Type:** `boolean`
- **Default:** `true`

  Automatically run dep pre-bundling on server start? Set to `false` to disable.
