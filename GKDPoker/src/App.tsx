import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import {Template} from './template'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Template />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
