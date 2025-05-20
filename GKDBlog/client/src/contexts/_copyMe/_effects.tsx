import {createContext, useContext, type FC, type PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {

}
// prettier-ignore
export const CopyMeEffectsContext = createContext<ContextType>({
  
})

export const useCopyMeEffectsContext = () => useContext(CopyMeEffectsContext)

export const CopyMeEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <CopyMeEffectsContext.Provider value={{}}>{children}</CopyMeEffectsContext.Provider>
}
