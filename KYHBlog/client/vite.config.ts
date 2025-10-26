import {defineConfig} from 'vite'
import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {clientIP, clientPort} from './src/common/secret'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      },
      typescript: true
    }),
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', {legacy: true}],
          ['@babel/plugin-proposal-class-properties', {loose: true}]
        ]
      }
    }),
    tsconfigPaths()
  ],
  server: {
    host: clientIP,
    port: clientPort
  }
})
