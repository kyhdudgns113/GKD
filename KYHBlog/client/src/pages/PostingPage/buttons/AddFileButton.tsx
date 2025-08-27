import {useCallback} from 'react'
import {useDirectoryCallbacksContext} from '@context'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddFileButtonProps = DivCommonProps & {dirOId: string}

export const AddFileButton: FC<AddFileButtonProps> = ({dirOId, className, style, ...props}) => {
  const {openAddFileRow} = useDirectoryCallbacksContext()

  const onClickIcon = useCallback(
    (_dirOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      openAddFileRow(_dirOId)
    },
    [openAddFileRow]
  )

  const onMouseDownIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  return (
    <Icon
      className={`AddFileButton _icon ${className || ''}`}
      iconName="post_add"
      onClick={onClickIcon(dirOId)}
      onMouseDown={onMouseDownIcon}
      style={style}
      {...props} // ::
    />
  )
}
