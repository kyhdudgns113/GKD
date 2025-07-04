import {useCallback, useEffect, useState} from 'react'

import {Icon} from '@components/Icons'

import {useModalStatesContext} from '@contexts/modal/__states'

import type {ChatRoomType} from '@shareType'
import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC} from 'react'

type RoomHeaderObjectProps = DivCommonProps & {
  chatRoom: ChatRoomType
}

export const RoomHeaderObject: FC<RoomHeaderObjectProps> = ({chatRoom, className, style, ...props}) => {
  const {setOpenChatRoomOId} = useModalStatesContext()

  const [chatRoomName, setChatRoomName] = useState<string>('Loading...')

  const styleObject: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    position: 'relative',

    userSelect: 'none',

    width: '100%'
  }
  const styleName: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,

    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '12px',
    paddingRight: '6px'
  }
  const styleClose: CSSProperties = {
    borderColor: '#888888',
    borderRadius: '50%',
    borderWidth: '2px',
    cursor: 'pointer',

    fontSize: '22px',

    position: 'absolute',
    right: '7px',
    top: '7px'
  }

  const onClickClose = useCallback(() => {
    setOpenChatRoomOId('')
  }, [setOpenChatRoomOId])

  // Set chatRoomName
  useEffect(() => {
    setChatRoomName(chatRoom.targetUserName)
  }, [chatRoom])

  return (
    <div className={`ROOM_HEADER_OBJECT ${className || ''}`} style={styleObject} {...props}>
      {/* 1. 채팅하는 유저 이름 */}
      <p style={styleName}>{chatRoomName}</p>

      {/* 2. 닫기 버튼 */}
      <Icon className="BTN_SHADOW " iconName="close" onClick={onClickClose} style={styleClose} />
    </div>
  )
}
