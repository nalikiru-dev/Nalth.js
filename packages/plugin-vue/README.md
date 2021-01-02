# @vitejs/plugin-vue

Note: requires `@vue/compiler-sfc` as peer dependency. This is largely a port of `rollup-plugin-vue` with some vite-specific tweaks.

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()]
}
```

## Options

```ts
export interface Options {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]

  ssr?: boolean
  isProduction?: boolean

  // options to pass on to @vue/compiler-sfc
  script?: SFCScriptCompileOptions
  template?: SFCTemplateCompileOptions
  style?: SFCStyleCompileOptions
}
```

## Example for transforming custom blocks

```ts
// vite.config.js
import vue from '@vitejs/plugin-vue'

const vueI18nPlugin = {
  name: 'vue-i18n',
  transform(code, id) {
    if (!/vue&type=i18n/.test(id)) {
      return
    }
    if (/\.ya?ml$/.test(id)) {
      code = JSON.stringify(require('js-yaml').safeLoad(code.trim()))
    }
    return `export default Comp => {
      Comp.i18n = ${code}
    }`
  }
}

export default {
  plugins: [vue(), vueI18nPlugin]
}
``` 

## License

MIT