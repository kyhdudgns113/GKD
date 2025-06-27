import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.tsx'

import * as C from './contexts'

console.clear()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <C.ModalProvider>
      <C.AuthProvider>
        <C.SocketProvider>
          <C.UserProvider>
            <C.DirectoryProvider>
              <App />
            </C.DirectoryProvider>
          </C.UserProvider>
        </C.SocketProvider>
      </C.AuthProvider>
    </C.ModalProvider>
  </BrowserRouter>
)
