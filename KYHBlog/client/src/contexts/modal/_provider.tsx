import {ModalStatesProvider} from './__states'
import {ModalCallbacksProvider} from './_callbacks'
import {ModalEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const ModalProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <ModalStatesProvider>
      <ModalCallbacksProvider>
        <ModalEffectsProvider>{children}</ModalEffectsProvider>
      </ModalCallbacksProvider>
    </ModalStatesProvider>
  )
}
