import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ChatRoomListPartProps = DivCommonProps & {}

export const ChatRoomListPart: FC<ChatRoomListPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`ChatRoomList_Part ${className || ''}`} style={style} {...props}>
      <p>ChatRoomListPart</p>
    </div>
  )
}
