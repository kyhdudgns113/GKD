import '../_styles/FileRowObject.scss'

import {DropSpaceGroup, FileRowInfoGroup} from '../groupsFile'

import type {DivCommonProps} from '@prop'
import type {FC} from 'react'

type FileRowObjectProps = DivCommonProps & {
  fileIdx: number
  fileOId: string
  pOId: string // parentDirOId
}

/**
 * 파일 및 폴더 관리 컴포넌트에서 파일행 정보를 나타내는 컴포넌트
 *
 * 1. 파일 이동용 공간(fileIdx 0 일때)
 * 2. 자신의 정보, 버튼들
 * 3. 파일 이동용 공간(fileIdx 무관)
 */
export const FileRowObject: FC<FileRowObjectProps> = ({
  fileIdx,
  fileOId,
  pOId,
  // ::
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={`FileRow_Object ${className || ''}`}
      onDragOver={e => e.preventDefault()}
      style={style}
      {...props} // ::
    >
      {/* 1. 파일 이동용 공간(fileIdx 0 일때) */}
      {fileIdx === 0 && <DropSpaceGroup pOId={pOId} rowIdx={fileIdx} />}

      {/* 2. 자신의 정보, 버튼들 */}
      <FileRowInfoGroup fileIdx={fileIdx} fileOId={fileOId} pOId={pOId} />

      {/* 3. 파일 이동용 공간(fileIdx 무관) */}
      <DropSpaceGroup pOId={pOId} rowIdx={fileIdx + 1} />
    </div>
  )
}
