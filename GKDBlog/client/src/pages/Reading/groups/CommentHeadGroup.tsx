import {useCallback} from 'react'
import {AUTH_ADMIN} from '@secret'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useModalStatesContext} from '@contexts/modal/__states'
import {useReadingPageCallbacksContext} from '../_contexts/_callbacks'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'
import type {Setter} from '@type'

/* eslint-disable */

type CommentHeadGroupProps = DivCommonProps & {
  comment: CommentType
  setContent: Setter<string>
  setIsReply: Setter<boolean>
}

export const CommentHeadGroup: FC<CommentHeadGroupProps> = ({
  comment,
  setContent,
  setIsReply,
  // ::
  className,
  style,
  ...props
}) => {
  const {userOId, userAuth} = useAuthStatesContext()
  const {delCommentOId, setDelCommentOId, setEditCommentOId} = useModalStatesContext()

  const {deleteComment} = useReadingPageCallbacksContext()

  const styleGroup: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row',

    padding: '8px'
  }
  const styleUserInfo: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,

    marginRight: 'auto'
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
  const styleBtn: CSSProperties = {
    borderColor: '#CCCCCC',
    borderRadius: '4px',
    borderWidth: '1px',

    fontSize: '14px',
    height: '28px',

    marginLeft: '5px',
    marginRight: '5px',

    paddingLeft: '4px',
    paddingRight: '4px',

    userSelect: 'none',

    width: 'fit-content'
  }

  const onClickDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setDelCommentOId(comment.commentOId)
    },
    [comment, setDelCommentOId]
  )
  const onClickDelOK = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      deleteComment(comment.commentOId)
      setDelCommentOId('')
    },
    [comment, deleteComment, setDelCommentOId]
  )
  const onClickDelCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setDelCommentOId('')
    },
    [setDelCommentOId]
  )
  const onClickEdit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setEditCommentOId(comment.commentOId)
      setIsReply(false)
    },
    [comment, setEditCommentOId, setIsReply]
  )
  const onClickReply = useCallback(() => {
    if (!userOId) {
      alert(`로그인 이후 이용해주세요`)
      return
    }

    /**
     * 1. 대댓글 창 열기
     * 2. 댓글 수정중이었으면 아닌 상태로 돌려놓기
     */

    // 1. 대댓글 창 열기
    setIsReply(true)

    // 2. 댓글 수정중이었으면 아닌 상태로 돌려놓기
    setEditCommentOId('')
    setContent(comment.content)
  }, [userOId, comment, setContent, setEditCommentOId, setIsReply])

  return (
    <div className={`COMMENT_HEADER_GROUP ${className || ''}`} style={styleGroup} {...props}>
      {/* 1-1. 유저 정보 */}
      <p style={styleUserInfo}>{comment.userName}</p>

      {/* 1-2. 액션 버튼들: 수정, 삭제, 대댓글 */}
      {(userOId === comment.userOId || userAuth === AUTH_ADMIN) && (
        <div style={{position: 'relative'}}>
          {/* 1-2-1. 댓글 수정 버튼 */}
          <button onClick={onClickEdit} style={styleBtn}>
            수정
          </button>

          {/* 1-2-2. 댓글 삭제 버튼 */}
          <button onClick={onClickDelete} style={styleBtn}>
            삭제
          </button>

          {/* 1-2-3. 댓글 삭제 모달 */}
          {delCommentOId === comment.commentOId && (
            <div onClick={e => e.stopPropagation()} style={styleDelComment} tabIndex={0}>
              {/* 1-2-3-1. 댓글 삭제 모달 제목 */}
              <p style={{fontWeight: 700, textAlign: 'center', width: '200px'}}>
                정말 삭제하시겠습니까?
              </p>

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
      <button onClick={onClickReply} style={styleBtn}>
        댓글
      </button>
    </div>
  )
}
