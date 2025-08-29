import {useCallback} from 'react'

import {Icon} from '@commons/components'

import type {FC} from 'react'
import type {SpanCommonProps} from '@prop'

type SettingButtonProps = SpanCommonProps & {}

export const SettingButton: FC<SettingButtonProps> = ({className, style, ...props}) => {
  const onClickIcon = useCallback(() => {
    alert(`이건 그냥 장식용이에요`)
  }, [])

  return (
    <Icon
      className={`SettingButton _icon ${className || ''}`}
      iconName="settings"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
