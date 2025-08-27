import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const LockCallbacksContext = createContext<ContextType>({
  
})

export const useLockCallbacksContext = () => useContext(LockCallbacksContext)

export const LockCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }
  return <LockCallbacksContext.Provider value={value}>{children}</LockCallbacksContext.Provider>
}
