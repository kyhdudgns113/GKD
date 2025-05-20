import {createContext, useContext, type FC, type PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const CopyMeCallbacksContext = createContext<ContextType>({
  
})

export const useCopyMeCallbacksContext = () => useContext(CopyMeCallbacksContext)

export const CopyMeCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }
  return <CopyMeCallbacksContext.Provider value={value}>{children}</CopyMeCallbacksContext.Provider>
}
