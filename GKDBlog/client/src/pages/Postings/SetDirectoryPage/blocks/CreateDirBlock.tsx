import {useCallback, useState} from 'react'
import {Input} from '../../../../common'
import {useDirectoryStatesContext} from '../../../../contexts/directory/__states'
import {useDirectoryCallbacksContext} from '../../../../contexts/directory/_callbacks'

import type {CSSProperties, FC} from 'react'
import type {InputCommonProps} from '../../../../common'

type CreateDirBlockProps = InputCommonProps & {
  parentDirOId: string
  tabLevel: number
}

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
    if (newDirName.trim() === '') {
      alert('새 폴더 이름은 있어야 됩니다.')
      setParentOIdDir('')
      return
    }
    addDirectory(parentDirOId, newDirName)
  }, [newDirName, parentDirOId, addDirectory, setParentOIdDir])

  return (
    <Input
      className={`CREATE_DIR_BLOCK ${className || ''}`}
      onBlur={onBlur}
      onChange={e => setNewDirName(e.currentTarget.value)}
      style={styleCreateDirBlock}
      value={newDirName}
      {...props}
    />
  )
}
