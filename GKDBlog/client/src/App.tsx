import {Route, Routes} from 'react-router-dom'
import {Template} from './templates/Template'
import {AUTH_ADMIN} from '@secret'
import './App.css'

import * as G from './gates'
import * as P from './pages'

/**
 * 라우터 설정을 주로 작성한다.
 * - Provider 설정은 main.tsx 에서 작성한다.
 */
function App() {
  return (
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
  )
}

export default App
