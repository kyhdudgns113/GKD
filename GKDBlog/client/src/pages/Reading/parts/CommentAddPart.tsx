import {useCallback, useState} from 'react'

import {SAKURA_BORDER} from '@value'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useReadingPageCallbacksContext} from '../_contexts/_callbacks'
import {useReadingPageStatesContext} from '../_contexts/__states'

import type {ChangeEvent, CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type CommentAddPartProps = DivCommonProps & {}

export const CommentAddPart: FC<CommentAddPartProps> = ({className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {fileOId} = useReadingPageStatesContext()
  const {addComment} = useReadingPageCallbacksContext()

  const [comment, setComment] = useState('')

  const stylePart: CSSProperties = {
    ...style,

    borderColor: SAKURA_BORDER,
    borderRadius: '4px',
    borderWidth: '2px',

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    width: '100%'
  }
  const styleTitle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,

    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingTop: '4px'
  }
  const styleTextarea: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '1px',
    borderTopWidth: '1px',

    height: 'fit-content',
    minHeight: '120px',

    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',

    width: '100%'
  }
  const styleBtnRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    padding: '8px',

    width: '100%'
  }
  const styleBtn: CSSProperties = {
    borderRadius: '4px',
    borderWidth: '2px',

    height: '32px',

    width: '48px'
  }

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value
    if (newComment.length > 200) {
      alert('댓글은 200자 이하로 작성해주세요.')
      return
    }
    setComment(newComment)
  }, [])

  const onClickComment = useCallback(
    (e: MouseEvent<HTMLTextAreaElement>) => {
      if (!userOId) {
        e.preventDefault()
        e.stopPropagation()
        alert('로그인 이후 이용할 수 있습니다')
        return
      }
    },
    [userOId]
  )
  const onClickSubmit = useCallback(() => {
    if (comment.trim().length === 0) {
      alert('댓글을 작성해주세요.')
      return
    }
    addComment(fileOId, comment)
    setComment('')
  }, [comment, fileOId, addComment])
  const onClickCancel = useCallback(() => {
    setComment('')
  }, [])

  return (
    <div className={`COMMENT_ADD_PART ${className || ''}`} style={stylePart} {...props}>
      {/* 1. 타이틀 */}
      <p style={styleTitle}>댓글 작성</p>

      {/* 2. 댓글 작성란 */}
      <textarea
        onChange={onChangeComment}
        onClick={onClickComment}
        style={styleTextarea}
        value={comment} // ::
      />

      {/* 3. 버튼 행 */}
      <div style={styleBtnRow}>
        {/* 3-1. 확인 버튼 */}
        <button
          className="BTN_SAKURA "
          onClick={onClickSubmit}
          style={{...styleBtn, marginLeft: 'auto'}} // ::
        >
          확인
        </button>

        {/* 3-2. 취소 버튼 */}
        <button
          className="BTN_SAKURA "
          onClick={onClickCancel}
          style={{...styleBtn, marginLeft: '16px'}} // ::
        >
          취소
        </button>
      </div>
    </div>
  )
}
