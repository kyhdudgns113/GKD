import {createContext, useCallback, useContext} from 'react'

import {useModalStatesContext} from './__states'
import {MODAL_NAMES_ARR} from '@value'

import type {FC, PropsWithChildren} from 'react'
import type {ReplyType} from '@shareType'

// prettier-ignore
type ContextType = {
  closeModal: () => void,
  openModal: (modalName: string) => void,
  setEditReply: (reply: ReplyType | null) => void,
}
// prettier-ignore
export const ModalCallbacksContext = createContext<ContextType>({
  closeModal: () => {},
  openModal: () => {},
  setEditReply: () => {},
})

export const useModalCallbacksContext = () => useContext(ModalCallbacksContext)

export const ModalCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setEditReplyCommentOId, setEditReplyDateString, setModalName} = useModalStatesContext()

  /**
   * 모달을 닫는 함수
   */
  const closeModal = useCallback(() => {
    setModalName('')
  }, [setModalName])

  /**
   * 모달을 여는 함수
   * @param modalName 모달 이름. MODAL_NAMES_ARR 안에 모달 이름이 있어야 정상작동.
   */
  const openModal = useCallback(
    (modalName: string) => {
      if (!MODAL_NAMES_ARR.includes(modalName)) {
        alert(`openModal 함수에 전달된 모달 이름이 유효하지 않습니다. modalName: ${modalName}`)
        return
      }
      setModalName(modalName)
    },
    [setModalName]
  )

  const setEditReply = useCallback(
    (reply: ReplyType | null) => {
      if (reply) {
        setEditReplyCommentOId(reply.commentOId)
        setEditReplyDateString(reply.dateString)
      } // ::
      else {
        setEditReplyCommentOId('')
        setEditReplyDateString('')
      }
    },
    [setEditReplyCommentOId, setEditReplyDateString]
  )

  // prettier-ignore
  const value: ContextType = {
    closeModal,
    openModal,
    setEditReply,
  }
  return <ModalCallbacksContext.Provider value={value}>{children}</ModalCallbacksContext.Provider>
}
