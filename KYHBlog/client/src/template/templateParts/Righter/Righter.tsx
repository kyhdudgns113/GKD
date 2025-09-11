import {useState} from 'react'
import {MarginHeightBlock} from '@component'
import {useAuthStatesContext, useChatStatesContext} from '@context'
import {AUTH_ADMIN} from '@secret'
import {ToggleButton} from './buttons'
import {AdminBtnRowPart, ChatRoomListPart, ChatRoomPart} from './parts'

import './_styles/Righter.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()
  const {chatRoomOId} = useChatStatesContext()

  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className={`Righter ${className || ''}`} style={style} {...props}>
      {/* 1. 사이드바 토글 버튼 */}
      <ToggleButton setIsOpen={setIsOpen} />

      {/* 2. 채팅방 파트 */}
      {chatRoomOId && <ChatRoomPart />}

      {/* 3. 채팅방 리스트 및 버튼행 파트 */}
      <div className={`_RighterBody ${isOpen ? '_open' : '_close'} `}>
        {userAuth === AUTH_ADMIN && <AdminBtnRowPart />}
        {userAuth !== AUTH_ADMIN && <MarginHeightBlock height="40px" />}
        <ChatRoomListPart />
      </div>
    </div>
  )
}
