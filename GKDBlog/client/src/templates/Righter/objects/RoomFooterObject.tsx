import {useCallback, useState} from 'react'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useModalStatesContext} from '@contexts/modal/__states'
import {useSocketCallbacksContext} from '@contexts/socket/_callbacks'

import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC, KeyboardEvent, MouseEvent} from 'react'
import type {ChatMessagePayloadType} from '@socketType'

type RoomFooterObjectProps = DivCommonProps & {}

/**
 * 채팅창의 푸터
 * 1. 채팅 입력창
 * 2. 채팅 전송 버튼
 */
export const RoomFooterObject: FC<RoomFooterObjectProps> = ({className, style, ...props}) => {
  const {userName, userOId} = useAuthStatesContext()
  const {openChatRoomOId: chatRoomOId} = useModalStatesContext()
  const {emitChatSocket} = useSocketCallbacksContext()

  const [content, setContent] = useState<string>('')

  const styleObject: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row',

    width: '100%'
  }
  const styleTextarea: CSSProperties = {
    backgroundColor: '#FFFFFF',

    borderColor: '#888888',
    borderRadius: '4px',
    borderWidth: '1px',

    fontSize: '14px',
    height: '80px',

    marginBottom: '6px',
    marginLeft: '6px',
    marginRight: '3px',
    marginTop: '6px',

    paddingBottom: '3px',
    paddingLeft: '6px',
    paddingRight: '6px',
    paddingTop: '3px',

    width: '100%'
  }
  const styleSubmit: CSSProperties = {
    borderColor: '#888888',
    borderRadius: '4px',
    borderWidth: '1px',

    marginBottom: '6px',
    marginLeft: '3px',
    marginRight: '6px',
    marginTop: '6px',

    width: '48px'
  }

  const sendChatMessage = useCallback(
    (content: string) => {
      if (content.trim().length === 0) return
      if (!userName || !userOId) return

      const payload: ChatMessagePayloadType = {
        chatRoomOId,
        content,
        userOId,
        userName
      }

      emitChatSocket('chatMessage', payload)
    },
    [chatRoomOId, userName, userOId, emitChatSocket]
  )

  const onClickSubmit = useCallback(
    (content: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      sendChatMessage(content)
      setContent('')
    },
    [sendChatMessage]
  )

  const onKeyDown = useCallback(
    (content: string) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendChatMessage(content)
        setContent('')
      } // ::
      else if (e.key === 'Enter' && e.shiftKey) {
        // Work as enter key
        // Do nothing
      } // ::
    },
    [sendChatMessage]
  )

  return (
    <div className={`ROOM_FOOTER_OBJECT ${className || ''}`} style={styleObject} {...props}>
      {/* 1. 채팅 입력창 */}
      <textarea
        autoFocus
        onChange={e => setContent(e.target.value)}
        onKeyDown={onKeyDown(content)}
        style={styleTextarea}
        value={content} // ::
      />

      {/* 2. 채팅 전송 버튼 */}
      <button className="BTN_SHADOW" onClick={onClickSubmit(content)} style={styleSubmit}>
        전송
      </button>
    </div>
  )
}
