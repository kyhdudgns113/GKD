import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {AuthProvider, ClubProvider, SocketProvider} from './contexts'
import {Template} from './template'
import * as P from './pages'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<P.LoginPage />} />
            <Route path="/client" element={<Template />}>
              <Route index element={<P.StartPage />} />
              <Route path="/client/mainPage" element={<P.MainPage />} />
              <Route path="/client/entireMember" element={<P.EntireMemberPage />} />
              <Route path="/client/club" element={<ClubProvider />}>
                <Route index element={<P.ClubRootPage />} />
                <Route path="/client/club/document/:clubIdx" element={<P.ClubDocumentPage />} />
                <Route path="/client/club/member/:clubIdx" element={<P.ClubMemberPage />} />
                <Route path="/client/club/record/:clubIdx" element={<P.ClubRecordPage />} />
              </Route>
              <Route path="/client/*" element={<P.NullPage />} />
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
