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
        <C.DirectoryProvider>
          <C.SocketProvider>
            <App />
          </C.SocketProvider>
        </C.DirectoryProvider>
      </C.AuthProvider>
    </C.ModalProvider>
  </BrowserRouter>
)
