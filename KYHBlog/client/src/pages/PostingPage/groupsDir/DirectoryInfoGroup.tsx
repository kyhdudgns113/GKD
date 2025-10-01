import {useCallback, useState} from 'react'
import {useDirectoryCallbacksContext, useDirectoryStatesContext} from '@context'

import type {CSSProperties, DragEvent, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {DirectoryType} from '@shareType'
import type {Setter} from '@type'
import {Icon} from '@commons/components'
import {AddDirButton, AddFileButton, SetDirButton} from '../buttons'

type DirectoryInfoGroupProps = DivCommonProps & {
  directory: DirectoryType
  dirOId: string
  isOpen: boolean
  setIsOpen: Setter<boolean>
}

export const DirectoryInfoGroup: FC<DirectoryInfoGroupProps> = ({
  directory,
  dirOId,
  isOpen,
  setIsOpen,
  // ::
  className,
  style,
  ...props
}) => {
  const {moveDirOId, moveFileOId} = useDirectoryStatesContext()
  const {moveDirectory, moveFile, selectMoveDir, unselectMoveDirFile} = useDirectoryCallbacksContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const styleGroup: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 700,

    paddingRight: '4px'
  }

  // AREA1: Event Listners

  const onClickToggle = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      e.preventDefault()
      setIsOpen(prev => !prev)
    },
    [setIsOpen]
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
    (dirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      selectMoveDir(dirOId)
    },
    [selectMoveDir]
  )

  const onDrop = useCallback(
    (dirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        moveDirectory(dirOId, moveDirOId, null)
      } // ::
      else if (moveFileOId) {
        moveFile(dirOId, moveFileOId, null)
      }
      unselectMoveDirFile()

      // onDrop 하면 onDragLeave 가 실행되지 않기에 여기서 이걸 해줘야 한다.
      setIsHover(false)
    },
    [moveDirOId, moveFileOId, moveDirectory, moveFile, unselectMoveDirFile]
  )

  return (
    <div
      className={`DirectoryInfo_Group ${className || ''} ${isHover ? ' bg-gkd-sakura-bg-70 ' : 'bg-transparent'}`}
      draggable
      onClick={onClickToggle}
      onDragEnter={onDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDragStart={onDragStart(dirOId)}
      onDrop={onDrop(dirOId)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={styleGroup}
      {...props}
    >
      {isOpen && <Icon draggable={false} iconName="arrow_drop_down" style={{fontSize: '30px'}} />}
      {!isOpen && <Icon draggable={false} iconName="arrow_right" style={{fontSize: '30px'}} />}

      {directory?.dirName || '???'}

      {` ${directory?.subDirOIdsArr?.length ?? ' XX'}`}

      {isHover && isOpen && (
        <>
          <AddDirButton className="_icon_row" dirOId={dirOId} style={{marginLeft: 'auto'}} />
          <AddFileButton className="_icon_row" dirOId={dirOId} style={{marginLeft: '4px'}} />
          <SetDirButton className="_icon_row" dirOId={dirOId} style={{marginLeft: '4px'}} />
        </>
      )}
    </div>
  )
}
