import {useCallback} from 'react'
import {Icon} from '@component'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RefreshButtonProps = DivCommonProps & {}

export const RefreshButton: FC<RefreshButtonProps> = ({className, style, ...props}) => {
  const onClickIcon = useCallback(() => {
    alert('아직 구현이 안되었어요')
  }, [])
  return (
    <Icon
      className={`RefreshButton _icon ${className || ''}`}
      iconName="refresh"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
