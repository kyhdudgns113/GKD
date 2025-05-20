import type {FC, PropsWithChildren} from 'react'
import {createContext, useContext} from 'react'

// prettier-ignore
type ContextType = {
  // 
}
export const ___Context = createContext<ContextType>({
  //
})

export const use___Context = () => {
  return useContext(___Context)
}

type ___ProviderProps = {}

export const ___Provider: FC<PropsWithChildren<___ProviderProps>> = ({children}) => {
  //

  // prettier-ignore
  const value = {
    //
  }
  return <___Context.Provider value={value} children={children} />
}
