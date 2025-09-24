import {createContext, useContext, useRef, useState} from 'react'

import type {FC, PropsWithChildren, RefObject} from 'react'
import type {UserType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  userArr: UserType[], setUserArr: Setter<UserType[]>,

  isLoadingUserArr: RefObject<boolean>
}
// prettier-ignore
export const AdminStatesContext = createContext<ContextType>({
  userArr: [], setUserArr: () => {},

  isLoadingUserArr: {current: true}
})

export const useAdminStatesContext = () => useContext(AdminStatesContext)

export const AdminStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [userArr, setUserArr] = useState<UserType[]>([])

  const isLoadingUserArr = useRef<boolean>(true)

  // prettier-ignore
  const value: ContextType = {
    userArr, setUserArr,

    isLoadingUserArr,
  }

  return <AdminStatesContext.Provider value={value}>{children}</AdminStatesContext.Provider>
}
