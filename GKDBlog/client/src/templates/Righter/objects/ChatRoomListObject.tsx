import {useCallback} from 'react'

import {useModalStatesContext} from '@contexts/modal/__states'
import {useUserStatesContext} from '@contexts/user/__states'

import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC} from 'react'
import type {ChatRoomRowType} from '@shareType'

type ChatRoomListObjectProps = DivCommonProps & {}

/**
 * Righter 의 Sidebar 의 제목과 채팅방 목록을 표시하는 컴포넌트다.
 */
export const ChatRoomListObject: FC<ChatRoomListObjectProps> = ({className, style, ...props}) => {
  const {setOpenChatRoomOId} = useModalStatesContext()
  const {chatRoomRowArr} = useUserStatesContext()

  const styleObject: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',

    backgroundColor: '#F0F0F0',

    borderColor: '#888888',
    borderRadius: '8px',
    borderWidth: '4px',

    boxShadow: '2px 2px 4px 0 rgba(0, 0, 0, 0.3)',

    height: 'fit-content',

    minHeight: '400px',

    width: '200px'
  }
  const styleTitle: CSSProperties = {
    borderColor: '#888888',
    borderBottomWidth: '4px',

    fontSize: '18px',
    fontWeight: 'bold',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    textAlign: 'center'
  }
  const styleRow: CSSProperties = {
    cursor: 'pointer',
    height: 'fit-content',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: '100%'
  }

  const onClickRow = useCallback(
    (chatRoomRow: ChatRoomRowType) => () => {
      setOpenChatRoomOId(chatRoomRow.chatRoomOId)
    },
    [setOpenChatRoomOId]
  )

  return (
    <div className={`CHAT_ROOM_LIST_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <style>
        {`
          .CHAT_ROOM_ROW {
            background-color: transparent;
          }
          .CHAT_ROOM_ROW:hover {
            background-color: #E0E0E0;
          }
        `}
      </style>
      {/* 1. 제목 */}
      <p style={styleTitle}>채팅 목록</p>

      {/* 2. 채팅방 목록 */}
      <div>
        {chatRoomRowArr.map((chatRoomRow, crIndex) => (
          <div className={`CHAT_ROOM_ROW idx:${crIndex}`} key={crIndex} onClick={onClickRow(chatRoomRow)} style={styleRow}>
            {chatRoomRow.chatRoomName}
          </div>
        ))}
      </div>
    </div>
  )
}
