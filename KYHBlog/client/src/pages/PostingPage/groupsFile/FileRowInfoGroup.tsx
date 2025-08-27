import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'
import {useDirectoryCallbacksContext, useDirectoryStatesContext} from '@context'
import {SetFileButton} from '../buttons'

import type {CSSProperties, DragEvent, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type FileRowInfoGroupProps = DivCommonProps & {
  fileIdx: number
  fileOId: string
  pOId: string // parentDirOId
}

export const FileRowInfoGroup: FC<FileRowInfoGroupProps> = ({
  fileIdx,
  fileOId,
  pOId,
  // ::
  className,
  style,
  ...props
}) => {
  const {fileRows, moveDirOId, moveFileOId} = useDirectoryStatesContext()
  const {moveDirectory, moveFile, selectMoveFile, unselectMoveDirFile} = useDirectoryCallbacksContext()

  const navigate = useNavigate()

  const [isHover, setIsHover] = useState<boolean>(false)

  const styleGroup: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',

    paddingLeft: '4px',
    paddingTop: '3px',
    paddingBottom: '3px'
  }

  // AREA1: Event Listners

  const onClick = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      navigate(`/main/posting/${fileOId}`)
    },
    [navigate]
  )

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(false)
  }, [])

  const onDragStart = useCallback(
    (fileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      selectMoveFile(fileOId)
    },
    [selectMoveFile]
  )

  const onDrop = useCallback(
    (pOId: string, fileIdx: number) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        moveDirectory(pOId, moveDirOId, null)
      } // ::
      else if (moveFileOId) {
        moveFile(pOId, moveFileOId, fileIdx + 1)
      }

      // onDrop 하면 onDragLeave 가 실행되지 않기에 여기서 이걸 해줘야 한다.
      setIsHover(false)
      unselectMoveDirFile()
    },
    [moveDirOId, moveFileOId, moveDirectory, moveFile, unselectMoveDirFile]
  )

  return (
    <div
      className={`FileRowInfo_Group ${className || ''} ${isHover ? ' bg-gkd-sakura-bg-70 ' : 'bg-transparent'}`}
      draggable
      onClick={onClick(fileOId)}
      onDragEnter={onDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDragStart={onDragStart(fileOId)}
      onDrop={onDrop(pOId, fileIdx)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={styleGroup}
      {...props}
    >
      <Icon iconName="article" style={{fontSize: '22px', marginRight: '4px'}} />
      {fileRows[fileOId].fileName}

      {isHover && <SetFileButton fileOId={fileOId} style={{marginLeft: 'auto', marginRight: '4px'}} />}
    </div>
  )
}
