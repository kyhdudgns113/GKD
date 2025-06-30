import {useEffect, useState} from 'react'

import {LefterSideBarPart} from './parts'

import {Icon} from '@component'
import {SAKURA_BORDER, SAKURA_TEXT} from '@value'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type LefterLayoutProps = DivCommonProps & {}

export const LefterLayout: FC<LefterLayoutProps> = ({className, style, ...props}) => {
  const [iconName_OnOff_Lefter, setIconName_OnOff_Lefter] = useState<string>('')
  const [isHideLefter, setIsHideLefter] = useState<boolean>(false)

  const styleLefter: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    marginLeft: '40px',
    minHeight: '600px',
    position: 'fixed',
    width: 'fit-content',

    top: '90px',
    left: '0',

    zIndex: 10
  }

  const styleIcon_LefterOnOff: CSSProperties = {
    alignItems: 'center',
    borderColor: SAKURA_BORDER,
    borderRadius: '20px',
    borderWidth: '4px',

    color: SAKURA_TEXT,
    cursor: 'pointer',

    fontSize: '32px',
    position: 'absolute',
    left: '105%',
    top: '300px',
    transform: 'translateY(-50%)'
  }

  // Lefter On Off 버튼 아이콘 이름 변경
  useEffect(() => {
    if (isHideLefter) {
      setIconName_OnOff_Lefter('arrow_right')
    } // ::
    else {
      setIconName_OnOff_Lefter('arrow_left')
    }
  }, [isHideLefter])

  return (
    <div className={`LEFTER ${className || ''}`} style={styleLefter} {...props}>
      {/* 1. Lefter 사이드바 */}
      {!isHideLefter && <LefterSideBarPart />}

      {/* 2. 사이드바 On Off 버튼 */}
      <Icon
        className="ON_OFF_SIDEBAR "
        iconName={iconName_OnOff_Lefter}
        onClick={() => setIsHideLefter(!isHideLefter)}
        style={styleIcon_LefterOnOff}
      />
    </div>
  )
}
