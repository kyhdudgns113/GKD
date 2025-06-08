import type {FC, PropsWithChildren} from 'react'
import {DirectoryStatesProvider} from './__states'
import {DirectoryCallbacksProvider} from './_callbacks'
import {DirectoryEffectsProvider} from './_effects'

export const DirectoryProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <DirectoryStatesProvider>
      <DirectoryCallbacksProvider>
        <DirectoryEffectsProvider>{children}</DirectoryEffectsProvider>
      </DirectoryCallbacksProvider>
    </DirectoryStatesProvider>
  )
}
