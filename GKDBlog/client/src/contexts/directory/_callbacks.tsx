import {createContext, useCallback, useContext} from 'react'
import {alertErrors, get, postWithJwt, writeJwtFromServer} from '../../common'
import {useDirectoryStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'
import type {ExtraDirObjectType, ExtraFileRowObjectType} from '../../common'

import * as HTTP from '../../common/typesAndValues/httpTypes'

// prettier-ignore
type ContextType = {
  setExtraDirs: (extraDirs: ExtraDirObjectType) => void  
  setExtraFileRows: (extraFileRows: ExtraFileRowObjectType) => void

  addDirectory: (parentDirOId: string, dirName: string) => void
  getDirectoryInfo: (dirOId: string) => void
  onClickCreateDir: (dirOId: string) => () => void
  onClickCreateFile: (dirOId: string) => () => void
  toggleDirInLefter: (dirOId: string) => () => void
  toggleDirInPosting: (dirOId: string) => () => void
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({
  setExtraDirs: () => {},
  setExtraFileRows: () => {},

  addDirectory: () => {},
  getDirectoryInfo: () => {},
  onClickCreateDir: () => () => {},
  onClickCreateFile: () => () => {},
  toggleDirInLefter: () => () => {},
  toggleDirInPosting: () => () => {},
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {
    setDirectories,
    setFileRows,
    setIsDirOpen,
    setIsDirOpenPosting,
    setParentOIdDir,
    setParentOIdFile
  } = useDirectoryStatesContext()

  // AREA1: 공통 함수로도 쓰이는곳
  /**
   * extraDirs 에 있는 정보를 이용하여 해당 directory 만 변경함
   */
  const setExtraDirs = useCallback(
    (extraDirs: ExtraDirObjectType) => {
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
  /**
   * extraFileRows 에 있는 정보를 이용하여 해당 fileRow 만 변경함
   */
  const setExtraFileRows = useCallback(
    (extraFileRows: ExtraFileRowObjectType) => {
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

  // AREA2: export 만 하는 함수들
  const addDirectory = useCallback(
    (parentDirOId: string, dirName: string) => {
      const data: HTTP.AddDirectoryDataType = {dirName, parentDirOId}
      const url = `/client/posting/addDirectory`

      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
            setParentOIdDir('')
            setParentOIdFile('')
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => {
          alertErrors(url + ' CATCH', err)
        })
    },
    [setExtraDirs, setExtraFileRows, setParentOIdDir, setParentOIdFile]
  )
  /**
   * dirOId 에 해당하는 디렉토리 정보를 가져옴
   * -
   */
  const getDirectoryInfo = useCallback(
    (dirOId: string) => {
      const url = `/client/posting/getDirectoryInfo/${dirOId}`
      const jwt = ''
      get(url, jwt)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => {
          alertErrors(url + ' CATCH', err)
        })
    },
    [setExtraDirs, setExtraFileRows]
  )
  /**
   * 폴더 생성 버튼 클릭시 어느 폴더에서 생성하는지 설정
   * @param dirOId 새 폴더를 생성할 폴더의 OId
   */
  const onClickCreateDir = useCallback(
    (dirOId: string) => () => {
      setParentOIdDir(dirOId)
      setParentOIdFile('')
    },
    [setParentOIdDir, setParentOIdFile]
  )
  /**
   * 파일 생성 버튼 클릭시 어느 폴더에서 생성하는지 설정
   * @param dirOId 새 파일을 생성할 폴더의 OId
   */
  const onClickCreateFile = useCallback(
    (dirOId: string) => () => {
      setParentOIdDir(dirOId)
      setParentOIdFile('')
    },
    [setParentOIdDir, setParentOIdFile]
  )
  const toggleDirInLefter = useCallback(
    (dirOId: string) => () => {
      // 1. 해당 폴더 열림상태를 토글한다.
      setIsDirOpen(prev => {
        const newIsDirOpen = {...prev}
        newIsDirOpen[dirOId] = !newIsDirOpen[dirOId]
        return newIsDirOpen
      })
      // 2. 해당 폴더에 포함된 파일 및 폴더들의 정보를 가져온다.
      getDirectoryInfo(dirOId)
    },
    [getDirectoryInfo, setIsDirOpen]
  )
  const toggleDirInPosting = useCallback(
    (dirOId: string) => () => {
      setIsDirOpenPosting(prev => {
        const newIsDirOpenPosting = {...prev}
        newIsDirOpenPosting[dirOId] = !newIsDirOpenPosting[dirOId]
        return newIsDirOpenPosting
      })
    },
    [setIsDirOpenPosting]
  )

  // prettier-ignore
  const value: ContextType = {
    setExtraDirs,
    setExtraFileRows,

    addDirectory,
    getDirectoryInfo,
    onClickCreateDir,
    onClickCreateFile,
    toggleDirInLefter,
    toggleDirInPosting,
  }
  return (
    <DirectoryCallbacksContext.Provider value={value}>
      {children}
    </DirectoryCallbacksContext.Provider>
  )
}
