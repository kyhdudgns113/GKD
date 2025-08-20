import {createContext, useContext, useState} from 'react'
import {NULL_DIR} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'

import * as T from '@type'
import * as ST from '@shareType'

// prettier-ignore
type ContextType = {
  directories: {[dirOId: string]: ST.DirectoryType}, setDirectories: T.Setter<{[dirOId: string]: ST.DirectoryType}>
  dirOId_addDir: string, setDirOId_addDir: T.Setter<string>
  dirOId_addFile: string, setDirOId_addFile: T.Setter<string>

  fileRows: {[fileOId: string]: ST.FileRowType}, setFileRows: T.Setter<{[fileOId: string]: ST.FileRowType}>
  rootDir: ST.DirectoryType, setRootDir: T.Setter<ST.DirectoryType>
  rootDirOId: string, setRootDirOId: T.Setter<string>
}
// prettier-ignore
export const DirectoryStatesContext = createContext<ContextType>({
  directories: {}, setDirectories: () => {},
  dirOId_addDir: '', setDirOId_addDir: () => {},
  dirOId_addFile: '', setDirOId_addFile: () => {},

  fileRows: {}, setFileRows: () => {},
  rootDir: NULL_DIR, setRootDir: () => {},
  rootDirOId: '', setRootDirOId: () => {}
})

export const useDirectoryStatesContext = () => useContext(DirectoryStatesContext)

export const DirectoryStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * directories: 전역적으로 사용하는 디렉토리 정보
   * dirOId_addDir: 자식 폴더를 추가할 디렉토리의 OId
   * dirOId_addFile: 자식 파일을 추가할 디렉토리의 OId
   */
  const [directories, setDirectories] = useState<{[dirOId: string]: ST.DirectoryType}>({})
  const [dirOId_addDir, setDirOId_addDir] = useState<string>('')
  const [dirOId_addFile, setDirOId_addFile] = useState<string>('')
  /**
   * fileRows: Lefter 등에서 사용하는 File 들의 Row(행) 정보
   */
  const [fileRows, setFileRows] = useState<{[fileOId: string]: ST.FileRowType}>({})
  /**
   * rootDir: 루트 디렉토리, useEffect 에서 갱신됨
   * rootDirOId: 루트 디렉토리의 OId, useEffect 에서 갱신됨
   */
  const [rootDir, setRootDir] = useState<ST.DirectoryType>(NULL_DIR)
  const [rootDirOId, setRootDirOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    directories, setDirectories,
    dirOId_addDir, setDirOId_addDir,
    dirOId_addFile, setDirOId_addFile,
    
    fileRows, setFileRows,
    rootDir, setRootDir,
    rootDirOId, setRootDirOId
  }

  return <DirectoryStatesContext.Provider value={value}>{children}</DirectoryStatesContext.Provider>
}
