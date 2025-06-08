import {ReadingPageStatesProvider} from './__states'
import {ReadingPageCallbacksProvider} from './_callbacks'
import {ReadingPageEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const ReadingPageProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <ReadingPageStatesProvider>
      <ReadingPageCallbacksProvider>
        <ReadingPageEffectsProvider>{children}</ReadingPageEffectsProvider>
      </ReadingPageCallbacksProvider>
    </ReadingPageStatesProvider>
  )
}
