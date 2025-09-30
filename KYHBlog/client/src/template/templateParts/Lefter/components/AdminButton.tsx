import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {Icon} from '@commons/components'

import '../_styles/AdminBtnRowPart.scss'

import type {FC} from 'react'
import type {SpanCommonProps} from '@prop'

type AdminButtonProps = SpanCommonProps & {}

export const AdminButton: FC<AdminButtonProps> = ({className, style, ...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback(() => {
    navigate('/main/admin')
  }, [navigate])

  return (
    <Icon
      className={`AdminButton _icon ${className || ''}`}
      iconName="settings"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
