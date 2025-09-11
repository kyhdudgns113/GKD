import {useChatStatesContext} from '@context'
import {ChatRoomRowObject} from '../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ChatRoomListPartProps = DivCommonProps & {}

export const ChatRoomListPart: FC<ChatRoomListPartProps> = ({className, style, ...props}) => {
  const {chatRoomArr} = useChatStatesContext()

  return (
    <div
      className={`ChatRoomList_Part ${className || ''}`}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      style={style}
      {...props} // ::
    >
      {chatRoomArr.map(chatRoom => (
        <ChatRoomRowObject key={chatRoom.chatRoomOId} chatRoom={chatRoom} />
      ))}
    </div>
  )
}
