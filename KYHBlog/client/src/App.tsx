import {Route, Routes} from 'react-router-dom'
import {AUTH_ADMIN} from '@secret'
import {Template} from './template/Template'

import * as P from '@page'

import './App.css'
import './styles/_index.scss'

function App() {
  return (
    <Routes>
      <Route path="/" element={<P.RedirectMainPage />}></Route>

      <Route path="/main" element={<Template />}>
        <Route index element={<P.MainPage />}></Route>
        <Route path="/main/posting/*" element={<P.PostingPage reqAuth={AUTH_ADMIN} />}></Route>
        <Route path="/main/*" element={<P.NullPage />}></Route>
      </Route>

      <Route path="*" element={<P.NullPage />}></Route>
    </Routes>
  )
}

export default App
