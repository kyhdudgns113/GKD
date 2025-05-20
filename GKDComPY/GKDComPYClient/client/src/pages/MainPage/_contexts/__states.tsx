import {createContext, useContext, useState} from 'react'
import {Setter} from '../../../common'

// prettier-ignore
type ContextType = {
  isAddClubModal: string, setIsAddClubModal: Setter<string>,
  isModifySelfModal: string, setIsModifySelfModal: Setter<string>,
  isAddUserModal: string, setIsAddUserModal: Setter<string>,
  isModifyUserModal: string, setIsModifyUserModal: Setter<string>,

  keyDownESC: boolean, setKeyDownESC: Setter<boolean>
}
// prettier-ignore
export const MainPageStatesContext = createContext<ContextType>({
  isAddClubModal: '', setIsAddClubModal: () => {},
  isModifySelfModal: '', setIsModifySelfModal: () => {},
  isAddUserModal: '', setIsAddUserModal: () => {},
  isModifyUserModal: '', setIsModifyUserModal: () => {},

  keyDownESC: false, setKeyDownESC: () => {}
})

export const useMainPageStatesContext = () => useContext(MainPageStatesContext)

export function MainPageStates({children}: {children: React.ReactNode}) {
  const [isAddClubModal, setIsAddClubModal] = useState<string>('')
  const [isAddUserModal, setIsAddUserModal] = useState<string>('')
  const [isModifySelfModal, setIsModifySelfModal] = useState<string>('')
  const [isModifyUserModal, setIsModifyUserModal] = useState<string>('')

  const [keyDownESC, setKeyDownESC] = useState<boolean>(false)

  // prettier-ignore
  const value = {
    isAddClubModal, setIsAddClubModal,
    isAddUserModal, setIsAddUserModal,
    isModifySelfModal, setIsModifySelfModal,
    isModifyUserModal, setIsModifyUserModal,

    keyDownESC, setKeyDownESC
  }
  return <MainPageStatesContext.Provider value={value}>{children}</MainPageStatesContext.Provider>
}
