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
  const {addDirectory, closeAddDirFileRow} = useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState<string>('')

  const onBlur = useCallback(
    (dirOId: string, dirName: string) => (e: FocusEvent<HTMLInputElement>) => {
      e.stopPropagation()
      closeAddDirFileRow()

      if (!dirName.trim()) {
        alert(`폴더 이름을 입력하세요`)
        return
      }

      if (dirName.length > 32) {
        alert(`폴더 이름은 32자 이하로 입력하세요`)
        return
      }

      addDirectory(dirOId, dirName)
    },
    [addDirectory, closeAddDirFileRow]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDirName(e.target.value)
  }, [])

  return (
    <div className={`AddDirectory_Module _module ${className || ''}`} style={style} {...props}>
      <Input autoFocus className="_dir" onBlur={onBlur(dirOId, dirName)} onChange={onChange} value={dirName} />
    </div>
  )
}
