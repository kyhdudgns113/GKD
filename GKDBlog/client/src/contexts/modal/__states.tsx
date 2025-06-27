import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  delCommentOId: string, setDelCommentOId: Setter<string>,
  delReplyCommentOId: string, setDelReplyCommentOId: Setter<string>,
  delReplyDateString: string, setDelReplyDateString: Setter<string>,
  
  editCommentOId: string, setEditCommentOId: Setter<string>,
  editReplyCommentOId: string, setEditReplyCommentOId: Setter<string>,
  editReplyDateString: string, setEditReplyDateString: Setter<string>,

  isOpenAlarm: boolean, setIsOpenAlarm: Setter<boolean>,
  modalName: string, setModalName: Setter<string>,
  openChatRoomOId: string, setOpenChatRoomOId: Setter<string>,

  selReadTargetOId: string, setSelReadTargetOId: Setter<string>,
}
// prettier-ignore
export const ModalStatesContext = createContext<ContextType>({
  delCommentOId: '', setDelCommentOId: () => {},
  delReplyCommentOId: '', setDelReplyCommentOId: () => {},
  delReplyDateString: '', setDelReplyDateString: () => {},

  editCommentOId: '', setEditCommentOId: () => {},
  editReplyCommentOId: '', setEditReplyCommentOId: () => {},
  editReplyDateString: '', setEditReplyDateString: () => {},

  isOpenAlarm: false, setIsOpenAlarm: () => {},
  modalName: '', setModalName: () => {},
  openChatRoomOId: '', setOpenChatRoomOId: () => {},

  selReadTargetOId: '', setSelReadTargetOId: () => {},
})

export const useModalStatesContext = () => useContext(ModalStatesContext)

export const ModalStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * delCommentOId: 삭제할 댓글의 ObjectId
   * delReplyCommentOId: 삭제할 대댓글의 commentOId
   * delReplyDate: 삭제할 대댓글의 date, 고유값과 유사한 역할을 한다.
   */
  const [delCommentOId, setDelCommentOId] = useState<string>('')
  const [delReplyCommentOId, setDelReplyCommentOId] = useState<string>('')
  const [delReplyDateString, setDelReplyDateString] = useState<string>('')
  /**
   * editCommentOId: 수정할 댓글의 ObjectId
   * editReplyCommentOId: 수정할 대댓글의 commentOId
   * editReplyDate: 수정할 대댓글의 dateString 고유값과 유사한 역할을 한다.
   */
  const [editCommentOId, setEditCommentOId] = useState<string>('')
  const [editReplyCommentOId, setEditReplyCommentOId] = useState<string>('')
  const [editReplyDateString, setEditReplyDateString] = useState<string>('')
  /**
   * isOpenAlarm: 알람 모달 열림 여부
   */
  const [isOpenAlarm, setIsOpenAlarm] = useState<boolean>(false)
  /**
   * modalName: 모달 이름
   */
  const [modalName, setModalName] = useState<string>('')
  /**
   * openChatRoomOId: 열려있는 채팅방의 ObjectId
   */
  const [openChatRoomOId, setOpenChatRoomOId] = useState<string>('')
  /**
   * selReadTargetOId: 읽기 페이지에서 선택된 댓글이나 대댓글의 ObjectId
   * - userOId 로 하면 안된다
   *   - 여러개의 댓글이나 대댓글이 선택될수도 있다.
   */
  const [selReadTargetOId, setSelReadTargetOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    delCommentOId, setDelCommentOId,
    delReplyCommentOId, setDelReplyCommentOId,
    delReplyDateString, setDelReplyDateString,

    editCommentOId, setEditCommentOId,
    editReplyCommentOId, setEditReplyCommentOId,
    editReplyDateString, setEditReplyDateString,

    isOpenAlarm, setIsOpenAlarm,
    modalName, setModalName,
    openChatRoomOId, setOpenChatRoomOId,

    selReadTargetOId, setSelReadTargetOId,
  }

  return <ModalStatesContext.Provider value={value}>{children}</ModalStatesContext.Provider>
}
