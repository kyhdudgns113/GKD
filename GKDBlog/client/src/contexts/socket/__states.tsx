import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter, SocketType} from '@type'

// prettier-ignore
type ContextType = {
  chatSocket: SocketType, setChatSocket: Setter<SocketType>
  mainSocket: SocketType, setMainSocket: Setter<SocketType>
}
// prettier-ignore
export const SocketStatesContext = createContext<ContextType>({
  chatSocket: null, setChatSocket: () => {},
  mainSocket: null, setMainSocket: () => {}
})

export const useSocketStatesContext = () => useContext(SocketStatesContext)

export const SocketStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * chatSocket: 채팅용 소켓. 서버에서 chatRoomOId 에 종속된다.
   * mainSocket: 페이지 전체에서 사용되는 소켓. 서버에서 userOId 에 종속된다.
   */
  const [chatSocket, setChatSocket] = useState<SocketType>(null)
  const [mainSocket, setMainSocket] = useState<SocketType>(null)

  // prettier-ignore
  const value: ContextType = {
    chatSocket, setChatSocket,
    mainSocket, setMainSocket
  }

  return <SocketStatesContext.Provider value={value}>{children}</SocketStatesContext.Provider>
}
