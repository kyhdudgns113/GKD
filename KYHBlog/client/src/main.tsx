import App from './App.tsx'

import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'

import './index.css'

import * as C from '@context'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <C.LockProvider>
      <C.ModalProvider>
        <C.AuthProvider>
          <App />
        </C.AuthProvider>
      </C.ModalProvider>
    </C.LockProvider>
  </BrowserRouter>
)
