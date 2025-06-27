import {useEffect, useState} from 'react'
import {ChatRoomPart, RighterSideBarPart} from './parts'

import {useModalStatesContext} from '@contexts/modal/__states'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type RighterLayoutProps = DivCommonProps & {}

/**
 * - Template Body 의 오른쪽 영역
 * - 채팅중인 채팅방, 채팅방 목록이 표시된다.
 */
export const RighterLayout: FC<RighterLayoutProps> = ({className, style, ...props}) => {
  const {openChatRoomOId} = useModalStatesContext()
  const [isChatRoomOpen, setIsChatRoomOpen] = useState<boolean>(false)

  const styleRighterWrapper: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    marginLeft: 'auto',
    marginRight: '40px',

    minHeight: '600px',
    position: 'fixed',
    width: 'fit-content',

    top: '90px',
    right: '0',

    zIndex: 10
  }

  // 채팅방 열고 닫는 상태 관리
  useEffect(() => {
    if (openChatRoomOId) {
      setIsChatRoomOpen(true)
    } // ::
    else {
      setIsChatRoomOpen(false)
    }
  }, [openChatRoomOId, setIsChatRoomOpen])

  return (
    <div className={`RIGHTER ${className || ''}`} style={styleRighterWrapper} {...props}>
      {isChatRoomOpen && <ChatRoomPart />}
      <RighterSideBarPart />
    </div>
  )
}
