import {useEffect, useState} from 'react'
import {useDirectoryCallbacksContext, useDirectoryStatesContext} from '@context'
import {NULL_DIR} from '@nullValue'
import {DirInfoGroup} from '../groups'
import {FileRowObject} from './FileRowObject'

import '../_styles/DirectoryViewPart.scss'

import * as ST from '@shareType'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type DirectoryRowObjectProps = DivCommonProps & {dirOId: string}

export const DirectoryRowObject: FC<DirectoryRowObjectProps> = ({dirOId, className, style, ...props}) => {
  const {directories} = useDirectoryStatesContext()
  const {loadDirectory} = useDirectoryCallbacksContext()

  const [directory, setDirectory] = useState<ST.DirectoryType>(NULL_DIR)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // 초기화: directory
  useEffect(() => {
    if (directories[dirOId]) {
      setDirectory(directories[dirOId])
    } // ::
    else {
      loadDirectory(dirOId, setDirectory)
    }
  }, [dirOId, directories, loadDirectory])

  return (
    <div className={`DirectoryRow_Object _object ${dirOId} ${className || ''}`} style={style} {...props}>
      {/* 1. 본인 정보 행 */}
      <DirInfoGroup dirName={directory.dirName} isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* 2. 자식 폴더 목록 */}
      {isOpen && (
        <div className="Dir_list_container _inner_container">
          {directory.subDirOIdsArr.map(subDirOId => (
            <DirectoryRowObject key={subDirOId} dirOId={subDirOId} />
          ))}
        </div>
      )}

      {/* 3. 자식 파일 목록 */}
      {isOpen && (
        <div className="File_list_container _inner_container">
          {directory.fileOIdsArr.map(fileOId => (
            <FileRowObject key={fileOId} fileOId={fileOId} />
          ))}
        </div>
      )}
    </div>
  )
}
