import {createContext, FC, PropsWithChildren} from 'react'

import {useContext} from 'react'

// prettier-ignore
type ContextType = {}

// prettier-ignore
export const NullPageEffectsContext = createContext<ContextType>({})

export const useNullPageEffectsContext = () => useContext(NullPageEffectsContext)

export const NullPageEffects: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value = {}
  return <NullPageEffectsContext.Provider value={value}>{children}</NullPageEffectsContext.Provider>
}
