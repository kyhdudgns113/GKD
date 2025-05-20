import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useState} from 'react'
import {DefaultEventsMap} from 'socket.io'
import {io, Socket} from 'socket.io-client'
import {serverUrl} from '../../common/secret'
import {ChatConnectType, MainConnectType} from '../../common/typesAndValues/socketTypes'

type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | null

// prettier-ignore
type ContextType = {
  emitChatSocket: (ev: string, payload: any) => void,
  emitMainSocket: (ev: string, payload: any) => void,
  initChatSocket: (uOId: string, clubOId: string) => void,
  initMainSocket: (uOId: string) => void,
  offChatSocket: (ev: string) => void
  onChatSocket: (ev: string, listener: (...args: any[]) => void) => void
  resetChatSocket: () => void,
  resetMainSocket: () => void
}

// prettier-ignore
export const SocketContext = createContext<ContextType>({
  emitChatSocket: () => {},
  emitMainSocket: () => {},
  initChatSocket: () => {},
  initMainSocket: () => {},
  offChatSocket: () => {},
  onChatSocket: () => {},
  resetChatSocket: () => {},
  resetMainSocket: () => {}
})
export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const [chatSocket, setChatSocket] = useState<SocketType>(null)
  const [mainSocket, setMainSocket] = useState<SocketType>(null)

  const emitChatSocket = useCallback(
    (ev: string, payload: any) => {
      if (chatSocket) {
        chatSocket.emit(ev, payload)
      }
    },
    [chatSocket]
  )
  const emitMainSocket = useCallback(
    (ev: string, payload: any) => {
      if (mainSocket) {
        mainSocket.emit(ev, payload)
      }
    },
    [mainSocket]
  )
  const initChatSocket = useCallback(
    (uOId: string, chatRoomOId: string) => {
      if (!chatSocket) {
        const newSocket = io(serverUrl)
        setChatSocket(newSocket)

        const payload: ChatConnectType = {chatRoomOId, uOId}
        newSocket.emit('chat connect', payload)
      }
    },
    [chatSocket]
  )
  const initMainSocket = useCallback(
    (uOId: string) => {
      if (!mainSocket) {
        const newSocket = io(serverUrl)
        setMainSocket(newSocket)

        const payload: MainConnectType = {uOId}
        newSocket.emit('main connect', payload)
      }
    },
    [mainSocket]
  )
  const offChatSocket = useCallback(
    (ev: string) => {
      if (chatSocket) {
        chatSocket.off(ev)
      }
    },
    [chatSocket]
  )
  const onChatSocket = useCallback(
    (ev: string, listener: (...args: any[]) => void) => {
      if (chatSocket) {
        chatSocket.on(ev, listener)
      }
    },
    [chatSocket]
  )
  const resetChatSocket = useCallback(() => {
    if (chatSocket) {
      chatSocket.disconnect()
      setChatSocket(null)
    }
  }, [chatSocket])
  const resetMainSocket = useCallback(() => {
    if (mainSocket) {
      mainSocket.disconnect()
      setMainSocket(null)
    }
  }, [mainSocket])

  // prettier-ignore
  const value = {
    emitChatSocket,
    emitMainSocket,
    initChatSocket,
    initMainSocket,
    offChatSocket,
    onChatSocket,
    resetChatSocket,
    resetMainSocket
  }
  return <SocketContext.Provider value={value} children={children} />
}
