import {useEffect, useState} from 'react'
import {Icon} from '@components/Icons'
import {ChatRoomListObject} from '../objects'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type RighterSideBarPartProps = DivCommonProps & {}

/**
 * Righter 의 Sidebar 와 On/Off 버튼으로 구성된 컴포넌트다.
 */
export const RighterSideBarPart: FC<RighterSideBarPartProps> = ({className, style, ...props}) => {
  const [iconName_OnOff_Righter, setIconName_OnOff_Righter] = useState<string>('')
  const [isHideRighter, setIsHideRighter] = useState<boolean>(false)

  const styleSidebar: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    position: 'relative',

    userSelect: 'none',
    width: 'fit-content'
  }
  const styleIcon_RighterOnOff: CSSProperties = {
    alignItems: 'center',
    borderColor: '#888888',
    borderRadius: '20px',
    borderWidth: '3px',

    color: '#888888',
    cursor: 'pointer',

    fontSize: '24px',
    position: 'absolute',
    right: '105%',
    top: '20px',
    transform: 'translateY(-50%)'
  }

  // Righter On Off 버튼 아이콘 이름 변경
  useEffect(() => {
    if (isHideRighter) {
      setIconName_OnOff_Righter('arrow_left')
    } // ::
    else {
      setIconName_OnOff_Righter('arrow_right')
    }
  }, [isHideRighter])

  return (
    <div className={`RIGHTER_SIDEBAR_PART ${className || ''}`} style={styleSidebar} {...props}>
      <Icon
        className="ON_OFF_SIDEBAR_GREY "
        iconName={iconName_OnOff_Righter}
        onClick={() => setIsHideRighter(prev => !prev)}
        style={styleIcon_RighterOnOff}
      />
      {!isHideRighter && <ChatRoomListObject />}
    </div>
  )
}
