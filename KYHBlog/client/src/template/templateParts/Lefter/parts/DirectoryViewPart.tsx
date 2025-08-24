import {useDirectoryStatesContext} from '@context'
import {DirectoryRowObject, FileRowObject} from '../objects'

import '../_styles/DirectoryViewPart.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type DirectoryViewPartProps = DivCommonProps & {}

export const DirectoryViewPart: FC<DirectoryViewPartProps> = ({className, style, ...props}) => {
  const {rootDir} = useDirectoryStatesContext()

  return (
    <div className={`DirectoryView_Part ${className || ''}`} style={style} {...props}>
      {/* 1. 폴더 목록 */}
      <div className="Dir_list_container _container">
        {rootDir.subDirOIdsArr.map(dirOId => (
          <DirectoryRowObject key={dirOId} dirOId={dirOId} />
        ))}
      </div>

      {/* 2. 파일 목록 */}
      <div className="File_list_container _container">
        {rootDir.fileOIdsArr.map(fileOId => (
          <FileRowObject key={fileOId} fileOId={fileOId} />
        ))}
      </div>
    </div>
  )
}
