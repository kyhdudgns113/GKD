import {useCallback} from 'react'
import {useDirectoryCallbacksContext, useDirectoryStatesContext} from '@context'
import {AddDirectoryModule, AddFileModule} from '../modules'
import {DirectoryRowObject, FileRowObject, HeaderRowObject} from '../objects'

import '../_styles/ManageDirectoryPart.scss'

import type {DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

type ManageDirectoryPartProps = DivCommonProps & {}

/**
 * Posting 페이지에서 폴더 및 파일을 관리하는 컴포넌트
 *
 * 1. 헤더 버튼 행
 * 2. 루트 디렉토리의 하위 디렉토리들
 * 3. 루트 디렉토리의 하위 폴더 생성 행
 * 4. 루트 디렉토리의 하위 파일들
 * 5. 루트 디렉토리의 하위 파일 추가 행
 */
export const ManageDirectoryPart: FC<ManageDirectoryPartProps> = ({className, style, ...props}) => {
  const {dirOId_addDir, dirOId_addFile, moveDirOId, moveFileOId, rootDir, rootDirOId} = useDirectoryStatesContext()
  const {moveDirectory, moveFile, unselectMoveDirFile} = useDirectoryCallbacksContext()

  const onDrop = useCallback(
    (rootDirOId: string, moveDirOId: string, moveFileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        moveDirectory(rootDirOId, moveDirOId, null)
      } // ::
      else if (moveFileOId) {
        moveFile(rootDirOId, moveFileOId, null)
      }

      unselectMoveDirFile()
    },
    [moveDirectory, moveFile, unselectMoveDirFile]
  )

  return (
    <div
      className={`ManageDirectory_Part ${className || ''}`}
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop(rootDirOId, moveDirOId, moveFileOId)}
      style={style}
      {...props} // ::
    >
      {/* 1. 헤더 버튼 행 */}
      <HeaderRowObject />

      {/* 2. 루트 디렉토리의 하위 디렉토리들 */}
      {rootDir.subDirOIdsArr.map((dirOId, dirIdx) => (
        <DirectoryRowObject key={dirIdx} depth={0} dirIdx={dirIdx} dirOId={dirOId} pOId={rootDirOId} />
      ))}

      {/* 3. 루트 디렉토리의 하위 폴더 생성 행 */}
      {dirOId_addDir === rootDirOId && <AddDirectoryModule dirOId={rootDirOId} />}

      {/* 4. 루트 디렉토리의 하위 파일들 */}
      {rootDir.fileOIdsArr.map((fileOId, fileIdx) => (
        <FileRowObject key={fileIdx} pOId={rootDirOId} fileIdx={fileIdx} fileOId={fileOId} />
      ))}

      {/* 5. 루트 디렉토리의 하위 파일 추가 행 */}
      {dirOId_addFile === rootDirOId && <AddFileModule dirOId={rootDirOId} />}
    </div>
  )
}
