import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  picture: string, setPicture: Setter<string>,
  userAuth: number, setUserAuth: Setter<number>,
  userId: string, setUserId: Setter<string>,
  userName: string, setUserName: Setter<string>,
  userOId: string, setUserOId: Setter<string>,
}
// prettier-ignore
export const AuthStatesContext = createContext<ContextType>({
  picture: '', setPicture: () => {},
  userAuth: 0, setUserAuth: () => {},
  userId: '', setUserId: () => {},
  userName: '', setUserName: () => {},
  userOId: '', setUserOId: () => {},
})

export const useAuthStatesContext = () => useContext(AuthStatesContext)

export const AuthStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [picture, setPicture] = useState<string>('')
  const [userAuth, setUserAuth] = useState<number>(0)
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userOId, setUserOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    picture, setPicture,
    userAuth, setUserAuth,
    userId, setUserId,
    userName, setUserName,
    userOId, setUserOId,
  }

  return <AuthStatesContext.Provider value={value}>{children}</AuthStatesContext.Provider>
}
