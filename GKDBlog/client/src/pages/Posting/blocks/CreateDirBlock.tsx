import {useCallback, useEffect, useRef, useState} from 'react'
import {Input} from '@component'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'

import type {CSSProperties, FC, KeyboardEvent} from 'react'
import type {InputCommonProps} from '@prop'

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

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onBlur()
      }
    },
    [onBlur]
  )

  // 자동 포커스
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Input
      className={`CREATE_DIR_BLOCK ${className || ''}`}
      onBlur={onBlur}
      onChange={e => setNewDirName(e.currentTarget.value)}
      onKeyDown={onKeyDown}
      placeholder="새 폴더 이름"
      ref={inputRef}
      style={styleCreateDirBlock}
      value={newDirName}
      {...props}
    />
  )
}
