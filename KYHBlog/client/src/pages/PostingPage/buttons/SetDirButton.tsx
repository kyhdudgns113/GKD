import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import {Icon} from '@commons/components'

type SetDirButtonProps = DivCommonProps & {}

export const SetDirButton: FC<SetDirButtonProps> = ({className, style, ...props}) => {
  return (
    <Icon
      className={`SetDirButton _icon ${className || ''}`}
      iconName="settings"
      style={style}
      {...props} // ::
    />
  )
}
