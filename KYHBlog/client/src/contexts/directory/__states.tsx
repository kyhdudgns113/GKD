import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'

import * as T from '@type'
import * as ST from '@shareType'

// prettier-ignore
type ContextType = {
  directories: {[dirOId: string]: ST.DirectoryType}, setDirectories: T.Setter<{[dirOId: string]: ST.DirectoryType}>
  fileRows: {[fileOId: string]: ST.FileRowType}, setFileRows: T.Setter<{[fileOId: string]: ST.FileRowType}>
  rootDirOId: string, setRootDirOId: T.Setter<string>
}
// prettier-ignore
export const DirectoryStatesContext = createContext<ContextType>({
  directories: {}, setDirectories: () => {},
  fileRows: {}, setFileRows: () => {},
  rootDirOId: '', setRootDirOId: () => {},
})

export const useDirectoryStatesContext = () => useContext(DirectoryStatesContext)

export const DirectoryStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * directories: 전역적으로 사용하는 디렉토리 정보
   * fileRows: Lefter 등에서 사용하는 File 들의 Row(행) 정보
   */
  const [directories, setDirectories] = useState<{[dirOId: string]: ST.DirectoryType}>({})
  const [fileRows, setFileRows] = useState<{[fileOId: string]: ST.FileRowType}>({})

  const [rootDirOId, setRootDirOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    directories, setDirectories,
    fileRows, setFileRows,
    rootDirOId, setRootDirOId
  }

  return <DirectoryStatesContext.Provider value={value}>{children}</DirectoryStatesContext.Provider>
}
