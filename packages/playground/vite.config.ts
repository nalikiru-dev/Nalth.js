import { defineConfig } from 'vite'
import vue from 'rollup-plugin-vue'

export default defineConfig({
  // @ts-ignore (when linked locally the types of different rollup installations
  // conflicts, but for end user this will work properly)
  plugins: [vue()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
