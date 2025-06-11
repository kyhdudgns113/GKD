import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {DirectoryType, FileRowType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  directories: {[dirOId: string]: DirectoryType}, setDirectories: Setter<{[dirOId: string]: DirectoryType}>
  fileRows: {[fileOId: string]: FileRowType}, setFileRows: Setter<{[fileOId: string]: FileRowType}>
  fixDirOId: string, setFixDirOId: Setter<string>
  fixFileOId: string, setFixFileOId: Setter<string>

  isDirOpen: {[dirOId: string]: boolean}, setIsDirOpen: Setter<{[dirOId: string]: boolean}>
  isDirOpenPosting: {[dirOId: string]: boolean}, setIsDirOpenPosting: Setter<{[dirOId: string]: boolean}>

  moveDirOId: string, setMoveDirOId: Setter<string>
  moveFileOId: string, setMoveFileOId: Setter<string>

  parentOIdDir: string, setParentOIdDir: Setter<string>
  parentOIdFile: string, setParentOIdFile: Setter<string>
  
  rootDirOId: string, setRootDirOId: Setter<string>
}
// prettier-ignore
export const DirectoryStatesContext = createContext<ContextType>({
  directories: {}, setDirectories: () => {},
  fileRows: {}, setFileRows: () => {},
  fixDirOId: '', setFixDirOId: () => {},
  fixFileOId: '', setFixFileOId: () => {},
  
  isDirOpen: {}, setIsDirOpen: () => {},
  isDirOpenPosting: {}, setIsDirOpenPosting: () => {},

  moveDirOId: '', setMoveDirOId: () => {},
  moveFileOId: '', setMoveFileOId: () => {},

  parentOIdDir: '', setParentOIdDir: () => {},
  parentOIdFile: '', setParentOIdFile: () => {},

  rootDirOId: '', setRootDirOId: () => {}
})

export const useDirectoryStatesContext = () => useContext(DirectoryStatesContext)

export const DirectoryStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * directories: 전역적으로 사용하는 디렉토리 정보
   * fileRows: Lefter 등에서 사용하는 File 들의 Row(행) 정보
   */
  const [directories, setDirectories] = useState<{[dirOId: string]: DirectoryType}>({})
  const [fileRows, setFileRows] = useState<{[fileOId: string]: FileRowType}>({})
  /**
   * fixDirOId: 폴더 수정시 수정할 폴더의 OId
   * fixFileOId: 파일 수정시 수정할 파일의 OId
   */
  const [fixDirOId, setFixDirOId] = useState<string>('')
  const [fixFileOId, setFixFileOId] = useState<string>('')
  /**
   * isDirOpen: Lefter 에서 폴더 열렸는지 확인할때 사용
   * isDirOpenPosting: 폴더 생성 페이지에서 폴더 열렸는지 확인할때 사용
   */
  const [isDirOpen, setIsDirOpen] = useState<{[dirOId: string]: boolean}>({})
  const [isDirOpenPosting, setIsDirOpenPosting] = useState<{[dirOId: string]: boolean}>({})
  /**
   * moveDirOId: 위치를 바꿀 폴더의 OId
   * moveFileOId: 위치를 바꿀 파일의 OId
   */
  const [moveDirOId, setMoveDirOId] = useState<string>('')
  const [moveFileOId, setMoveFileOId] = useState<string>('')
  /**
   * parentOIdDir: 폴더 생성할때 부모 폴더의 OId. 폴더 생성 블록에서 사용
   * parentOIdFile: 파일 생성할때 부모 폴더의 OId. 파일 생성 블록에서 사용
   */
  const [parentOIdDir, setParentOIdDir] = useState<string>('')
  const [parentOIdFile, setParentOIdFile] = useState<string>('')
  const [rootDirOId, setRootDirOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    directories, setDirectories,
    fileRows, setFileRows,
    fixDirOId, setFixDirOId,
    fixFileOId, setFixFileOId,

    isDirOpen, setIsDirOpen,
    isDirOpenPosting, setIsDirOpenPosting,

    moveDirOId, setMoveDirOId,
    moveFileOId, setMoveFileOId,

    parentOIdDir, setParentOIdDir,
    parentOIdFile, setParentOIdFile,

    rootDirOId, setRootDirOId
  }

  return <DirectoryStatesContext.Provider value={value}>{children}</DirectoryStatesContext.Provider>
}
