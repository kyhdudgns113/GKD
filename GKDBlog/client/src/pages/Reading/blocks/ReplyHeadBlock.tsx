import {useCallback} from 'react'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useModalStatesContext} from '@contexts/modal/__states'
import {useModalCallbacksContext} from '@contexts/modal/_callbacks'
import {useReadingPageCallbacksContext} from '../_contexts/_callbacks'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {ReplyType} from '@shareType'
import type {DivCommonProps} from '@prop'

type ReplyHeadBlockProps = DivCommonProps & {
  reply: ReplyType
  setIsReply: (isReply: boolean) => void
}

export const ReplyHeadBlock: FC<ReplyHeadBlockProps> = ({
  reply,
  setIsReply,
  // ::
  className,
  style,
  ...props
}) => {
  const {userOId} = useAuthStatesContext()
  const {delReplyCommentOId, delReplyDateString, setDelReplyCommentOId, setDelReplyDateString} = useModalStatesContext()
  const {setEditReply} = useModalCallbacksContext()
  const {deleteReply} = useReadingPageCallbacksContext()

  const styleBlock: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row',

    height: 'fit-content',

    paddingTop: '8px',
    paddingBottom: '8px',
    paddingRight: '4px'
  }
  const styleName: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,

    marginRight: 'auto'
  }
  const styleBtn: CSSProperties = {
    borderColor: '#CCCCCC',
    borderRadius: '4px',
    borderWidth: '1px',

    fontSize: '14px',
    height: '28px',

    marginLeft: '4px',
    marginRight: '4px',

    paddingLeft: '4px',
    paddingRight: '4px',

    userSelect: 'none',

    width: 'fit-content'
  }
  const styleDelComment: CSSProperties = {
    alignItems: 'center',

    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: '2px',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.4)',

    display: 'flex',
    flexDirection: 'column',

    left: '100%',
    paddingTop: '8px',
    paddingBottom: '8px',
    position: 'absolute',
    top: '0',

    userSelect: 'none',

    width: 'fit-content',
    zIndex: 10
  }

  const onClickEdit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setEditReply(reply)
      setIsReply(false)
    },
    [reply, setEditReply, setIsReply]
  )

  const onClickDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setDelReplyCommentOId(reply.commentOId)
      setDelReplyDateString(reply.dateString)
    },
    [reply, setDelReplyCommentOId, setDelReplyDateString]
  )

  const onClickReply = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (!userOId) {
        alert(`로그인 이후 이용해주세요`)
        return
      }

      setEditReply(null)
      setIsReply(true)
    },
    [userOId, setEditReply, setIsReply]
  )

  const onClickDelOK = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      deleteReply(reply)
      setDelReplyCommentOId('')
      setDelReplyDateString('')
    },
    [reply, deleteReply, setDelReplyCommentOId, setDelReplyDateString]
  )

  const onClickDelCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setDelReplyCommentOId('')
      setDelReplyDateString('')
    },
    [setDelReplyCommentOId, setDelReplyDateString]
  )

  return (
    <div className={`REPLY_HEAD_BLOCK ${className || ''}`} style={styleBlock} {...props}>
      <p style={styleName}>{reply.userName}</p>

      {userOId === reply.userOId && (
        <div style={{position: 'relative'}}>
          <button className="BTN_SHADOW" onClick={onClickEdit} style={styleBtn}>
            수정
          </button>
          <button className="BTN_SHADOW" onClick={onClickDelete} style={styleBtn}>
            삭제
          </button>

          {/* 1-2-3. 댓글 삭제 모달 */}
          {delReplyCommentOId === reply.commentOId && delReplyDateString === reply.dateString && (
            <div onClick={e => e.stopPropagation()} style={styleDelComment} tabIndex={0}>
              {/* 1-2-3-1. 댓글 삭제 모달 제목 */}
              <p style={{fontWeight: 700, textAlign: 'center', width: '200px'}}>정말 삭제하시겠습니까?</p>

              {/* 1-2-3-2. 댓글 삭제 모달 버튼들 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  justifyContent: 'center',
                  marginTop: '12px',
                  width: '100%'
                }} // ::
              >
                <button onClick={onClickDelOK} style={styleBtn}>
                  확인
                </button>
                <button onClick={onClickDelCancel} style={styleBtn}>
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <button className="BTN_SHADOW" onClick={onClickReply} style={styleBtn}>
        답글
      </button>
    </div>
  )
}
