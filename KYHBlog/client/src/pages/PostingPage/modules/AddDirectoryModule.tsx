import {useCallback, useState} from 'react'
import {Input} from '@component'
import {useDirectoryCallbacksContext} from '@context'

import type {ChangeEvent, FC, FocusEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddDirectoryModuleProps = DivCommonProps & {dirOId: string}

/**
 * dirOId 디렉토리에 하위 폴더를 추가하는 컴포넌트
 */
export const AddDirectoryModule: FC<AddDirectoryModuleProps> = ({dirOId, className, style, ...props}) => {
  const {closeAddDirFileRow} = useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState<string>('')

  const onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      e.stopPropagation()

      if (e.currentTarget.value.trim()) {
        alert(`${dirOId} 디렉토리에 ${dirName} 폴더를 추가해야 합니다.`)
      }

      closeAddDirFileRow()
    },
    [dirOId, dirName, closeAddDirFileRow]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDirName(e.target.value)
  }, [])

  return (
    <div className={`AddDirectory_Module _module ${className || ''}`} style={style} {...props}>
      <Input autoFocus className="_dir" onBlur={onBlur} onChange={onChange} value={dirName} />
    </div>
  )
}
