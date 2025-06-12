import {createContext, useCallback, useContext} from 'react'
import {alertErrors, writeJwtFromServer} from '@util'
import {postWithJwt, delWithJwt, get, putWithJwt} from '@server'

import {useDirectoryStatesContext} from './__states'
import {useModalCallbacksContext} from '../modal/_callbacks'

import type {FC, PropsWithChildren} from 'react'
import type {CallbackType, Setter} from '@type'
import type {ExtraDirObjectType, ExtraFileRowObjectType, FileType} from '@shareType'

import * as HTTP from '@httpType'

// prettier-ignore
type ContextType = {
  setExtraDirs: (extraDirs: ExtraDirObjectType) => void  
  setExtraFileRows: (extraFileRows: ExtraFileRowObjectType) => void

  addDirectory: (parentDirOId: string, dirName: string) => void
  addFile: (parentDirOId: string, fileName: string) => void
  deleteDirectory: (dirOId: string) => void
  deleteFile: (fileOId: string, callback?: () => void) => void
  getDirectoryInfo: (dirOId: string) => void
  getFileInfo: (fileOId: string, setFile: Setter<FileType>, errCallback: CallbackType) => void

  modifyDirName: (dirOId: string, newDirName: string, closeModal: () => void) => void
  moveDirectory: (moveDirOId: string, parentDirOId: string, targetIdx: number | null) => void
  moveFile: (moveFileOId: string, targetDirOId: string, targetIdx: number | null) => void

  onClickCreateDir: (dirOId: string) => () => void
  onClickCreateFile: (dirOId: string) => () => void
  onClickFixDir: (dirOId: string) => () => void 

  onDragEndDirFile: () => void

  selectMoveDir: (dirOId: string) => void
  selectMoveFile: (fileOId: string) => void

  toggleDirInLefter: (dirOId: string, isOpen?: boolean) => () => void
  toggleDirInPosting: (dirOId: string, isOpen?: boolean) => () => void
  updateFileNameContents: (file: FileType) => void
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({
  setExtraDirs: () => {},
  setExtraFileRows: () => {},

  addDirectory: () => {},
  addFile: () => {},
  deleteDirectory: () => {},
  deleteFile: () => {},
  getDirectoryInfo: () => {},
  getFileInfo: () => {},

  modifyDirName: () => {},
  moveDirectory: () => {},
  moveFile: () => {},

  onClickCreateDir: () => () => {},
  onClickCreateFile: () => () => {},
  onClickFixDir: () => () => {},

  onDragEndDirFile: () => {},

  selectMoveDir: () => {},
  selectMoveFile: () => {},

  toggleDirInLefter: () => () => {},
  toggleDirInPosting: () => () => {},
  updateFileNameContents: () => {},
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {openModal} = useModalCallbacksContext()
  const {directories, fileRows} = useDirectoryStatesContext()
  const {
    setDirectories,
    setFileRows,
    setIsDirOpen,
    setIsDirOpenPosting,
    setParentOIdDir,
    setParentOIdFile,
    setFixDirOId,
    setMoveDirOId,
    setMoveFileOId
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
  const addFile = useCallback(
    (parentDirOId: string, fileName: string) => {
      const data: HTTP.AddFileDataType = {fileName, parentDirOId}
      const url = `/client/posting/addFile`

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
  const deleteDirectory = useCallback(
    (dirOId: string) => {
      const url = `/client/posting/deleteDirectory/${dirOId}`
      delWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
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
    [setExtraDirs, setExtraFileRows]
  )
  const deleteFile = useCallback(
    (fileOId: string, callback?: () => void) => {
      const url = `/client/posting/deleteFile/${fileOId}`
      delWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
            writeJwtFromServer(jwtFromServer)
            callback?.()
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
   * 파일의 내용을 불러온다
   * - 제목과 내용등을 전부 포함한 파일의 데이터를 불러온다.
   * - useEffect 에서 호출하므로 setter 를 인자로 받아야 한다.
   * - 파일이 없으면 에러를 받는다.
   *  - 꼭 여기에 있어야만 하는지는 좀 의문이다.
   * errCallback
   * - 파일 이미 삭제됬거나 하면 원래 url 로 돌아가야 한다.
   */
  const getFileInfo = useCallback(
    (fileOId: string, setFile: Setter<FileType>, errCallback: CallbackType) => {
      const url = `/client/posting/getFileInfo/${fileOId}`
      get(url, '')
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
            setFile(body.file)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
            errCallback()
          }
        })
        .catch(err => {
          alertErrors(url + ' CATCH', err)
          errCallback()
        })
    },
    [setExtraDirs, setExtraFileRows]
  )

  /**
   * 얘가 성공하고 closeModal 을 실행해야 한다.
   */
  const modifyDirName = useCallback(
    (dirOId: string, newDirName: string, closeModal: () => void) => {
      const data: HTTP.SetDirNameDataType = {dirOId, newDirName}
      const url = `/client/posting/setDirName`
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
            writeJwtFromServer(jwtFromServer)
            closeModal()
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
  const moveDirectory = useCallback(
    /**
     * 폴더 이동 함수
     * @param moveDirOId 옮길 폴더의 OId, state 관리때문에 인자로 받아온다.
     * @param parentDirOId 옮길 폴더의 부모 폴더의 OId
     * @returns
     */
    (moveDirOId: string, parentDirOId: string, targetIdx: number | null) => {
      /**
       * 에러 검출
       *
       * 1. 자기 자신은 자식으로 삼을 수 없다
       * 2. 조상 폴더를 자식으로 삼을 수도 없다
       *   - 서버와 클라이언트 모두에서 검증한다
       *   - 그래야 충돌을 조금 피할 수 있다
       * 3. 옮기는 폴더가 내 자식폴더랑 이름이 겹치면 안된다
       *   - 이것도 서버, 클라 둘 다 검증한다
       */

      // 1. 자기 자신은 자식으로 삼을 수 없다
      if (moveDirOId === parentDirOId) {
        return
      }

      // 2. 조상 폴더를 자식으로 삼을 수도 없다
      const hereDirectory = directories[parentDirOId]

      let _tempDirOId = parentDirOId
      while (_tempDirOId && _tempDirOId !== 'NULL') {
        const tempDir = directories[_tempDirOId]

        if (!tempDir) break

        if (tempDir.dirOId === moveDirOId) {
          return
        }

        _tempDirOId = tempDir.parentDirOId
      }

      // 3. 옮기는 폴더가 내 자식폴더랑 이름이 겹치면 안된다
      const dirArrLen = hereDirectory.subDirOIdsArr.length

      if (hereDirectory.parentDirOId !== parentDirOId) {
        // 부모 폴더 내에서 이동을 하는 경우면 당연히 겹치는 이름이 있지...
        for (let i = 0; i < dirArrLen; i++) {
          const subDirOId = hereDirectory.subDirOIdsArr[i]
          const subDir = directories[subDirOId]
          // subDir DB 에서 아직 안 읽어왔을수도 있다.
          if (subDir && subDir.dirName === hereDirectory.dirName) {
            return
          }
        }
      }

      // 4. 폴더 이동 실행
      const data: HTTP.MoveDirectoryDataType = {moveDirOId, parentDirOId, targetIdx}
      const url = `/client/posting/moveDirectory`
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
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
    [directories, setExtraDirs, setExtraFileRows]
  )
  const moveFile = useCallback(
    /**
     * 파일 이동 함수
     * @param moveFileOId 옮길 파일의 OId, state 관리때문에 인자로 받아온다.
     * @param targetDirOId 옮길 파일의 목적지 폴더의 OId
     * @param targetIdx 옮길 파일의 목적지 폴더에서의 인덱스, null 이면 맨 뒤로 간다.
     */
    (moveFileOId: string, targetDirOId: string, targetIdx: number | null) => {
      /**
       * 에러 검출
       * Check 1. 입력값 검증
       * Check 2. 이동할 폴더의 자식파일중 이름 중복된거 없나 확인
       */

      // Check 1. 입력값 검증
      if (!moveFileOId) {
        alert(`이동할 파일 입력이 안되었어요`)
        return
      }
      if (!targetDirOId) {
        alert(`이동할 폴더 입력이 안되었어요`)
        return
      }

      const hereFileRow = fileRows[moveFileOId]
      if (!hereFileRow) {
        alert(`이동할 파일이 없어요`)
        return
      }

      // Check 2. 이동할 폴더의 자식파일중 이름 중복된거 없나 확인(서버도 따로 검증한다)
      const targetDir = directories[targetDirOId]

      if (targetDir && targetDir.dirOId !== hereFileRow.parentDirOId) {
        const fileArrLen = targetDir.fileOIdsArr.length
        for (let i = 0; i < fileArrLen; i++) {
          const fileOId = targetDir.fileOIdsArr[i]
          const fileRow = fileRows[fileOId]
          if (fileRow && fileRow.name === hereFileRow.name) {
            alert(`이동할 폴더에 이미 같은 이름의 파일이 있어요`)
            return
          }
        }
      }

      // 파일 이동 실행
      const data: HTTP.MoveFileDataType = {moveFileOId, targetDirOId, targetIdx}
      const url = `/client/posting/moveFile`
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
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
    [directories, fileRows, setExtraDirs, setExtraFileRows]
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
      setParentOIdDir('')
      setParentOIdFile(dirOId)
    },
    [setParentOIdDir, setParentOIdFile]
  )
  const onClickFixDir = useCallback(
    (dirOId: string) => () => {
      setFixDirOId(dirOId)
      openModal('fixDir')
    },
    [openModal, setFixDirOId]
  )

  /**
   * 폴더나 파일을 드래그해서 놓았을 때 움직이는 폴더나 파일의 정보를 초기화한다.
   */
  const onDragEndDirFile = useCallback(() => {
    setMoveDirOId('')
    setMoveFileOId('')
  }, [setMoveDirOId, setMoveFileOId])

  const selectMoveDir = useCallback(
    (dirOId: string) => {
      setMoveDirOId(dirOId)
    },
    [setMoveDirOId]
  )
  const selectMoveFile = useCallback(
    (fileOId: string) => {
      setMoveFileOId(fileOId)
    },
    [setMoveFileOId]
  )

  const toggleDirInLefter = useCallback(
    (dirOId: string, isOpen?: boolean) => () => {
      // 1. 해당 폴더 열림상태를 토글한다.
      setIsDirOpen(prev => {
        const newIsDirOpen = {...prev}
        newIsDirOpen[dirOId] = isOpen ?? !newIsDirOpen[dirOId]
        return newIsDirOpen
      })
      // 2. 해당 폴더에 포함된 파일 및 폴더들의 정보를 가져온다.
      getDirectoryInfo(dirOId)
    },
    [getDirectoryInfo, setIsDirOpen]
  )
  const toggleDirInPosting = useCallback(
    (dirOId: string, isOpen?: boolean) => () => {
      setIsDirOpenPosting(prev => {
        const newIsDirOpenPosting = {...prev}
        newIsDirOpenPosting[dirOId] = isOpen ?? !newIsDirOpenPosting[dirOId]
        return newIsDirOpenPosting
      })
    },
    [setIsDirOpenPosting]
  )
  const updateFileNameContents = useCallback(
    (file: FileType) => {
      const url = `/client/posting/setFileNameAndContents`
      const data: HTTP.SetFileNameContentsDataType = {
        fileOId: file.fileOId,
        name: file.name,
        contentsArr: file.contentsArr
      }
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            alert(`파일 수정이 완료되었어요!`)
            setExtraDirs(body.extraDirs)
            setExtraFileRows(body.extraFileRows)
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
    [setExtraDirs, setExtraFileRows]
  )

  // prettier-ignore
  const value: ContextType = {
    setExtraDirs,
    setExtraFileRows,

    addDirectory,
    addFile,
    deleteDirectory,
    deleteFile,
    getDirectoryInfo,
    getFileInfo,

    modifyDirName,
    moveDirectory,
    moveFile,

    onClickCreateDir,
    onClickCreateFile,
    onClickFixDir,

    onDragEndDirFile,

    selectMoveDir,
    selectMoveFile,

    toggleDirInLefter,
    toggleDirInPosting,
    updateFileNameContents
  }
  return (
    <DirectoryCallbacksContext.Provider value={value}>
      {children}
    </DirectoryCallbacksContext.Provider>
  )
}
