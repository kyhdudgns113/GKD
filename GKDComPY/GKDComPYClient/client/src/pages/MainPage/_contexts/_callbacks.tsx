import {createContext, useContext} from 'react'

// prettier-ignore
type ContextType = {

}
// prettier-ignore
export const MainPageCallbacksContext = createContext<ContextType>({
  
})

export const useMainPageCallbacksContext = () => useContext(MainPageCallbacksContext)

export function MainPageCallbacks({children}: {children: React.ReactNode}) {
  // prettier-ignore
  const value = {

  }
  return (
    <MainPageCallbacksContext.Provider value={value}>{children}</MainPageCallbacksContext.Provider>
  )
}
