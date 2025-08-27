import {createContext, useContext, useEffect} from 'react'
import {useAuthCallbacksContext} from './_callbacks'
import {useAuthStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const AuthEffectsContext = createContext<ContextType>({})

export const useAuthEffectsContext = () => useContext(AuthEffectsContext)

export const AuthEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId, setIsLoggedIn} = useAuthStatesContext()
  const {refreshToken} = useAuthCallbacksContext()

  // 새로고침시 로컬 스토리지에 저장된 유저정보를 불러온다.
  useEffect(() => {
    refreshToken(0)
  }, [refreshToken])

  // 로그인 여부를 설정한다.
  useEffect(() => {
    setIsLoggedIn(userOId ? true : false)
  }, [userOId, setIsLoggedIn])

  return <AuthEffectsContext.Provider value={{}}>{children}</AuthEffectsContext.Provider>
}
