import {useEffect, useState} from 'react'
import {useDirectoryCallbacksContext, useDirectoryStatesContext} from '@context'
import {NULL_DIR} from '@nullValue'

import {DirectoryInfoGroup, DropSpaceGroup} from '../groupsDir'
import {AddDirectoryModule, AddFileModule} from '../modules'
import {FileRowObject} from '../objects'

import '../_styles/DirectoryRowObject.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {DirectoryType} from '@shareType'

type DirectoryRowObjectProps = DivCommonProps & {
  depth: number
  dirIdx: number
  dirOId: string
  pOId: string // parentDirOId
}

/**
 * dirOId 디렉토리의 정보를 표시한다
 *
 * 1. 폴더 이동용 공간(dirIdx 0 일때)
 * 2. 자신의 정보, 버튼들
 * 3. 자식 디렉토리들(재귀)
 * 4. 자식 폴더 생성 행
 * 5. 자식 파일들
 * 6. 자식 파일 추가 행
 * 7. 폴더 이동용 공간(dirIdx 무관)
 */
export const DirectoryRowObject: FC<DirectoryRowObjectProps> = ({
  depth,
  dirIdx,
  dirOId,
  pOId,
  // ::
  className,
  style,
  ...props
}) => {
  const {directories, dirOId_addDir, dirOId_addFile} = useDirectoryStatesContext()
  const {loadDirectory} = useDirectoryCallbacksContext()

  const [directory, setDirectory] = useState<DirectoryType>(NULL_DIR)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // directory 값 초기화
  useEffect(() => {
    const newDir = directories[dirOId]

    if (newDir) {
      setDirectory(newDir)
    } // ::
    else {
      loadDirectory(dirOId, setDirectory)
    }
  }, [directories, dirOId, loadDirectory])

  return (
    <div
      className={`DirectoryRow_Object ${className || ''}`}
      onDragOver={e => e.preventDefault()}
      style={style}
      {...props} // ::
    >
      {/* 1. 폴더 이동용 공간(dirIdx 0 일때) */}
      {dirIdx === 0 && <DropSpaceGroup pOId={pOId} rowIdx={dirIdx} />}

      {/* 2. 자신의 정보, 버튼들 */}
      <DirectoryInfoGroup directory={directory} dirOId={dirOId} isOpen={isOpen} setIsOpen={setIsOpen} />

      {isOpen && (
        <div onDragOver={e => e.preventDefault()} style={{marginLeft: '8px'}}>
          {/* 3. 자식 디렉토리들(재귀) */}
          {directory.subDirOIdsArr.map((subDirOId, subDirIdx) => (
            <DirectoryRowObject key={subDirIdx} depth={depth + 1} dirIdx={subDirIdx} dirOId={subDirOId} pOId={dirOId} />
          ))}

          {/* 4. 자식 폴더 생성 행 */}
          {dirOId_addDir === dirOId && <AddDirectoryModule dirOId={dirOId} />}

          {/* 5. 자식 파일들 */}
          {directory.fileOIdsArr.map((fileOId, fileIdx) => (
            <FileRowObject key={fileIdx} pOId={dirOId} fileIdx={fileIdx} fileOId={fileOId} />
          ))}

          {/* 6. 자식 파일 추가 행 */}
          {dirOId_addFile === dirOId && <AddFileModule dirOId={dirOId} />}
        </div>
      )}

      {/* 7. 폴더 이동용 공간(dirIdx 무관) */}
      <DropSpaceGroup pOId={pOId} rowIdx={dirIdx + 1} />
    </div>
  )
}
