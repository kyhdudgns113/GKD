import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import {Template} from './templates/Template'

import * as C from './contexts'
import * as G from './gates'
import * as P from './pages'

function App() {
  return (
    <BrowserRouter>
      <C.AuthProvider>
        <C.DirectoryProvider>
          <C.ModalProvider>
            <Routes>
              {/* 1. Template Area */}
              <Route path="/" element={<Template />}>
                {/* 1-1. Posting Area */}
                <Route path="/posting">
                  {/* 1-1-1. Set Directory Area */}
                  <Route
                    path="/posting/setDirectory"
                    element={
                      <G.CheckAuthLevel requiredLevel={100}>
                        <P.SetDirectoryPage />
                      </G.CheckAuthLevel>
                    }
                  />
                </Route>
              </Route>

              {/* 2. Redirect Area */}
              <Route path="/redirect">
                <Route path="/redirect/errMsg/:errMsg" element={<P.RedirectErrMsgPage />} />
                <Route path="/redirect/google/:jwtFromServer" element={<P.RedirectGooglePage />} />
              </Route>
            </Routes>
          </C.ModalProvider>
        </C.DirectoryProvider>
      </C.AuthProvider>
    </BrowserRouter>
  )
}

export default App
