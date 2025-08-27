import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  isLoggedIn: boolean, setIsLoggedIn: Setter<boolean>,
  picture: string, setPicture: Setter<string>,
  userAuth: number, setUserAuth: Setter<number>,
  userId: string, setUserId: Setter<string>,
  userMail: string, setUserMail: Setter<string>,
  userName: string, setUserName: Setter<string>,
  userOId: string, setUserOId: Setter<string>,
}
// prettier-ignore
export const AuthStatesContext = createContext<ContextType>({
  isLoggedIn: false, setIsLoggedIn: () => {},
  picture: '', setPicture: () => {},
  userAuth: 0, setUserAuth: () => {},
  userId: '', setUserId: () => {},
  userMail: '', setUserMail: () => {},
  userName: '', setUserName: () => {},
  userOId: '', setUserOId: () => {},
})

export const useAuthStatesContext = () => useContext(AuthStatesContext)

export const AuthStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [picture, setPicture] = useState<string>('')
  /**
   * userAuth
   *   - 유저의 권한값
   *   - 관리자용 버튼 띄우는 용도로만 쓴다
   *   - 이 값으로 권한체크를 하지 않는다
   */
  const [userAuth, setUserAuth] = useState<number>(0)
  const [userId, setUserId] = useState<string>('')
  const [userMail, setUserMail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userOId, setUserOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    isLoggedIn, setIsLoggedIn,
    picture, setPicture,
    userAuth, setUserAuth,
    userId, setUserId,
    userMail, setUserMail,
    userName, setUserName,
    userOId, setUserOId,
  }

  return <AuthStatesContext.Provider value={value}>{children}</AuthStatesContext.Provider>
}
