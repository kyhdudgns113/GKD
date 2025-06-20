import {useCallback, useRef} from 'react'
import {SAKURA_BORDER} from '@value'

import {useReadingPageCallbacksContext} from '../_contexts/_callbacks'

import {useModalStatesContext} from '@contexts/modal/__states'

import type {ChangeEvent, CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'
import type {Setter} from '@type'

type CommentFixGroupProps = DivCommonProps & {
  comment: CommentType
  content: string
  setContent: Setter<string>
}

export const CommentFixGroup: FC<CommentFixGroupProps> = ({
  comment,
  content,
  setContent,
  // ::
  className,
  style,
  ...props
}) => {
  const {setEditCommentOId} = useModalStatesContext()
  const {modifyComment} = useReadingPageCallbacksContext()

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const styleGroup: CSSProperties = {
    ...style,

    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',

    display: 'flex',
    flexDirection: 'column',

    paddingBottom: '4px',

    width: '100%'
  }
  const styleEditContent: CSSProperties = {
    borderColor: '#CCCCCC',
    borderRadius: '4px',
    borderWidth: '1px',

    fontSize: '16px',
    fontWeight: 400,

    margin: '8px',
    minHeight: '32px',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: 'auto'
  }
  const styleEditBtnRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row-reverse',

    marginTop: '4px',
    marginBottom: '4px',

    paddingRight: '8px',
    width: '100%'
  }
  const styleBtn: CSSProperties = {
    borderColor: '#CCCCCC',
    borderRadius: '4px',
    borderWidth: '1px',

    marginLeft: '5px',
    marginRight: '5px'
  }

  const onChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value)

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
      }
    },
    [setContent, textareaRef]
  )

  const onClickCancel = useCallback(() => {
    setEditCommentOId('')
    setContent(comment.content)
  }, [comment, setContent, setEditCommentOId])

  const onClickSubmit = useCallback(() => {
    if (content.trim() === '') {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    setEditCommentOId('')
    modifyComment(comment.commentOId, content)
  }, [comment, content, modifyComment, setEditCommentOId])

  return (
    <div className={`COMMENT_FIX_GROUP ${className || ''}`} style={styleGroup} {...props}>
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
  )
}
