import {BrowserRouter} from 'react-router-dom'
import './App.css'
import RoutesSetup from './router/RoutesSetup'
import {AuthProvider} from './contexts'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesSetup />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
