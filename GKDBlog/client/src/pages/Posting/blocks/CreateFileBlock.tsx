import {useCallback, useEffect, useRef, useState} from 'react'
import {Input} from '@component'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'

import type {CSSProperties, FC, KeyboardEvent} from 'react'
import type {InputCommonProps} from '@prop'

type CreateFileBlockProps = InputCommonProps & {
  parentDirOId: string
  tabLevel: number
}

/**
 * 파일 생성 블록
 */
export const CreateFileBlock: FC<CreateFileBlockProps> = ({
  parentDirOId,
  tabLevel,
  className,
  style,
  ...props
}) => {
  const {setParentOIdFile} = useDirectoryStatesContext()
  const {addFile} = useDirectoryCallbacksContext()

  const [newFileName, setNewFileName] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const styleCreateFileBlock: CSSProperties = {
    ...style,
    borderColor: '#000000',
    borderRadius: '4px',
    borderWidth: '2px',

    display: 'flex',
    flexDirection: 'row',
    marginLeft: `${tabLevel * 8}px`
  }

  const onBlur = useCallback(() => {
    if (newFileName.trim() !== '') {
      addFile(parentDirOId, newFileName)
    }
    setNewFileName('')
    setParentOIdFile('')
  }, [newFileName, parentDirOId, addFile, setParentOIdFile])
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
      className={`CREATE_FILE_BLOCK ${className || ''}`}
      onBlur={onBlur}
      onChange={e => setNewFileName(e.currentTarget.value)}
      onKeyDown={onKeyDown}
      placeholder="새 파일 이름"
      ref={inputRef}
      style={styleCreateFileBlock}
      value={newFileName}
      {...props}
    />
  )
}
