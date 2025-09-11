import {useAuthStatesContext, useChatStatesContext} from '@context'
import {ChatBlockMyGroup, ChatBlockOtherGroup} from '../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ChatListObjectProps = DivCommonProps & {}

export const ChatListObject: FC<ChatListObjectProps> = ({className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {chatArr} = useChatStatesContext()

  let lastUserOId = ''
  let lastDateValue = new Date(0).valueOf()
  let lastMinute = 0

  return (
    <div className={`ChatList_Object ${className || ''}`} style={style} {...props}>
      {chatArr.map((chat, idx) => {
        const chatDate = new Date(chat.createdAt)

        const isSameUserWithLast = chat.userOId === lastUserOId
        const isSameMinute = chatDate.getMinutes() === lastMinute
        const isSimilarTime = chatDate.valueOf() - lastDateValue < 1000 * 60 * 3

        const isSameArea = isSameUserWithLast && isSameMinute && isSimilarTime

        lastUserOId = chat.userOId
        lastDateValue = chatDate.valueOf()
        lastMinute = chatDate.getMinutes()

        if (chat.userOId === userOId) {
          return <ChatBlockMyGroup chat={chat} isSameArea={isSameArea} key={idx} />
        } // ::
        else {
          return <ChatBlockOtherGroup chat={chat} isSameArea={isSameArea} key={idx} />
        }
      })}
    </div>
  )
}
