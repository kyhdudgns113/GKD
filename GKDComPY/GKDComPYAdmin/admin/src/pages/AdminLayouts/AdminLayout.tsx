import {createContext, useContext, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {Setter} from '../../common'
import {Footer, Header, Sidebar} from './parts'

// prettier-ignore
type ContextType = {
  whichList: string, setWhichList: Setter<string>,
}

// prettier-ignore
export const AdminContext = createContext<ContextType>({
  whichList: '', setWhichList: () => {},
})
export const useAdminContext = () => {
  return useContext(AdminContext)
}

export function AdminLayout() {
  const [whichList, setWhichList] = useState<string>('')

  // prettier-ignore
  const value = {
    whichList, setWhichList,
  }
  return (
    <AdminContext.Provider
      value={value}
      children={
        <div className="DIV_LAYOUT flex flex-col h-screen bg-white ">
          <div className="p-4">
            <Header />
          </div>
          <div className="flex flex-row h-full">
            <Sidebar style={{width: '280px'}} />
            <div className="flex flex-col w-full h-screen border-2 border-gkd-sakura-border">
              <Outlet />
              <Footer />
            </div>
          </div>
        </div>
      }
    />
  )
}
