import {useCallback} from 'react'
import {useChatCallbacksContext} from '@context'
import {ChatListObject, ChatRoomUserObject, ChatSubmitObject} from '../objects'
import {CloseRoomButton} from '../buttons'

import type {FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

type ChatRoomPartProps = DivCommonProps & {}

export const ChatRoomPart: FC<ChatRoomPartProps> = ({className, style, ...props}) => {
  const {unselectChatRoom} = useChatCallbacksContext()

  const onKeyDownChatRoom = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      unselectChatRoom()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`ChatRoom_Part ${className || ''}`}
      onKeyDown={onKeyDownChatRoom}
      onScroll={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
      style={style}
      tabIndex={0}
      {...props} // ::
    >
      <CloseRoomButton />
      <ChatRoomUserObject />
      <ChatListObject />
      <ChatSubmitObject />
    </div>
  )
}
