import {createContext, useCallback, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {get, postWithJwt, putWithJwt} from '@server'
import {useDirectoryStatesContext} from '@context'
import {useFileStatesContext} from './__states'

import * as HTTP from '@httpType'
import * as U from '@util'
import * as ST from '@shareType'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  addComment: (userOId: string, userName: string, fileOId: string, comment: string) => Promise<void>,
  editFile: (fileOId: string, fileName: string, content: string) => void,
  loadComments: (fileOId: string, pageIdx: number) => void,
  loadFile: (fileOId: string) => void,

  selectFileUser: () => void
  unselectFileUser: () => void
}
// prettier-ignore
export const FileCallbacksContext = createContext<ContextType>({
  addComment: () => Promise.resolve(),
  editFile: () => {},
  loadComments: () => {},
  loadFile: () => {},

  selectFileUser: () => {},
  unselectFileUser: () => {}
})

export const useFileCallbacksContext = () => useContext(FileCallbacksContext)

export const FileCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setDirectories, setFileRows} = useDirectoryStatesContext()
  const {setCommentArr, setEntireCommentLen, setFile, setFileUser, setIsFileUserSelected} = useFileStatesContext()

  const navigate = useNavigate()

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
    [] // eslint-disable-line react-hooks/exhaustive-deps
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
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // AREA2: 외부 사용 함수: http 요청

  const addComment = useCallback(async (userOId: string, userName: string, fileOId: string, content: string) => {
    const url = `/client/file/addComment`
    const data: HTTP.AddCommentType = {userOId, userName, fileOId, content}

    return postWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          alert(`댓글 작성이 완료되었습니다`)
          setCommentArr(body.commentArr)
          setEntireCommentLen(body.entireCommentLen)
          U.writeJwtFromServer(jwtFromServer)
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const editFile = useCallback(
    (fileOId: string, fileName: string, content: string) => {
      const url = `/client/file/editFile`
      const data: HTTP.EditFileType = {fileOId, fileName, content}

      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            const {extraDirs, extraFileRows} = body
            setExtraDirs(extraDirs)
            setExtraFileRows(extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            alert(`파일 수정이 완료되었습니다`)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const loadComments = useCallback(
    (fileOId: string, pageIdx: number) => {
      const url = `/client/file/loadComments/${fileOId}/${pageIdx}`
      const NULL_JWT = ''

      get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setCommentArr(body.commentArr)
            setEntireCommentLen(body.entireCommentLen)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const loadFile = useCallback(
    (fileOId: string) => {
      const url = `/client/file/loadFile/${fileOId}`
      const NULL_JWT = ''

      get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setFile(body.file)
            setFileUser(body.user)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            navigate(-1)
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          navigate(-1)
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // AREA3: 외부 사용 함수: http 아님

  const selectFileUser = useCallback(() => {
    setIsFileUserSelected(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectFileUser = useCallback(() => {
    setIsFileUserSelected(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    addComment,
    editFile,
    loadComments,
    loadFile,

    selectFileUser,
    unselectFileUser
  }
  return <FileCallbacksContext.Provider value={value}>{children}</FileCallbacksContext.Provider>
}
