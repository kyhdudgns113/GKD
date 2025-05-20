import {createContext, type FC, type PropsWithChildren, useContext, useState} from 'react'
import type {Setter} from '../../common'

// prettier-ignore
type ContextType = {
  modalName: string, setModalName: Setter<string>
}
// prettier-ignore
export const ModalStatesContext = createContext<ContextType>({
  modalName: '', setModalName: () => {}
})

export const useModalStatesContext = () => useContext(ModalStatesContext)

export const ModalStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [modalName, setModalName] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    modalName, setModalName,
  }

  return <ModalStatesContext.Provider value={value}>{children}</ModalStatesContext.Provider>
}
