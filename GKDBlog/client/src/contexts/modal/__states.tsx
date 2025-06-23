import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  delCommentOId: string, setDelCommentOId: Setter<string>,
  delReplyCommentOId: string, setDelReplyCommentOId: Setter<string>,
  delReplyDate: Date, setDelReplyDate: Setter<Date>,
  editCommentOId: string, setEditCommentOId: Setter<string>,
  editReplyCommentOId: string, setEditReplyCommentOId: Setter<string>,
  editReplyDateString: string, setEditReplyDateString: Setter<string>,
  modalName: string, setModalName: Setter<string>
}
// prettier-ignore
export const ModalStatesContext = createContext<ContextType>({
  delCommentOId: '', setDelCommentOId: () => {},
  delReplyCommentOId: '', setDelReplyCommentOId: () => {},
  delReplyDate: new Date(), setDelReplyDate: () => {},
  editCommentOId: '', setEditCommentOId: () => {},
  editReplyCommentOId: '', setEditReplyCommentOId: () => {},
  editReplyDateString: '', setEditReplyDateString: () => {},
  modalName: '', setModalName: () => {}
})

export const useModalStatesContext = () => useContext(ModalStatesContext)

export const ModalStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * delCommentOId: 삭제할 댓글의 ObjectId
   * delReplyCommentOId: 삭제할 대댓글의 commentOId
   * delReplyDate: 삭제할 대댓글의 date
   */
  const [delCommentOId, setDelCommentOId] = useState<string>('')
  const [delReplyCommentOId, setDelReplyCommentOId] = useState<string>('')
  const [delReplyDate, setDelReplyDate] = useState<Date>(new Date())
  /**
   * editCommentOId: 수정할 댓글의 ObjectId
   * editReplyCommentOId: 수정할 대댓글의 commentOId
   * editReplyDate: 수정할 대댓글의 dateString
   */
  const [editCommentOId, setEditCommentOId] = useState<string>('')
  const [editReplyCommentOId, setEditReplyCommentOId] = useState<string>('')
  const [editReplyDateString, setEditReplyDateString] = useState<string>('')
  /**
   * modalName: 모달 이름
   */
  const [modalName, setModalName] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    delCommentOId, setDelCommentOId,
    delReplyCommentOId, setDelReplyCommentOId,
    delReplyDate, setDelReplyDate,
    editCommentOId, setEditCommentOId,
    editReplyCommentOId, setEditReplyCommentOId,
    editReplyDateString, setEditReplyDateString,
    modalName, setModalName,
  }

  return <ModalStatesContext.Provider value={value}>{children}</ModalStatesContext.Provider>
}
