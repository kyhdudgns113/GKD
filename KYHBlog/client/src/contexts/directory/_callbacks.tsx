import {createContext, useCallback, useContext} from 'react'

import {get, postWithJwt, putWithJwt} from '@server'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

import * as C from '@context'
import * as HTTP from '@httpType'
import * as ST from '@shareType'
import * as U from '@util'

// prettier-ignore
type ContextType = {

  addDirectory: (parentDirOId: string, dirName: string) => void,
  addFile: (parentDirOId: string, fileName: string) => void,
  loadDirectory: (dirOId: string, setDirectory: Setter<ST.DirectoryType>) => void,
  moveDirectory: (parentDirOId: string, moveDirOId: string, dirIdx: number | null) => void,
  moveFile: (dirOId: string, moveFileOId: string, fileIdx: number | null) => void,

  closeAddDirFileRow: () => void,
  openAddDirectoryRow: (dirOId: string) => void,
  openAddFileRow: (dirOId: string) => void,
  selectMoveDir: (dirOId: string) => void,
  selectMoveFile: (fileOId: string) => void,
  unselectMoveDirFile: () => void,

  loadRootDirectory: () => void
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({

  addDirectory: () => {},
  addFile: () => {},
  loadDirectory: () => {},
  moveDirectory: () => {},
  moveFile: () => {},

  closeAddDirFileRow: () => {},
  openAddDirectoryRow: () => {},
  openAddFileRow: () => {},
  selectMoveDir: () => {},
  selectMoveFile: () => {},
  unselectMoveDirFile: () => {},

  loadRootDirectory: () => {},
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {directories, fileRows} = C.useDirectoryStatesContext()
  const {setDirectories, setDirOId_addDir, setDirOId_addFile, setFileRows, setRootDirOId, setMoveDirOId, setMoveFileOId} =
    C.useDirectoryStatesContext()

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

      // 입력값 검증: 폴더 이름이 들어왔는가
      if (!dirName.trim()) {
        alert(`폴더 이름을 입력하세요`)
        return
      }

      // 입력값 검증: 폴더 이름이 32자 이하인가
      if (dirName.length > 32) {
        alert(`폴더 이름은 32자 이하로 입력하세요`)
        return
      }

      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
          } // ::
          else {
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

      // 입력값 검증: 파일 이름이 들어왔는가
      if (!fileName.trim()) {
        alert(`파일 이름을 입력하세요`)
        return
      }

      // 입력값 검증: 파일 이름이 20자 이하인가
      if (fileName.length > 20) {
        alert(`파일 이름은 20자 이하로 입력하세요`)
        return
      }

      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => U.alertErrors(url, errObj))
    },
    [setExtraDirs, setExtraFileRows]
  )

  const loadDirectory = useCallback(
    (dirOId: string, setDirectory: Setter<ST.DirectoryType>) => {
      const url = `/client/directory/loadDirectory/${dirOId}`
      const NULL_JWT = ''

      get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
            setDirectory(body.extraDirs.directories[dirOId])
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => U.alertErrors(url, errObj))
    },
    [setExtraDirs, setExtraFileRows]
  )

  const moveDirectory = useCallback(
    (parentDirOId: string, moveDirOId: string, dirIdx: number | null) => {
      /**
       * 입력값 검증 1: 같은 위치로 이동하는건 아닌가 확인
       *
       * - 같은 위치로 이동하는 경우를 확인한다.
       * - dirIdx 가 null 로 들어왔는데 같은 위치로 이동하는 경우인것도 고려한다
       * - 에러조차 출력하지 않는다.
       */
      const parentDir = directories[parentDirOId]
      const moveDir = directories[moveDirOId]
      const prevIdx = parentDir.subDirOIdsArr.indexOf(moveDirOId)

      if (moveDir.parentDirOId === parentDirOId) {
        const isSameIdx = dirIdx === prevIdx
        const nullIsSameIdx = dirIdx === null && prevIdx === parentDir.subDirOIdsArr.length - 1

        if (isSameIdx || nullIsSameIdx) {
          return
        }
      }

      /**
       * 입력값 검증 2: 조상이 자손으로 이동을 시도한다면 아무 작업도 하지 않는다.
       *
       * - 조상이 자손으로 이동을 시도한다면 아무 작업도 하지 않는다.
       * - 에러조차 출력하지 않는다.
       */
      let tempDir = parentDir

      while (tempDir.dirOId !== 'NULL' && tempDir.parentDirOId !== 'NULL') {
        if (tempDir.dirOId === moveDirOId) {
          alert(`자손 폴더로는 이동할 수 없습니다.`)
          return
        }

        const nextOId = tempDir.parentDirOId
        const nextDirName = tempDir.dirName
        tempDir = directories[nextOId]

        if (!tempDir) {
          alert(`${nextDirName}의 부모폴더 정보가 없습니다.`)
          return
        }
      }

      /**
       * 클라이언트 작업: 폴더 이동 후 부모 폴더의 자식 폴더 배열 변경
       *
       * 1. 기존 부모 폴더의 자식 폴더 배열에서 움직일 폴더 제거
       * 2. 새 부모 폴더의 자식 폴더 배열에 움직일 폴더 추가
       */

      const oldParentDirOId = moveDir.parentDirOId
      const oldParentDir = directories[oldParentDirOId]

      const newParentDirOId = parentDirOId
      const newParentDir = directories[newParentDirOId]

      // 1. 기존 부모 폴더의 자식 폴더 배열에서 움직일 폴더 제거
      const _oldArr = [...oldParentDir.subDirOIdsArr]
      const oldParentChildArr = _oldArr.filter(dirOId => dirOId !== moveDirOId)

      // 2. 새 부모 폴더의 자식 폴더 배열의 dirIdx 번째에 움직일 폴더 추가
      const _newArr = newParentDir.subDirOIdsArr
      const newParentChildArr = [..._newArr]
      newParentChildArr.splice(dirIdx ?? _newArr.length, 0, moveDirOId)

      /**
       * HTTP 요청
       */
      const url = `/client/directory/moveDirectory`
      const data: HTTP.MoveDirectoryType = {
        moveDirOId,
        oldParentChildArr,
        oldParentDirOId,
        newParentChildArr,
        newParentDirOId
      }

      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => U.alertErrors(url, errObj))
    },
    [directories, setExtraDirs, setExtraFileRows]
  )

  const moveFile = useCallback(
    (dirOId: string, moveFileOId: string, fileIdx: number | null) => {
      // 입력값 검증: 같은 위치로 이동하는건 아닌가 확인
      const parentDir = directories[dirOId]
      const fileRow = fileRows[moveFileOId]

      const prevIdx = parentDir.fileOIdsArr.indexOf(moveFileOId)

      if (fileRow.dirOId === dirOId) {
        const isSameIdx = fileIdx === prevIdx
        const nullIsSameIdx = fileIdx === null && prevIdx === parentDir.fileOIdsArr.length - 1

        if (isSameIdx || nullIsSameIdx) {
          return
        }
      }

      /**
       * 클라이언트 작업: 파일 이동 후 부모 폴더의 자식 파일 배열 변경
       *
       * 1. 기존 부모 폴더의 자식 파일 배열에서 움직일 파일 제거
       * 2. 새 부모 폴더의 자식 파일 배열의 fileIdx 번째에 움직일 파일 추가
       */
      const oldParentDirOId = fileRow.dirOId
      const oldParentDir = directories[oldParentDirOId]

      const newParentDirOId = dirOId
      const newParentDir = directories[newParentDirOId]

      // 1. 기존 부모 폴더의 자식 파일 배열에서 움직일 파일 제거
      const _oldArr = [...oldParentDir.fileOIdsArr]
      const oldParentChildArr = _oldArr.filter(fileOId => fileOId !== moveFileOId)

      // 2. 새 부모 폴더의 자식 파일 배열의 fileIdx 번째에 움직일 파일 추가
      const _newArr = newParentDir.fileOIdsArr
      const newParentChildArr = [..._newArr]
      newParentChildArr.splice(fileIdx ?? _newArr.length, 0, moveFileOId)

      const url = `/client/directory/moveFile`
      const data: HTTP.MoveFileType = {
        moveFileOId,
        oldParentChildArr,
        oldParentDirOId,
        newParentChildArr,
        newParentDirOId
      }

      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => U.alertErrors(url, errObj))
    },
    [directories, fileRows, setExtraDirs, setExtraFileRows]
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

  const selectMoveDir = useCallback(
    (dirOId: string) => {
      setMoveDirOId(dirOId)
      setMoveFileOId('')
    },
    [setMoveDirOId, setMoveFileOId]
  )

  const selectMoveFile = useCallback(
    (fileOId: string) => {
      setMoveDirOId('')
      setMoveFileOId(fileOId)
    },
    [setMoveDirOId, setMoveFileOId]
  )

  const unselectMoveDirFile = useCallback(() => {
    setMoveDirOId('')
    setMoveFileOId('')
  }, [setMoveDirOId, setMoveFileOId])

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

    addDirectory,
    addFile,
    loadDirectory,
    moveDirectory,
    moveFile,

    closeAddDirFileRow,
    openAddDirectoryRow,
    openAddFileRow,
    selectMoveDir,
    selectMoveFile,
    unselectMoveDirFile,

    loadRootDirectory,
  }
  return <DirectoryCallbacksContext.Provider value={value}>{children}</DirectoryCallbacksContext.Provider>
}
