import {createContext, useCallback, useContext, useEffect} from 'react'

import type {FC, PropsWithChildren} from 'react'
import {useAuthStatesContext} from '../auth/__states'
import {useSocketStatesContext} from './__states'
import {useSocketCallbacksContext} from './_callbacks'

// prettier-ignore
type ContextType = {

}
// prettier-ignore
export const SocketEffectsContext = createContext<ContextType>({
  
})

export const useSocketEffectsContext = () => useContext(SocketEffectsContext)

export const SocketEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId} = useAuthStatesContext()
  const {mainSocket} = useSocketStatesContext()
  const {connectMainSocket, disconnectMainSocket} = useSocketCallbacksContext()

  const _mainTestCallback = useCallback((payload: any) => {
    alert(`payload is ${payload.message}`)
  }, [])

  // mainSocket 연결
  useEffect(() => {
    if (userOId && !mainSocket) {
      connectMainSocket()
    }
  }, [mainSocket, userOId, connectMainSocket])

  // mainSocket 해제
  useEffect(() => {
    if (!userOId) {
      disconnectMainSocket()
    }
  }, [userOId, disconnectMainSocket])

  // mainTest 이벤트 등록
  useEffect(() => {
    if (mainSocket) {
      mainSocket.on('mainTest', _mainTestCallback)
    }
  }, [mainSocket, _mainTestCallback])

  return <SocketEffectsContext.Provider value={{}}>{children}</SocketEffectsContext.Provider>
}
