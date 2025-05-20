import {Route, Routes} from 'react-router-dom'
import {AdminLayout} from '../pages/AdminLayouts/AdminLayout'
import LoginPage from '../pages/LoginPage/LoginPage'
import SignUpPage from '../pages/SignUpPage/SignUpPage'
import {NullPage} from '../pages/NullPage'
import {
  ClubListPage,
  CommunityListPage,
  LogListPage,
  UserListPage
} from '../pages/AdminLayouts/SubPages'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signUp" element={<SignUpPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        {/* Page 를 일일히 나눠야 각 페이지에서 필요한 정보를 그때그때 불러온다 */}
        <Route index element={<NullPage />} />
        <Route path="/admin/communityList" element={<CommunityListPage />} />
        <Route path="/admin/clubList" element={<ClubListPage />} />
        <Route path="/admin/userList" element={<UserListPage />} />
        <Route path="/admin/logList" element={<LogListPage />} />
        <Route path="*" element={<NullPage />} />
      </Route>
      <Route path="*" element={<NullPage />} />
    </Routes>
  )
}
