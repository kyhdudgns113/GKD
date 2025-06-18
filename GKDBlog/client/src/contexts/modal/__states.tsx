import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  delCommentOId: string, setDelCommentOId: Setter<string>,
  modalName: string, setModalName: Setter<string>
}
// prettier-ignore
export const ModalStatesContext = createContext<ContextType>({
  delCommentOId: '', setDelCommentOId: () => {},
  modalName: '', setModalName: () => {}
})

export const useModalStatesContext = () => useContext(ModalStatesContext)

export const ModalStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * delCommentOId: 삭제할 댓글의 ObjectId
   */
  const [delCommentOId, setDelCommentOId] = useState<string>('')
  /**
   * modalName: 모달 이름
   */
  const [modalName, setModalName] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    delCommentOId, setDelCommentOId,
    modalName, setModalName,
  }

  return <ModalStatesContext.Provider value={value}>{children}</ModalStatesContext.Provider>
}
