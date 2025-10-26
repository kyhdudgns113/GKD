import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const LockEffectsContext = createContext<ContextType>({})

export const useLockEffectsContext = () => useContext(LockEffectsContext)

export const LockEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <LockEffectsContext.Provider value={{}}>{children}</LockEffectsContext.Provider>
}
