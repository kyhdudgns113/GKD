import {createContext, useCallback, useContext} from 'react'

import {get} from '@server'

import type {FC, PropsWithChildren} from 'react'

import * as C from '@context'
import * as ST from '@shareType'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  setExtraDirs: (extraDirs: ST.ExtraDirObjectType) => void,
  setExtraFileRows: (extraFileRows: ST.ExtraFileRowObjectType) => void,

  loadRootDirectory: () => void
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({
  setExtraDirs: () => {},
  setExtraFileRows: () => {},

  loadRootDirectory: () => {},
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setDirectories, setFileRows, setRootDirOId} = C.useDirectoryStatesContext()

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

  // AREA2: 외부 사용 함수

  // AREA3: useEffect 용
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

    loadRootDirectory,
  }
  return <DirectoryCallbacksContext.Provider value={value}>{children}</DirectoryCallbacksContext.Provider>
}
