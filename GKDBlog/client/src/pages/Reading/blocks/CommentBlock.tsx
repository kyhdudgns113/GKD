import {useCallback, useEffect, useRef, useState} from 'react'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useModalStatesContext} from '@contexts/modal/__states'
import {useReadingPageCallbacksContext} from '../_contexts/_callbacks'

import {AUTH_ADMIN} from '@secret'
import {SAKURA_BORDER} from '@value'

import type {ChangeEvent, CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentBlockProps = DivCommonProps & {
  comment: CommentType
}

/* eslint-disable */
export const CommentBlock: FC<CommentBlockProps> = ({comment, className, style, ...props}) => {
  const {userOId, userAuth} = useAuthStatesContext()
  const {delCommentOId, setDelCommentOId} = useModalStatesContext()

  const {deleteComment, modifyComment} = useReadingPageCallbacksContext()
  const [content, setContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const styleBlock: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column'
  }
  const styleInfoActionRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',

    padding: '8px'
  }
  const styleUserInfo: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,

    marginRight: 'auto'
  }
  const styleBtn: CSSProperties = {
    borderColor: '#CCCCCC',
    borderRadius: '4px',
    borderWidth: '1px',

    fontSize: '14px',
    height: '32px',

    marginLeft: '5px',
    marginRight: '5px',

    paddingLeft: '4px',
    paddingRight: '4px',

    userSelect: 'none',

    width: 'fit-content'
  }
  const styleContent: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',

    fontSize: '16px',
    fontWeight: 400,

    minHeight: '32px',

    paddingLeft: '16px',
    paddingRight: '16px',

    width: '100%'
  }
  const styleEditRow: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',

    display: 'flex',
    flexDirection: 'column',

    width: '100%'
  }
  const styleEditContent: CSSProperties = {
    fontSize: '16px',
    fontWeight: 400,

    minHeight: '32px',

    paddingLeft: '16px',
    paddingRight: '16px',

    width: '100%'
  }
  const styleEditBtnRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row-reverse',

    width: '100%'
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

  const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [])

  const onClickCancel = useCallback(() => {
    setIsEditing(false)
    setContent(comment.content)
  }, [comment])
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
  const onClickEdit = useCallback(() => {
    setIsEditing(true)
  }, [])
  const onClickReply = useCallback(() => {
    /**
     * 1. 대댓글 창 열기
     * 2. 댓글 수정중이었으면 아닌 상태로 돌려놓기
     */

    // 1. 대댓글 창 열기
    alert('구현해주세요. 1. 대댓글 창 열기')

    // 2. 댓글 수정중이었으면 아닌 상태로 돌려놓기
    setIsEditing(false)
    setContent(comment.content)
  }, [comment])
  const onClickSubmit = useCallback(() => {
    if (content.trim() === '') {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    setIsEditing(false)
    modifyComment(comment.commentOId, content)
  }, [comment, content, modifyComment])

  // 마운트 초기: 댓글 수정중인지 여부 초기화
  useEffect(() => {
    setIsEditing(false)
  }, [])

  // content(댓글 내용 수정때 사용) 초기화
  useEffect(() => {
    setContent(comment.content)
  }, [comment])

  return (
    <div
      className={`COMMENT_BLOCK ${className || ''}`}
      style={styleBlock}
      {...props} // ::
    >
      {/* 1. 유저 정보 및 액션 행 */}
      <div style={styleInfoActionRow}>
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
                    marginTop: '12px',
                    width: '100%',
                    gap: '16px',
                    justifyContent: 'center'
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

      {/* 2-1. 댓글 내용: 수정중 아닐때 */}
      {!isEditing && <p style={styleContent}>{comment.content}</p>}

      {/* 2-2. 댓글 내용: 수정중일때 */}
      {isEditing && (
        <div style={styleEditRow}>
          {/* 2-2-1. 수정중인 댓글 내용 */}
          <textarea
            onChange={onChangeContent}
            ref={textareaRef}
            style={styleEditContent}
            value={content} // ::
          />

          {/* 2-2-2. 버튼: 확인, 취소 */}
          <div style={styleEditBtnRow}>
            <button onClick={onClickCancel} style={styleBtn}>
              취소
            </button>
            <button onClick={onClickSubmit} style={styleBtn}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* 3. 대댓글 배열 */}
    </div>
  )
}
/* eslint-enable */
