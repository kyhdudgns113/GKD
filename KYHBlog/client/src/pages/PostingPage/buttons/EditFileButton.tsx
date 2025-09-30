import {useCallback} from 'react'
import {useFileCallbacksContext, useFileStatesContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type EditFileButtonProps = ButtonCommonProps & {}

export const EditFileButton: FC<EditFileButtonProps> = ({className, style, ...props}) => {
  const {content, fileName, fileOId} = useFileStatesContext()
  const {editFile} = useFileCallbacksContext()

  const onClick = useCallback(
    (content: string, fileName: string, fileOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      editFile(fileOId, fileName, content)
    },
    [editFile]
  )

  return (
    <button
      className={`EditFileButton ${className || ''}`}
      onClick={onClick(content, fileName, fileOId)}
      style={style}
      {...props} // ::
    >
      수정
    </button>
  )
}
