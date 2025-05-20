import type {FC, PropsWithChildren} from 'react'
import {CopyMeStatesProvider} from './__states'
import {CopyMeCallbacksProvider} from './_callbacks'
import {CopyMeEffectsProvider} from './_effects'

export const AuthProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <CopyMeStatesProvider>
      <CopyMeCallbacksProvider>
        <CopyMeEffectsProvider>{children}</CopyMeEffectsProvider>
      </CopyMeCallbacksProvider>
    </CopyMeStatesProvider>
  )
}
