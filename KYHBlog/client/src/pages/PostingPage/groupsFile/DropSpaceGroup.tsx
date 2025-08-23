import {useCallback, useState} from 'react'
import {useDirectoryCallbacksContext, useDirectoryStatesContext} from '@context'

import type {CSSProperties, DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

type DropSpaceGroupProps = DivCommonProps & {
  rowIdx: number
  pOId: string // parentDirOId
}

export const DropSpaceGroup: FC<DropSpaceGroupProps> = ({
  rowIdx,
  pOId,
  // ::
  className,
  style,
  ...props
}) => {
  const {moveDirOId, moveFileOId} = useDirectoryStatesContext()
  const {moveDirectory, moveFile, unselectMoveDirFile} = useDirectoryCallbacksContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const styleGroup: CSSProperties = {
    height: '6px'
  }

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    /**
     * 파일이던 폴더든 hover 상태로 만든다
     * - 파일을 옮기는 상황이면 당연히 hover 되어 색이 변해야 한다
     * - 폴더를 옮기는 상황에도 어차피 부모 폴더의 맨 마지막으로 이동하기 때문에 hover 상태로 만들어야 한다
     */
    setIsHover(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(false)
  }, [])

  const onDrop = useCallback(
    (parentDirOId: string, rowIdx: number, moveDirOId: string, moveFileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        // 파일에 폴더를 올려놓으면 부모 폴더의 맨 마지막으으로 이동시킨다
        moveDirectory(parentDirOId, moveDirOId, null)
      } // ::
      else if (moveFileOId) {
        moveFile(parentDirOId, moveFileOId, rowIdx)
      }

      // onDrop 하면 onDragLeave 가 실행되지 않기에 여기서 이걸 해줘야 한다.
      setIsHover(false)
      unselectMoveDirFile()
    },
    [moveDirectory, moveFile, unselectMoveDirFile]
  )

  return (
    <div
      className={`DropSpace_Group_File  ${className || ''} ${isHover ? ' bg-gkd-sakura-bg-70 ' : 'bg-transparent'}`}
      onDragEnter={onDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop(pOId, rowIdx, moveDirOId, moveFileOId)}
      style={{...style, ...styleGroup}}
      {...props} // ::
    ></div>
  )
}
