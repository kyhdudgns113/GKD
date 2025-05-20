import {FC, PropsWithChildren, useContext} from 'react'
import {createContext} from 'react'

// prettier-ignore
type ContextType = {

}
// prettier-ignore
export const NullPageStatesContext = createContext<ContextType>({})

export const useNullPageStatesContext = () => useContext(NullPageStatesContext)

export const NullPageStates: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value = {}
  return <NullPageStatesContext.Provider value={value}>{children}</NullPageStatesContext.Provider>
}
