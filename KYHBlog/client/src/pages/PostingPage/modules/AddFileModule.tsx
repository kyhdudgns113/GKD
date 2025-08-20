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
  const {closeAddDirFileRow} = useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('')

  const onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      e.stopPropagation()

      if (e.currentTarget.value.trim()) {
        alert(`${dirOId} 디렉토리에 ${fileName} 파일을 추가해야 합니다.`)
      }

      closeAddDirFileRow()
    },
    [dirOId, fileName, closeAddDirFileRow]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }, [])

  return (
    <div className={`AddFile_Module _module ${className || ''}`} style={style} {...props}>
      <Input autoFocus className="_file" onBlur={onBlur} onChange={onChange} value={fileName} />
    </div>
  )
}
