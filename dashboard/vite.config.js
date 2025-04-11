import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500000,
    minify: true,
  },
  optimizeDeps: {
    include: ['react-phone-input-2'],
  },
  server: {
    host: true,
  }
})
