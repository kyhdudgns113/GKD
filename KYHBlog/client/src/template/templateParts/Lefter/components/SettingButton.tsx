import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {Icon} from '@commons/components'

import '../_styles/AdminBtnRowPart.scss'

import type {FC} from 'react'
import type {SpanCommonProps} from '@prop'

type SettingButtonProps = SpanCommonProps & {}

export const SettingButton: FC<SettingButtonProps> = ({className, style, ...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback(() => {
    navigate('/main/setting')
  }, [navigate])

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
