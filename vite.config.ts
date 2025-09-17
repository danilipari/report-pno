import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: [
      '.dontouch.group',
      '.ngrok-free.app',
      '.ngrok.app',
      '.ngrok.io'
    ],
    proxy: {
      '/api': {
        target: 'http://st-pno.test.k8s.dontouch.group',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
