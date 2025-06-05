import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const ReadingPageStatesContext = createContext<ContextType>({
  
})

export const useReadingPageStatesContext = () => useContext(ReadingPageStatesContext)

export const ReadingPageStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return (
    <ReadingPageStatesContext.Provider value={value}>{children}</ReadingPageStatesContext.Provider>
  )
}
