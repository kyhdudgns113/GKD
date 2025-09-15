import {useCallback, useEffect, useState} from 'react'
import {useChatCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {ChatRoomType} from '@shareType'

type ChatRoomRowObjectProps = DivCommonProps & {chatRoom: ChatRoomType}

export const ChatRoomRowObject: FC<ChatRoomRowObjectProps> = ({chatRoom, className, style, ...props}) => {
  const {selectChatRoom} = useChatCallbacksContext()

  const [unreadStr, setUnreadStr] = useState<string>('')

  const onClickRow = useCallback(
    (chatRoomOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()
      selectChatRoom(chatRoomOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => {
    if (chatRoom.unreadMessageCount < 100) {
      setUnreadStr(`${chatRoom.unreadMessageCount}`)
    } // ::
    else {
      setUnreadStr('99+')
    }
  }, [chatRoom.unreadMessageCount])

  return (
    <div
      className={`ChatRoomRow_Object ${className || ''}`}
      onClick={onClickRow(chatRoom.chatRoomOId)}
      onMouseDown={e => e.preventDefault()}
      style={style}
      {...props} // ::
    >
      <p className="_chatRoomName">{chatRoom.chatRoomName}</p>
      <p className="_chatRoomUserId">{` (${chatRoom.targetUserId})`}</p>
      {chatRoom.unreadMessageCount > 0 && <p className="_unReadCnt">{unreadStr}</p>}
    </div>
  )
}
