import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import {Template} from './templates/Template'
import {AuthProvider, ModalProvider} from './contexts'
import * as G from './gates'
import * as P from './pages'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Template />}>
              <Route
                path="/posting/setDirectory"
                element={
                  <G.CheckAuthLevel requiredLevel={100}>
                    <P.SetDirectoryPage />
                  </G.CheckAuthLevel>
                }
              />
            </Route>
            <Route path="/redirect">
              <Route path="/redirect/errMsg/:errMsg" element={<P.RedirectErrMsgPage />} />
              <Route path="/redirect/google/:jwtFromServer" element={<P.RedirectGooglePage />} />
            </Route>
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
