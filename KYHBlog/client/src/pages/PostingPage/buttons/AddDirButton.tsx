import {useCallback} from 'react'
import {useDirectoryCallbacksContext} from '@context'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddDirButtonProps = DivCommonProps & {dirOId: string}

export const AddDirButton: FC<AddDirButtonProps> = ({dirOId, className, style, ...props}) => {
  const {openAddDirectoryRow} = useDirectoryCallbacksContext()

  const onClickIcon = useCallback(
    (_dirOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      openAddDirectoryRow(_dirOId)
    },
    [openAddDirectoryRow]
  )

  return (
    <Icon
      className={`AddDirButton _icon ${className || ''}`}
      iconName="create_new_folder"
      onClick={onClickIcon(dirOId)}
      style={style}
      {...props} // ::
    />
  )
}
