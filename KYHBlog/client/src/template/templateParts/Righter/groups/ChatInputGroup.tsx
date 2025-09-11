import {useRef, useEffect, useCallback} from 'react'
import {useChatStatesContext, useChatCallbacksContext, useSocketStatesContext} from '@context'

import type {FC, KeyboardEvent, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter, SocketType} from '@type'

type ChatInputGroupProps = DivCommonProps & {value: string; setter: Setter<string>}

export const ChatInputGroup: FC<ChatInputGroupProps> = ({setter, value, className, style, ...props}) => {
  const {socket} = useSocketStatesContext()
  const {chatRoomOId} = useChatStatesContext()
  const {submitChat} = useChatCallbacksContext()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const minHeightPx = 72

  const onClickDiv = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (textareaRef.current) {
      e.preventDefault()
      textareaRef.current.focus()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDownInput = useCallback(
    (socket: SocketType, chatRoomOId: string, value: string) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        submitChat(socket, chatRoomOId, value)
        setter('')
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeightPx}px`
      textareaRef.current.style.height = `${Math.max(minHeightPx, textareaRef.current.scrollHeight)}px`
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`ChatInput_Group ${className || ''}`} style={style} {...props}>
      <div className="_input_wrapper" onClick={onClickDiv}>
        <textarea
          autoFocus
          className="_input_chat"
          onChange={e => setter(e.currentTarget.value)}
          onKeyDown={onKeyDownInput(socket, chatRoomOId, value)}
          ref={textareaRef}
          value={value} // ::
        />
      </div>
    </div>
  )
}
