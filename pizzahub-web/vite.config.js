import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/pizzahub-api': {
        target: 'http://localhost:88',   // your Apache port
        changeOrigin: true,
      },
    },
  },
})
