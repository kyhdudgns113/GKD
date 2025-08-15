import {Route, Routes} from 'react-router-dom'
import {Template} from './template/Template'

import * as P from '@page'

import './App.css'
import './styles/_index.scss'

function App() {
  return (
    <Routes>
      <Route path="/" element={<P.RedirectMainPage />}></Route>

      <Route path="/main" element={<Template />}>
        <Route index element={<P.IntroPage />}></Route>
      </Route>

      <Route path="*" element={<P.NullPage />}></Route>
    </Routes>
  )
}

export default App
