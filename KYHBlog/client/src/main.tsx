import App from './App.tsx'

import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'

import './index.css'

import * as C from '@context'

/**
 * Provider 우선순위 설명
 * - BrowserRouter 안에서만 useNavigate 를 쓸 수 있다
 * - 모든 기능은 LockProvider 를 쓰게될 수 있다
 * - Auth, Directory 와 관련없이 Modal 관련 state 에 접근하게될 수 있다
 * - Directory 에서는 Auth 관련 state 에 접근하게될 수 있다
 */
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <C.LockProvider>
      <C.ModalProvider>
        <C.AuthProvider>
          <C.DirectoryProvider>
            <App />
          </C.DirectoryProvider>
        </C.AuthProvider>
      </C.ModalProvider>
    </C.LockProvider>
  </BrowserRouter>
)
