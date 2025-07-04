import {useCallback} from 'react'

import {useModalStatesContext} from '@contexts/modal/__states'
import {useUserStatesContext} from '@contexts/user/__states'

import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC} from 'react'
import type {ChatRoomRowType} from '@shareType'
import {useUserCallbacksContext} from '@contexts/user/_callbacks'

type ChatRoomListObjectProps = DivCommonProps & {}

/**
 * Righter 의 Sidebar 의 제목과 채팅방 목록을 표시하는 컴포넌트다.
 */
export const ChatRoomListObject: FC<ChatRoomListObjectProps> = ({className, style, ...props}) => {
  const {setOpenChatRoomOId} = useModalStatesContext()
  const {chatRoomRowArr} = useUserStatesContext()
  const {openUserChatRoom} = useUserCallbacksContext()

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
    alignItems: 'center',

    borderColor: '#B0B0B0',
    borderBottomWidth: '1px',

    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: '100%'
  }
  const styleRoomName: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700
  }
  const styleUnreadCount: CSSProperties = {
    alignContent: 'center',
    backgroundColor: '#FFE0E0',
    borderColor: '#FF0000',
    borderRadius: '8px',
    borderWidth: '1px',

    color: '#FF0000',
    fontSize: '14px',
    fontWeight: 'bold',

    height: 'fit-content',

    marginLeft: 'auto',
    textAlign: 'center',

    width: '24px'
  }

  const onClickRow = useCallback(
    (chatRoomRow: ChatRoomRowType) => () => {
      setOpenChatRoomOId(chatRoomRow.chatRoomOId)
      openUserChatRoom(chatRoomRow.targetUserOId)
    },
    [setOpenChatRoomOId, openUserChatRoom]
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
      <div className="CHAT_ROOM_ROW_LIST ">
        {chatRoomRowArr.map((chatRoomRow, crIndex) => {
          const unreadCount = chatRoomRow.unreadCount
          const unreadCountStr = unreadCount > 99 ? '99+' : unreadCount.toString()

          return (
            <div
              className={`CHAT_ROOM_ROW idx:${crIndex}`}
              key={crIndex}
              onClick={onClickRow(chatRoomRow)}
              style={styleRow} // ::
            >
              {/* 2-1. 채팅방 이름 */}
              <p style={styleRoomName}>{chatRoomRow.chatRoomName}</p>

              {/* 2-2. 읽지 않은 메시지 갯수 */}
              {unreadCount > 0 && <p style={styleUnreadCount}>{unreadCountStr}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
