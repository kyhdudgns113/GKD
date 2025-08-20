import {useDirectoryStatesContext} from '@context'
import {AddDirectoryModule, AddFileModule} from '../modules'
import {DirectoryRowObject, HeaderRowObject} from '../objects'

import '../_styles/ManageDirectoryPart.scss'

import type {FC} from 'react'
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
  const {directories, dirOId_addDir, dirOId_addFile, rootDir, rootDirOId} = useDirectoryStatesContext() // eslint-disable-line

  return (
    <div className={`ManageDirectory_Part ${className || ''}`} style={style} {...props}>
      {/* 1. 헤더 버튼 행 */}
      <HeaderRowObject />

      {/* 2. 루트 디렉토리의 하위 디렉토리들 */}
      {rootDir.subDirOIdsArr.map((dirOId, dirIdx) => (
        <DirectoryRowObject key={dirIdx} depth={0} dirIdx={dirIdx} dirOId={dirOId} />
      ))}

      {/* 3. 루트 디렉토리의 하위 폴더 생성 행 */}
      {dirOId_addDir === rootDirOId && <AddDirectoryModule dirOId={rootDirOId} />}

      {/* 4. 루트 디렉토리의 하위 파일들 */}

      {/* 5. 루트 디렉토리의 하위 파일 추가 행 */}
      {dirOId_addFile === rootDirOId && <AddFileModule dirOId={rootDirOId} />}
    </div>
  )
}
