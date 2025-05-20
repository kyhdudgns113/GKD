import {createContext, FC, PropsWithChildren, useContext} from 'react'

// prettier-ignore
type ContextType = {}

// prettier-ignore
export const NullPageCallbacksContext = createContext<ContextType>({})

export const useNullPageCallbacksContext = () => useContext(NullPageCallbacksContext)

export const NullPageCallbacks: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value = {}
  return (
    <NullPageCallbacksContext.Provider value={value}>{children}</NullPageCallbacksContext.Provider>
  )
}
