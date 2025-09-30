import App from './App.tsx'

import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'

import './index.css'

import * as C from '@context'

/**
 * Provider 우선순위 설명
 * - BrowserRouter 안에서만 useNavigate 를 쓸 수 있다
 * - 모든 기능은 LockProvider 를 쓰게될 수 있다
 * - Socket 통신은 다양한 상황에서 쓰일 수 있다.
 * - Auth, Directory 와 관련없이 Modal 관련 state 에 접근하게될 수 있다
 * - Alarm 은 Socket, Auth 를 써야만 한다
 *   - 로그인 상태를 확인해야 한다
 * - Directory 에서는 Auth 관련 state 에 접근하게될 수 있다
 * - File 은 속한 Directory 를 확인할 수 있어야 한다.
 */
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <C.LockProvider>
      <C.SocketProvider>
        <C.ModalProvider>
          <C.AuthProvider>
            <C.UserProvider>
              <C.ChatProvider>
                <C.DirectoryProvider>
                  <C.FileProvider>
                    <App />
                  </C.FileProvider>
                </C.DirectoryProvider>
              </C.ChatProvider>
            </C.UserProvider>
          </C.AuthProvider>
        </C.ModalProvider>
      </C.SocketProvider>
    </C.LockProvider>
  </BrowserRouter>
)
