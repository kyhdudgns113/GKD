import {useCallback} from 'react'
import {useFileStatesContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type DeleteFileButtonProps = ButtonCommonProps & {}

export const DeleteFileButton: FC<DeleteFileButtonProps> = ({className, style, ...props}) => {
  const {setIsDelete} = useFileStatesContext()

  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDelete(true)
    },
    [setIsDelete]
  )

  return (
    <button
      className={`DeleteFileButton ${className || ''}`}
      onClick={onClick}
      style={style}
      {...props} // ::
    >
      삭제
    </button>
  )
}
