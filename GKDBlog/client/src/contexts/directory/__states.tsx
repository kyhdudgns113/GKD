import {createContext, useContext, useState} from 'react'
import {NULL_DIR} from '../../common'

import type {FC, PropsWithChildren} from 'react'
import type {DirectoryType, FileRowType, Setter} from '../../common'

// prettier-ignore
type ContextType = {
  directories: {[dirOId: string]: DirectoryType}, setDirectories: Setter<{[dirOId: string]: DirectoryType}>
  fileRows: {[fileOId: string]: FileRowType}, setFileRows: Setter<{[fileOId: string]: FileRowType}>
  fixDirOId: string, setFixDirOId: Setter<string>
  
  isDirOpen: {[dirOId: string]: boolean}, setIsDirOpen: Setter<{[dirOId: string]: boolean}>
  isDirOpenPosting: {[dirOId: string]: boolean}, setIsDirOpenPosting: Setter<{[dirOId: string]: boolean}>
  parentOIdDir: string, setParentOIdDir: Setter<string>
  parentOIdFile: string, setParentOIdFile: Setter<string>
  rootDir: DirectoryType, setRootDir: Setter<DirectoryType>,
  rootDirOId: string, setRootDirOId: Setter<string>
}
// prettier-ignore
export const DirectoryStatesContext = createContext<ContextType>({
  directories: {}, setDirectories: () => {},
  fileRows: {}, setFileRows: () => {},
  fixDirOId: '', setFixDirOId: () => {},

  isDirOpen: {}, setIsDirOpen: () => {},
  isDirOpenPosting: {}, setIsDirOpenPosting: () => {},
  parentOIdDir: '', setParentOIdDir: () => {},
  parentOIdFile: '', setParentOIdFile: () => {},
  rootDir: NULL_DIR, setRootDir: () => {},
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
   */
  const [fixDirOId, setFixDirOId] = useState<string>('')
  /**
   * isDirOpen: Lefter 에서 폴더 열렸는지 확인할때 사용
   * isDirOpenPosting: 폴더 생성 페이지에서 폴더 열렸는지 확인할때 사용
   */
  const [isDirOpen, setIsDirOpen] = useState<{[dirOId: string]: boolean}>({})
  const [isDirOpenPosting, setIsDirOpenPosting] = useState<{[dirOId: string]: boolean}>({})
  /**
   * parentOIdDir: 폴더 생성할때 부모 폴더의 OId. 폴더 생성 블록에서 사용
   * parentOIdFile: 파일 생성할때 부모 폴더의 OId. 파일 생성 블록에서 사용
   */
  const [parentOIdDir, setParentOIdDir] = useState<string>('')
  const [parentOIdFile, setParentOIdFile] = useState<string>('')
  const [rootDir, setRootDir] = useState<DirectoryType>(NULL_DIR)
  const [rootDirOId, setRootDirOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    directories, setDirectories,
    fileRows, setFileRows,
    fixDirOId, setFixDirOId,

    isDirOpen, setIsDirOpen,
    isDirOpenPosting, setIsDirOpenPosting,
    parentOIdDir, setParentOIdDir,
    parentOIdFile, setParentOIdFile,
    rootDir, setRootDir,
    rootDirOId, setRootDirOId
  }

  return <DirectoryStatesContext.Provider value={value}>{children}</DirectoryStatesContext.Provider>
}
