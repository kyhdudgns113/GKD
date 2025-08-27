import {useCallback} from 'react'
import {Icon} from '@component'
import {useDirectoryCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type SetDirButtonProps = DivCommonProps & {
  dirOId: string
}

export const SetDirButton: FC<SetDirButtonProps> = ({dirOId, className, style, ...props}) => {
  const {openEditDirModal} = useDirectoryCallbacksContext()

  const onClickIcon = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      e.preventDefault()
      openEditDirModal(dirOId)
    },
    [openEditDirModal, dirOId]
  )

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
