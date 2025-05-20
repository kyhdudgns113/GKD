import {defineConfig} from 'vite'
import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react'
import {clientIP, clientPort} from './src/common/secret'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      },
      typescript: true
    })
  ],
  server: {
    host: clientIP,
    port: clientPort
  }
})
