import {useState} from 'react'
import {MarginHeightBlock} from '@component'
import {useAuthStatesContext} from '@context'
import {AUTH_ADMIN} from '@secret'
import {ToggleButton} from './buttons'
import {AdminBtnRowPart, ChatRoomListPart} from './parts'

import './_styles/Righter.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()

  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className={`Righter ${className || ''}`} style={style} {...props}>
      <ToggleButton setIsOpen={setIsOpen} />
      <div className={`_RighterBody ${isOpen ? '_open' : '_close'} `}>
        {userAuth === AUTH_ADMIN && <AdminBtnRowPart />}
        {userAuth !== AUTH_ADMIN && <MarginHeightBlock height="40px" />}
        <ChatRoomListPart />
      </div>
    </div>
  )
}
