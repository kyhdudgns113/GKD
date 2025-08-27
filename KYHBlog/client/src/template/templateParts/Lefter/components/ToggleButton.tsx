import {useCallback} from 'react'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter} from '@type'

import '../_styles/Lefter.scss'

type ToggleButtonProps = DivCommonProps & {
  setIsOpen: Setter<boolean>
}

export const ToggleButton: FC<ToggleButtonProps> = ({setIsOpen, className, style, ...props}) => {
  const onClickIcon = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setIsOpen(prev => !prev)
    },
    [setIsOpen]
  )

  return (
    <Icon
      className={`_lefter_on_off ${className || ''}`}
      iconName="menu"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
