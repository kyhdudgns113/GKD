import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import {Icon} from '@commons/components'

type SetFileButtonProps = DivCommonProps & {}

export const SetFileButton: FC<SetFileButtonProps> = ({className, style, ...props}) => {
  return (
    <Icon
      className={`SetFileButton _icon ${className || ''}`}
      iconName="settings"
      style={style}
      {...props} // ::
    />
  )
}
