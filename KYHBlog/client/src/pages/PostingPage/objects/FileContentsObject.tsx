import {useCallback} from 'react'
import {useFileCallbacksContext, useFileStatesContext} from '@context'

import '../_styles/EditingFilePart.scss'

import type {ChangeEvent, FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

type FileContentsObjectProps = DivCommonProps

export const FileContentsObject: FC<FileContentsObjectProps> = ({className, style, ...props}) => {
  const {content, fileName, fileOId, setContent} = useFileStatesContext()
  const {editFile} = useFileCallbacksContext()

  const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDownContent = useCallback(
    (content: string, fileName: string, fileOId: string) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault()
        e.stopPropagation()

        editFile(fileOId, fileName, content)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`FileContents_Object ${className || ''}`} style={style} {...props}>
      <textarea
        onChange={onChangeContent}
        onKeyDown={onKeyDownContent(content, fileName, fileOId)}
        value={content} // ::
      />
    </div>
  )
}
