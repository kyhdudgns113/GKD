import {useCallback, useState} from 'react'
import {Input} from '@component'
import {useDirectoryCallbacksContext} from '@context'

import type {ChangeEvent, FC, FocusEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddFileModuleProps = DivCommonProps & {dirOId: string}

/**
 * dirOId 디렉토리에 하위 폴더를 추가하는 컴포넌트
 */
export const AddFileModule: FC<AddFileModuleProps> = ({dirOId, className, style, ...props}) => {
  const {addFile, closeAddDirFileRow} = useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('')

  const onBlur = useCallback(
    (dirOId: string, fileName: string) => (e: FocusEvent<HTMLInputElement>) => {
      e.stopPropagation()
      closeAddDirFileRow()

      if (!fileName.trim()) {
        alert(`파일 이름을 입력하세요`)
        return
      }

      if (fileName.length > 20) {
        alert(`파일 이름은 20자 이하로 입력하세요`)
        return
      }

      addFile(dirOId, fileName)
    },
    [addFile, closeAddDirFileRow]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }, [])

  return (
    <div className={`AddFile_Module _module ${className || ''}`} style={style} {...props}>
      <Input autoFocus className="_file" onBlur={onBlur(dirOId, fileName)} onChange={onChange} value={fileName} />
    </div>
  )
}
