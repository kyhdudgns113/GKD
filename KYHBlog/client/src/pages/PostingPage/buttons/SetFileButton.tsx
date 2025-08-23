import {useCallback} from 'react'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type SetFileButtonProps = DivCommonProps & {
  fileOId: string
}

export const SetFileButton: FC<SetFileButtonProps> = ({fileOId, className, style, ...props}) => {
  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  return (
    <Icon
      className={`SetFileButton _icon ${fileOId} ${className || ''}`}
      iconName="settings"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
