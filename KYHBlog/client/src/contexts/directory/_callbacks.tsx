import {createContext, useCallback, useContext} from 'react'

import {get, postWithJwt} from '@server'

import type {FC, PropsWithChildren} from 'react'

import * as C from '@context'
import * as HTTP from '@httpType'
import * as ST from '@shareType'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  setExtraDirs: (extraDirs: ST.ExtraDirObjectType) => void,
  setExtraFileRows: (extraFileRows: ST.ExtraFileRowObjectType) => void,

  addDirectory: (parentDirOId: string, dirName: string) => void,
  addFile: (parentDirOId: string, fileName: string) => void,

  closeAddDirFileRow: () => void,
  openAddDirectoryRow: (dirOId: string) => void,
  openAddFileRow: (dirOId: string) => void,

  loadRootDirectory: () => void
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({
  setExtraDirs: () => {},
  setExtraFileRows: () => {},

  addDirectory: () => {},
  addFile: () => {},

  closeAddDirFileRow: () => {},
  openAddDirectoryRow: () => {},
  openAddFileRow: () => {},

  loadRootDirectory: () => {},
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setDirectories, setDirOId_addDir, setDirOId_addFile, setFileRows, setRootDirOId} = C.useDirectoryStatesContext()

  // AREA1: 공통 함수로도 쓰이는곳
  const setExtraDirs = useCallback(
    (extraDirs: ST.ExtraDirObjectType) => {
      /**
       * extraDirs 에 있는 정보를 이용하여 해당 directory 만 변경함
       */
      setDirectories(prev => {
        const newDirectories = {...prev}
        extraDirs.dirOIdsArr.forEach(dirOId => {
          newDirectories[dirOId] = extraDirs.directories[dirOId]
        })
        return newDirectories
      })
    },
    [setDirectories]
  )

  const setExtraFileRows = useCallback(
    (extraFileRows: ST.ExtraFileRowObjectType) => {
      /**
       * extraFileRows 에 있는 정보를 이용하여 해당 fileRow 만 변경함
       */
      setFileRows(prev => {
        const newFileRows = {...prev}
        extraFileRows.fileOIdsArr.forEach(fileOId => {
          newFileRows[fileOId] = extraFileRows.fileRows[fileOId]
        })
        return newFileRows
      })
    },
    [setFileRows]
  )

  // AREA2: 외부 사용 함수: http 요청
  const addDirectory = useCallback(
    (parentDirOId: string, dirName: string) => {
      const url = `/client/directory/addDirectory`
      const data: HTTP.AddDirectoryType = {
        dirName,
        parentDirOId
      }

      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
          } else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => U.alertErrors(url, errObj))
    },
    [setExtraDirs, setExtraFileRows]
  )

  const addFile = useCallback(
    (dirOId: string, fileName: string) => {
      const url = `/client/directory/addFile`
      const data: HTTP.AddFileType = {
        fileName,
        dirOId
      }

      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
          } else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => U.alertErrors(url, errObj))
    },
    [setExtraDirs, setExtraFileRows]
  )

  // AREA3: 외부 사용 함수
  const closeAddDirFileRow = useCallback(() => {
    setDirOId_addDir('')
    setDirOId_addFile('')
  }, [setDirOId_addDir, setDirOId_addFile])

  const openAddDirectoryRow = useCallback(
    (dirOId: string) => {
      setDirOId_addDir(dirOId)
      setDirOId_addFile('')
    },
    [setDirOId_addDir, setDirOId_addFile]
  )

  const openAddFileRow = useCallback(
    (dirOId: string) => {
      setDirOId_addFile(dirOId)
      setDirOId_addDir('')
    },
    [setDirOId_addFile, setDirOId_addDir]
  )

  // AREA4: useEffect 용
  const loadRootDirectory = useCallback(() => {
    const url = `/client/directory/loadRootDirectory`
    const NULL_JWT = ''

    get(url, NULL_JWT)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        if (ok) {
          setRootDirOId(body.rootDirOId)
          setExtraDirs(body.extraDirs)
          setExtraFileRows(body.extraFileRows)
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
        }
      })
      .catch(errObj => U.alertErrors(url, errObj))
  }, [setRootDirOId, setExtraDirs, setExtraFileRows])

  // prettier-ignore
  const value: ContextType = {
    setExtraDirs,
    setExtraFileRows,

    addDirectory,
    addFile,

    closeAddDirFileRow,
    openAddDirectoryRow,
    openAddFileRow,

    loadRootDirectory,
  }
  return <DirectoryCallbacksContext.Provider value={value}>{children}</DirectoryCallbacksContext.Provider>
}
