import {createContext, useCallback, useContext} from 'react'
import {io} from 'socket.io-client'
import {decodeJwtFromServer, encodeJwtFromClient, jwtHeaderLenBase, jwtHeaderLenVali, serverUrl} from '@secret'
import {useSocketStatesContext} from './__states'

import * as SCK from '@socketType'
import * as U from '@commons/utils'

import type {FC, PropsWithChildren} from 'react'
import type {SocketType} from '@type'

// prettier-ignore
type ContextType = {
  connectSocket: (socket: SocketType, userOId: string) => Promise<void>
  disconnectSocket: (socket: SocketType) => void
  emitSocket: (socket: SocketType, event: string, payload: any) => void
  onSocket: (socket: SocketType, event: string, callback: (payload: any) => void) => void
}
// prettier-ignore
export const SocketCallbacksContext = createContext<ContextType>({
  connectSocket: () => Promise.resolve(),
  disconnectSocket: () => {},
  emitSocket: () => {},
  onSocket: () => {}
})

export const useSocketCallbacksContext = () => useContext(SocketCallbacksContext)

export const SocketCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setSocket} = useSocketStatesContext()

  const connectSocket = useCallback(async (socket: SocketType, userOId: string) => {
    if (!socket) {
      const newSocket = io(serverUrl)
      setSocket(newSocket)

      newSocket.on('response validation', (payload: SCK.SocketResponseValidationType) => {
        const {jwtFromServer} = payload

        if (!jwtFromServer) {
          alert(`서버와 소켓 연결이 안되었어요.`)
          return
        }

        const {header, jwtBody} = decodeJwtFromServer(jwtFromServer, jwtHeaderLenVali)
        const jwtFromClient = encodeJwtFromClient(header, jwtBody)

        const payloadSend: SCK.UserConnectType = {userOId, jwtFromClient}
        newSocket.emit('user connect', payloadSend)
      })

      const jwtFromServer = await U.readStringP('jwtFromServer')
      if (!jwtFromServer) {
        alert('왜 토큰이 없지')
        return
      }

      const {header, jwtBody} = decodeJwtFromServer(jwtFromServer || '', jwtHeaderLenBase)
      const jwtFromClient = encodeJwtFromClient(header, jwtBody)
      const payloadSend: SCK.SocketRequestValidationType = {jwtFromClient}
      newSocket.emit('request validation', payloadSend)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const disconnectSocket = useCallback((socket: SocketType) => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const emitSocket = useCallback((socket: SocketType, event: string, payload: any) => {
    if (socket) {
      socket.emit(event, payload)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onSocket = useCallback((socket: SocketType, event: string, callback: (payload: any) => void) => {
    if (socket) {
      socket.on(event, callback)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    connectSocket,
    disconnectSocket,
    emitSocket,
    onSocket
  }
  return <SocketCallbacksContext.Provider value={value}>{children}</SocketCallbacksContext.Provider>
}
