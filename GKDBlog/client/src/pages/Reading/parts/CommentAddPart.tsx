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

    paddingLeft: '20px',
    paddingRight: '12px',
    paddingBottom: '4px',

    width: '100%'
  }
  const styleTitle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,

    paddingTop: '8px',
    paddingBottom: '8px',

    userSelect: 'none'
  }
  const styleTextarea: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '4px',
    borderWidth: '0px',

    height: 'fit-content',

    marginLeft: '8px',
    marginRight: '16px',

    minHeight: '120px',

    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',

    width: 'auto'
  }
  const styleBtnRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    paddingBottom: '8px',
    paddingLeft: '8px',
    paddingTop: '8px',

    width: '100%'
  }
  const styleBtn: CSSProperties = {
    borderRadius: '4px',
    borderWidth: '2px',

    height: '32px',
    marginLeft: 'auto',
    userSelect: 'none',
    width: '48px'
  }

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value
    if (newComment.length > 200) {
      alert('댓글은 200자 이하로 작성해주세요.')
      setComment(newComment.slice(0, 200))
      return
    }
    setComment(newComment)
  }, [])

  const onClickComment = useCallback(
    (e: MouseEvent<HTMLTextAreaElement>) => {
      if (!userOId) {
        e.preventDefault()
        e.stopPropagation()
        setComment('')
        e.currentTarget.blur()
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

  return (
    <div className={`COMMENT_ADD_PART ${className || ''}`} style={stylePart} {...props}>
      {/* 1. 타이틀 */}
      <p style={styleTitle}>댓글 작성</p>

      {/* 2-1. 로그인시: 댓글 작성란 */}
      {userOId && (
        <textarea
          onChange={onChangeComment}
          onClick={onClickComment}
          placeholder="댓글을 작성해주세요."
          style={styleTextarea}
          value={comment} // ::
        />
      )}
      {/* 2-2. 비 로그인시: 형식상으로 있는 textarea */}
      {!userOId && <textarea onChange={() => {}} onClick={onClickComment} style={styleTextarea} value="" />}

      {/* 3. 버튼 행 */}
      <div style={styleBtnRow}>
        {/* 3-1. 확인 버튼 */}
        <button
          className="BTN_SAKURA "
          onClick={onClickSubmit}
          style={styleBtn} // ::
        >
          확인
        </button>
      </div>
    </div>
  )
}
