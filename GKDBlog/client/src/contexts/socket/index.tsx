import type {FC, PropsWithChildren} from 'react'
import {SocketStatesProvider} from './__states'
import {SocketCallbacksProvider} from './_callbacks'
import {SocketEffectsProvider} from './_effects'

export const SocketProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <SocketStatesProvider>
      <SocketCallbacksProvider>
        <SocketEffectsProvider>{children}</SocketEffectsProvider>
      </SocketCallbacksProvider>
    </SocketStatesProvider>
  )
}
