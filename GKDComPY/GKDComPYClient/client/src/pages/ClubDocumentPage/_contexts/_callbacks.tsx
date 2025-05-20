import {createContext, FC, PropsWithChildren, useContext} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const DocumentCallbacksContext = createContext<ContextType>({})

export const useDocumentCallbacksContext = () => useContext(DocumentCallbacksContext)

export const DocumentCallbacks: FC<PropsWithChildren> = ({children}) => {
  const value = {}
  return (
    <DocumentCallbacksContext.Provider value={value}>{children}</DocumentCallbacksContext.Provider>
  )
}
