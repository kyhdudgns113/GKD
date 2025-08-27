import {createContext, useContext, useEffect} from 'react'
import {NULL_DIR} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'

import * as C from '@context'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const DirectoryEffectsContext = createContext<ContextType>({})

export const useDirectoryEffectsContext = () => useContext(DirectoryEffectsContext)

export const DirectoryEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {directories, rootDirOId} = C.useDirectoryStatesContext()
  const {setRootDir} = C.useDirectoryStatesContext()

  const {loadRootDirectory} = C.useDirectoryCallbacksContext()

  // 시작시 루트 디렉토리를 불러온다.
  useEffect(() => {
    loadRootDirectory()
  }, [loadRootDirectory])

  // 루트 디렉토리를 갱신한다.
  useEffect(() => {
    if (rootDirOId) {
      setRootDir(directories[rootDirOId] || NULL_DIR)
    }
  }, [directories, rootDirOId, setRootDir])

  return <DirectoryEffectsContext.Provider value={{}}>{children}</DirectoryEffectsContext.Provider>
}
