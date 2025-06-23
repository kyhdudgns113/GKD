import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter, SocketType} from '@type'

// prettier-ignore
type ContextType = {
  mainSocket: SocketType, setMainSocket: Setter<SocketType>
}
// prettier-ignore
export const SocketStatesContext = createContext<ContextType>({
  mainSocket: null, setMainSocket: () => {}
})

export const useSocketStatesContext = () => useContext(SocketStatesContext)

export const SocketStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [mainSocket, setMainSocket] = useState<SocketType>(null)

  // prettier-ignore
  const value: ContextType = {
    mainSocket, setMainSocket
  }

  return <SocketStatesContext.Provider value={value}>{children}</SocketStatesContext.Provider>
}
