import {useCallback, useEffect, useRef} from 'react'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useModalCallbacksContext} from '@contexts/modal/_callbacks'
import {useReadingPageCallbacksContext} from '../_contexts/_callbacks'

import type {ReplyType} from '@shareType'
import type {DivCommonProps} from '@prop'
import type {ChangeEvent, CSSProperties, FC} from 'react'
import type {Setter} from '@type'

type EditReplyBlockProps = DivCommonProps & {
  reply: ReplyType
  content: string
  setContent: Setter<string>
}

export const EditReplyBlock: FC<EditReplyBlockProps> = ({
  reply,
  content,
  setContent,
  // ::
  className,
  style,
  ...props
}) => {
  const {userOId} = useAuthStatesContext()
  const {setEditReply} = useModalCallbacksContext()
  const {modifyReply} = useReadingPageCallbacksContext()

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const styleBlock: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',

    width: '100%'
  }
  const styleTextArea: CSSProperties = {
    borderColor: '#CCCCCC',
    borderRadius: '4px',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',

    marginRight: '8px',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: 'auto'
  }
  const styleBtnGroup: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',

    paddingTop: '8px',
    paddingRight: '4px',

    width: '100%'
  }
  const styleBtn: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: '1px',
    borderRadius: '4px',

    marginRight: '4px',
    marginLeft: '4px',

    paddingLeft: '4px',
    paddingRight: '4px',

    userSelect: 'none'
  }

  const onChangeTextArea = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value)

      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto'
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
      }
    },
    [setContent]
  )

  const onClickCancel = useCallback(() => {
    setEditReply(null)
  }, [setEditReply])
  const onClickSubmit = useCallback(
    (content: string) => () => {
      modifyReply(reply, content)
      setEditReply(null)
    },
    [reply, modifyReply, setEditReply]
  )

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }, [content])

  return (
    <div className={`EDIT_REPLY_BLOCK ${className || ''}`} style={styleBlock} {...props}>
      {/* 1. 수정할 대댓글 영역 */}
      <textarea
        disabled={!userOId}
        onChange={onChangeTextArea}
        onClick={e => e.stopPropagation()}
        ref={textAreaRef}
        style={styleTextArea}
        value={content}
      />

      {/* 2. 버튼 그룹 */}
      <div style={styleBtnGroup}>
        <button onClick={onClickSubmit(content)} style={{...styleBtn, marginLeft: 'auto'}}>
          확인
        </button>
        <button onClick={onClickCancel} style={styleBtn}>
          취소
        </button>
      </div>
    </div>
  )
}
