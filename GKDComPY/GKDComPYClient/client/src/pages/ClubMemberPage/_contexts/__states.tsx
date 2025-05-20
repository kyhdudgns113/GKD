import {createContext, FC, PropsWithChildren, useContext, useState} from 'react'
import {Setter} from '../../../common'

// prettier-ignore
type ContextType = {
  delMemOId: string, setDelMemOId: Setter<string>,
  keyDownESC: boolean, setKeyDownESC: Setter<boolean>,
  memOId: string, setMemOId: Setter<string>,
}
// prettier-ignore
export const ClubMemberStatesContext = createContext<ContextType>({
  delMemOId: '', setDelMemOId: () => {},
  keyDownESC: false, setKeyDownESC: () => {},
  memOId: '', setMemOId: () => {},
})

export const useClubMemberStatesContext = () => useContext(ClubMemberStatesContext)

export const ClubMemberStates: FC<PropsWithChildren> = ({children}) => {
  const [delMemOId, setDelMemOId] = useState<string>('')
  const [keyDownESC, setKeyDownESC] = useState<boolean>(false)
  const [memOId, setMemOId] = useState<string>('')

  // prettier-ignore
  const value = {
    delMemOId, setDelMemOId,
    keyDownESC, setKeyDownESC,
    memOId, setMemOId,
  }
  return (
    <ClubMemberStatesContext.Provider value={value}>{children}</ClubMemberStatesContext.Provider>
  )
}
