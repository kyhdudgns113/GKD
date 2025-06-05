import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {

}
// prettier-ignore
export const ModalEffectsContext = createContext<ContextType>({
  
})

export const useModalEffectsContext = () => useContext(ModalEffectsContext)

export const ModalEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <ModalEffectsContext.Provider value={{}}>{children}</ModalEffectsContext.Provider>
}
