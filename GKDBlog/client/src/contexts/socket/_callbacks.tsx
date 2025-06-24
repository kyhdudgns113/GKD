import {createContext, useCallback, useContext} from 'react'
import {useAuthStatesContext} from '../auth/__states'
import {useSocketStatesContext} from './__states'
import {serverUrl} from '@secret'
import {io} from 'socket.io-client'

import type {FC, PropsWithChildren} from 'react'
import type {MainSocketConnectType} from '@socketType'

// prettier-ignore
type ContextType = {
  connectMainSocket: () => void, 
  disconnectMainSocket: () => void,
  emitMainSocket: (event: string, payload: any) => void,
  onMainSocket: (event: string, listener: (...args: any[]) => void) => void
}
// prettier-ignore
export const SocketCallbacksContext = createContext<ContextType>({  
  connectMainSocket: () => {}, 
  disconnectMainSocket: () => {},
  emitMainSocket: () => {},
  onMainSocket: () => {}
})

export const useSocketCallbacksContext = () => useContext(SocketCallbacksContext)

export const SocketCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId} = useAuthStatesContext()
  const {mainSocket, setMainSocket} = useSocketStatesContext()

  /**
   * mainSocket 연결 함수
   * - 주로 socketEffectsContext 에서 호출
   */
  const connectMainSocket = useCallback(() => {
    if (!mainSocket) {
      const newSocket = io(serverUrl)
      setMainSocket(newSocket)

      const payload: MainSocketConnectType = {userOId}
      newSocket.emit('mainSocketConnect', payload)
    }
  }, [mainSocket, userOId, setMainSocket])

  /**
   * mainSocket 해제 함수
   * - 주로 socketEffectsContext 에서 호출
   */
  const disconnectMainSocket = useCallback(() => {
    if (mainSocket) {
      mainSocket.disconnect()
      setMainSocket(null)
    }
  }, [mainSocket, setMainSocket])

  /**
   * mainSocket 으로 payload 를 전송하는 함수
   */
  const emitMainSocket = useCallback(
    (event: string, payload: any) => {
      if (mainSocket) {
        mainSocket.emit(event, payload)
      }
    },
    [mainSocket]
  )

  /**
   * mainSocket에 리스너를 장착하는 함수
   */
  const onMainSocket = useCallback(
    (event: string, listener: (...args: any[]) => void) => {
      if (mainSocket) {
        mainSocket.on(event, listener)
      }
    },
    [mainSocket]
  )

  // prettier-ignore
  const value: ContextType = {
    connectMainSocket, 
    disconnectMainSocket,
    emitMainSocket,
    onMainSocket
  }
  return <SocketCallbacksContext.Provider value={value}>{children}</SocketCallbacksContext.Provider>
}
