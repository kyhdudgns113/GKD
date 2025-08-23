import {useCallback} from 'react'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type SetDirButtonProps = DivCommonProps & {
  dirOId: string
}

export const SetDirButton: FC<SetDirButtonProps> = ({dirOId, className, style, ...props}) => {
  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  return (
    <Icon
      className={`SetDirButton _icon ${dirOId} ${className || ''}`}
      iconName="settings"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
