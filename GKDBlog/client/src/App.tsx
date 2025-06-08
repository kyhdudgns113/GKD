import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Template} from './templates/Template'
import {AUTH_ADMIN} from '@secret'
import './App.css'

import * as C from './contexts'
import * as G from './gates'
import * as P from './pages'

function App() {
  return (
    <BrowserRouter>
      <C.ModalProvider>
        <C.AuthProvider>
          <C.DirectoryProvider>
            <Routes>
              {/* 1. Template Area */}
              <Route path="/" element={<Template />}>
                {/* 1-1. Posting Area */}
                <Route
                  path="/posting/*"
                  element={
                    <G.CheckAuthLevel requiredLevel={AUTH_ADMIN}>
                      <P.PostingPage />
                    </G.CheckAuthLevel>
                  }
                />

                {/* 1-2. Reading Area */}
                <Route path="/reading/:fileOId" element={<P.ReadingPage />} />
              </Route>

              {/* 2. Redirect Area */}
              <Route path="/redirect">
                <Route path="/redirect/errMsg/:errMsg" element={<P.RedirectErrMsgPage />} />
                <Route path="/redirect/google/:jwtFromServer" element={<P.RedirectGooglePage />} />
              </Route>
            </Routes>
          </C.DirectoryProvider>
        </C.AuthProvider>
      </C.ModalProvider>
    </BrowserRouter>
  )
}

export default App
