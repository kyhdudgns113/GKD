import {useCallback, useEffect, useRef, useState} from 'react'
import {Input} from '../../../common'
import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {useDirectoryCallbacksContext} from '../../../contexts/directory/_callbacks'

import type {CSSProperties, FC} from 'react'
import type {InputCommonProps} from '../../../common'

type CreateDirBlockProps = InputCommonProps & {
  parentDirOId: string
  tabLevel: number
}

/**
 * 폴더 생성 블록
 */
export const CreateDirBlock: FC<CreateDirBlockProps> = ({
  parentDirOId,
  tabLevel,
  className,
  style,
  ...props
}) => {
  const {setParentOIdDir} = useDirectoryStatesContext()
  const {addDirectory} = useDirectoryCallbacksContext()

  const [newDirName, setNewDirName] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const styleCreateDirBlock: CSSProperties = {
    ...style,
    borderColor: '#000000',
    borderRadius: '4px',
    borderWidth: '2px',

    display: 'flex',
    flexDirection: 'row',
    marginLeft: `${tabLevel * 8}px`
  }

  const onBlur = useCallback(() => {
    if (newDirName.trim() !== '') {
      addDirectory(parentDirOId, newDirName)
    }
    setNewDirName('')
    setParentOIdDir('')
  }, [newDirName, parentDirOId, addDirectory, setParentOIdDir])

  // 자동 포커스
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Input
      className={`CREATE_DIR_BLOCK ${className || ''}`}
      onBlur={onBlur}
      onChange={e => setNewDirName(e.currentTarget.value)}
      ref={inputRef}
      style={styleCreateDirBlock}
      value={newDirName}
      {...props}
    />
  )
}
