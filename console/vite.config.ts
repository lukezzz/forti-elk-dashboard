import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: '**/*.tsx',
    }),
    tsconfigPaths()
  ],
  server: {
    host: true,
    cors: false,
    hmr: false,
    port: 5181,
    proxy: {
      '/api/v1': {
        target: 'http://172.16.81.32:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '')
      }
    }
  }
})