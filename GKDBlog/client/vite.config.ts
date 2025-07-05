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
  // resolve: {
  //   alias: {
  //     '@components': path.resolve(__dirname, 'src/common/components'),
  //     '@contexts': path.resolve(__dirname, 'src/contexts'),
  //     '@gates': path.resolve(__dirname, 'src/gates'),
  //     '@pages': path.resolve(__dirname, 'src/pages'),
  //     '@server': path.resolve(__dirname, 'src/server'),

  //     '@httpTypes': path.resolve(__dirname, 'src/common/types/httpDataTypes'),
  //     '@nullValues': path.resolve(__dirname, 'src/common/typesAndValues/nullValues'),
  //     '@props': path.resolve(__dirname, 'src/common/typesAndValues/props'),
  //     '@shareTypes': path.resolve(__dirname, 'src/common/types/shareTypes'),
  //     '@utils': path.resolve(__dirname, 'src/common/utils'),
  //     '@types': path.resolve(__dirname, 'src/common/types/types'),
  //     '@values': path.resolve(__dirname, 'src/common/typesAndValues/values')
  //   }
  // },
  server: {
    host: clientIP,
    port: clientPort
  }
})
