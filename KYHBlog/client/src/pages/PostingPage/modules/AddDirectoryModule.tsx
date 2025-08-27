import {useCallback, useState} from 'react'
import {Input} from '@component'
import {useDirectoryCallbacksContext} from '@context'

import type {ChangeEvent, FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddDirectoryModuleProps = DivCommonProps & {dirOId: string}

/**
 * dirOId 디렉토리에 하위 폴더를 추가하는 컴포넌트
 */
export const AddDirectoryModule: FC<AddDirectoryModuleProps> = ({dirOId, className, style, ...props}) => {
  const {addDirectory, closeAddDirFileRow} = useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState<string>('')

  const onBlur = useCallback(
    (dirOId: string, dirName: string) => () => {
      closeAddDirFileRow()

      if (!dirName.trim()) {
        return
      }

      addDirectory(dirOId, dirName.trim())
    },
    [addDirectory, closeAddDirFileRow]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDirName(e.target.value)
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onBlur(dirOId, dirName)()
      }
    },
    [onBlur, dirOId, dirName]
  )

  return (
    <div className={`AddDirectory_Module _module ${className || ''}`} style={style} {...props}>
      <Input
        autoFocus
        className="_dir"
        onBlur={onBlur(dirOId, dirName)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={dirName} // ::
      />
    </div>
  )
}
