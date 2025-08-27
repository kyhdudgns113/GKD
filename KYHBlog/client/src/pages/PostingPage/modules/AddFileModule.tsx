import {useCallback, useState} from 'react'
import {Input} from '@component'
import {useDirectoryCallbacksContext} from '@context'

import type {ChangeEvent, FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddFileModuleProps = DivCommonProps & {dirOId: string}

/**
 * dirOId 디렉토리에 하위 폴더를 추가하는 컴포넌트
 */
export const AddFileModule: FC<AddFileModuleProps> = ({dirOId, className, style, ...props}) => {
  const {addFile, closeAddDirFileRow} = useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('')

  const onBlur = useCallback(
    (dirOId: string, fileName: string) => () => {
      closeAddDirFileRow()

      if (!fileName.trim()) {
        return
      }

      addFile(dirOId, fileName.trim())
    },
    [addFile, closeAddDirFileRow]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onBlur(dirOId, fileName)()
      }
    },
    [onBlur, dirOId, fileName]
  )

  return (
    <div className={`AddFile_Module _module ${className || ''}`} style={style} {...props}>
      <Input
        autoFocus
        className="_file"
        onBlur={onBlur(dirOId, fileName)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={fileName} // ::
      />
    </div>
  )
}
