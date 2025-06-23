import {useCallback, useRef, useState} from 'react'

import {MarginWidthBlock} from '@component'
import {SAKURA_BG, SAKURA_BORDER} from '@value'

import {useReadingPageCallbacksContext} from '../_contexts/_callbacks'

import type {ChangeEvent, CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type AddReplyBlockProps = DivCommonProps & {
  comment: CommentType
  setIsReply: (isReply: boolean) => void
  targetUserName: string
  targetUserOId: string
}

export const AddReplyBlock: FC<AddReplyBlockProps> = ({
  comment,
  setIsReply,
  targetUserName,
  targetUserOId,
  // ::
  className,
  style,
  ...props
}) => {
  const {addReply} = useReadingPageCallbacksContext()

  const [content, setContent] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const styleGroup: CSSProperties = {
    ...style,

    backgroundColor: SAKURA_BG,
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',

    display: 'flex',
    flexDirection: 'row',

    height: 'fit-content',

    width: '100%'
  }
  const styleMain: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',

    height: 'fit-content',

    width: '100%'
  }
  const styleTopRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'center',

    paddingTop: '6px',
    paddingBottom: '6px',

    width: '100%'
  }
  const styleUserName: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    marginRight: 'auto',
    textAlign: 'center'
  }
  const styleTopBtn: CSSProperties = {
    backgroundColor: '#FFFFFF',

    borderColor: '#888888',
    borderRadius: '4px',
    borderWidth: '1px',

    marginLeft: '4px',
    marginRight: '4px',

    paddingLeft: '4px',
    paddingRight: '4px'
  }
  const styleContent: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderColor: '#888888',
    borderRadius: '4px',
    borderWidth: '1px',

    marginBottom: '12px',
    marginRight: '12px',
    marginTop: '4px',

    overflow: 'hidden',

    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',

    width: 'auto'
  }

  const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  const onClickSubmit = useCallback(() => {
    if (content.trim() === '') {
      alert('대댓글 내용을 입력해주세요')
      return
    }

    addReply(comment.commentOId, targetUserName, targetUserOId, content)
    setContent('')
    setIsReply(false)
    // ::
  }, [comment, content, targetUserName, targetUserOId, addReply, setContent, setIsReply])

  const onClickCancel = useCallback(() => {
    setIsReply(false)
  }, [setIsReply])

  return (
    <div className={`ADD_REPLY_GROUP ${className || ''}`} style={styleGroup} {...props}>
      <MarginWidthBlock width="32px" />

      <div style={styleMain}>
        {/* 1. 최상단 행: 댓글 대상, 버튼 */}
        <div style={styleTopRow}>
          <p style={styleUserName}>{`  Reply to ${targetUserName}`}</p>
          <button onClick={onClickSubmit} style={styleTopBtn}>
            작성
          </button>
          <button onClick={onClickCancel} style={styleTopBtn}>
            취소
          </button>
        </div>

        {/* 2. 대댓글 내용 */}
        <textarea
          onChange={onChangeContent}
          ref={textareaRef}
          style={styleContent}
          value={content} // ::
        />
      </div>
    </div>
  )
}
