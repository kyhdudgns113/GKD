import {createContext, useContext, useEffect} from 'react'
import {useAuthStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const AuthEffectsContext = createContext<ContextType>({})

export const useAuthEffectsContext = () => useContext(AuthEffectsContext)

export const AuthEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId, setIsLoggedIn} = useAuthStatesContext()

  // 로그인 여부를 설정한다.
  useEffect(() => {
    setIsLoggedIn(userOId ? true : false)
  }, [userOId, setIsLoggedIn])

  return <AuthEffectsContext.Provider value={{}}>{children}</AuthEffectsContext.Provider>
}
