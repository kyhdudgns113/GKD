import type {FC, PropsWithChildren} from 'react'
import {UserStatesProvider} from './__states'
import {UserCallbacksProvider} from './_callbacks'
import {UserEffectsProvider} from './_effects'

export const UserProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <UserStatesProvider>
      <UserCallbacksProvider>
        <UserEffectsProvider>{children}</UserEffectsProvider>
      </UserCallbacksProvider>
    </UserStatesProvider>
  )
}
