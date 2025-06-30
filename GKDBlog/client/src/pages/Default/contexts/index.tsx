import type {FC, PropsWithChildren} from 'react'
import {DefaultPageStatesProvider} from './__states'
import {DefaultPageCallbacksProvider} from './_callbacks'
import {DefaultPageEffectsProvider} from './_effects'

export const DefaultPageProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <DefaultPageStatesProvider>
      <DefaultPageCallbacksProvider>
        <DefaultPageEffectsProvider>{children}</DefaultPageEffectsProvider>
      </DefaultPageCallbacksProvider>
    </DefaultPageStatesProvider>
  )
}
