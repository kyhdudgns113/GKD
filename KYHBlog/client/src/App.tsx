import {Route, Routes} from 'react-router-dom'
import {AUTH_ADMIN, AUTH_GUEST} from '@secret'
import {Template} from './template/Template'

import * as P from '@page'

import './App.css'

import './styles/_index.scss'
import {AdminProvider} from '@contexts/admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<P.RedirectMainPage />}></Route>

      <Route path="/main/*" element={<Template />}>
        <Route index element={<P.MainPage reqAuth={AUTH_GUEST} />}></Route>
        <Route path="admin/*" element={<AdminProvider reqAuth={AUTH_ADMIN} />}>
          <Route index element={<P.AdminPage />} />
          <Route path="users" element={<P.AdminUsersPage />} />
          <Route path="logs" element={<P.AdminLogsPage />} />
        </Route>
        <Route path="posting/*" element={<P.PostingPage reqAuth={AUTH_ADMIN} />}></Route>
        <Route path="reading/*" element={<P.ReadingPage reqAuth={AUTH_GUEST} />}></Route>
        <Route path="*" element={<P.NullPage />}></Route>
      </Route>

      <Route path="*" element={<P.NullPage />}></Route>
    </Routes>
  )
}

export default App
