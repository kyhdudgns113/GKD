import type {FC, PropsWithChildren} from 'react'
import {ModalStatesProvider} from './__states'
import {ModalCallbacksProvider} from './_callbacks'
import {ModalEffectsProvider} from './_effects'

export const ModalProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <ModalStatesProvider>
      <ModalCallbacksProvider>
        <ModalEffectsProvider>{children}</ModalEffectsProvider>
      </ModalCallbacksProvider>
    </ModalStatesProvider>
  )
}
