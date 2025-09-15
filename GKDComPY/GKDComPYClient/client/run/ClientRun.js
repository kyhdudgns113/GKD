import {exec} from 'child_process'
import * as path from 'path'
import {clientIP, clientPort} from './src/common/secret.js'
// 현재 스크립트 위치
const rootDir = path.resolve()
// serve 명령어
const cmd = `npx serve -s build -l tcp://${clientIP}:${clientPort}`
console.log(`GKDComPYClient 시작: http://${clientIP}:${clientPort} (root: ${rootDir})`)
// cwd 옵션으로 현재 폴더 기준으로 실행
const server = exec(cmd, {cwd: rootDir})
server.on('close', code => console.log(`Serve 종료 (code: ${code})`))
