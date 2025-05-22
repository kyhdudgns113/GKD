import {createContext, useContext, useState} from 'react'
import {NULL_DIR} from '../../common'

import type {FC, PropsWithChildren} from 'react'
import type {DirectoryType, FileRowType, Setter} from '../../common'

// prettier-ignore
type ContextType = {
  directories: {[dirOId: string]: DirectoryType}, setDirectories: Setter<{[dirOId: string]: DirectoryType}>
  fileRows: {[fileOId: string]: FileRowType}, setFileRows: Setter<{[fileOId: string]: FileRowType}>
  isDirOpen: {[dirOId: string]: boolean}, setIsDirOpen: Setter<{[dirOId: string]: boolean}>
  parentOIdDir: string, setParentOIdDir: Setter<string>
  parentOIdFile: string, setParentOIdFile: Setter<string>
  rootDir: DirectoryType, setRootDir: Setter<DirectoryType>,
  rootDirOId: string, setRootDirOId: Setter<string>
}
// prettier-ignore
export const DirectoryStatesContext = createContext<ContextType>({
  directories: {}, setDirectories: () => {},
  fileRows: {}, setFileRows: () => {},
  isDirOpen: {}, setIsDirOpen: () => {},
  parentOIdDir: '', setParentOIdDir: () => {},
  parentOIdFile: '', setParentOIdFile: () => {},
  rootDir: NULL_DIR, setRootDir: () => {},
  rootDirOId: '', setRootDirOId: () => {}
})

export const useDirectoryStatesContext = () => useContext(DirectoryStatesContext)

export const DirectoryStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [directories, setDirectories] = useState<{[dirOId: string]: DirectoryType}>({})
  const [fileRows, setFileRows] = useState<{[fileOId: string]: FileRowType}>({})
  const [isDirOpen, setIsDirOpen] = useState<{[dirOId: string]: boolean}>({})
  const [parentOIdDir, setParentOIdDir] = useState<string>('')
  const [parentOIdFile, setParentOIdFile] = useState<string>('')
  const [rootDir, setRootDir] = useState<DirectoryType>(NULL_DIR)
  const [rootDirOId, setRootDirOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    directories, setDirectories,
    fileRows, setFileRows,
    isDirOpen, setIsDirOpen,
    parentOIdDir, setParentOIdDir,
    parentOIdFile, setParentOIdFile,
    rootDir, setRootDir,
    rootDirOId, setRootDirOId
  }

  return <DirectoryStatesContext.Provider value={value}>{children}</DirectoryStatesContext.Provider>
}
