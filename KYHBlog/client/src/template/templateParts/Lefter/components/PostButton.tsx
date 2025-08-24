import {useNavigate} from 'react-router-dom'
import {Icon} from '@commons/components'

import '../_styles/AdminBtnRowPart.scss'

import {useCallback, type FC} from 'react'
import type {SpanCommonProps} from '@prop'

type PostButtonProps = SpanCommonProps & {}

export const PostButton: FC<PostButtonProps> = ({className, style, ...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback(() => {
    navigate('/main/posting')
  }, [navigate])

  return (
    <Icon
      className={`PostButton _icon ${className || ''}`}
      iconName="add_notes"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
