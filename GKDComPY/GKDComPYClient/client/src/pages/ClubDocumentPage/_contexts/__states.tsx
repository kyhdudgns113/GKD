import {createContext, FC, PropsWithChildren, useContext} from 'react'

type ContextType = {}

export const DocumentStatesContext = createContext<ContextType>({})

export const useDocumentStatesContext = () => useContext(DocumentStatesContext)

export const DocumentStates: FC<PropsWithChildren> = ({children}) => {
  const value = {}
  return <DocumentStatesContext.Provider value={value}>{children}</DocumentStatesContext.Provider>
}
