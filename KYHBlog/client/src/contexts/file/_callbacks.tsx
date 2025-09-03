import {createContext, useCallback, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {delWithJwt, get, postWithJwt, putWithJwt} from '@server'
import {useDirectoryStatesContext} from '@context'
import {useFileStatesContext} from './__states'

import * as HTTP from '@httpType'
import * as U from '@util'
import * as ST from '@shareType'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  addComment: (userOId: string, userName: string, fileOId: string, comment: string) => Promise<void>,
  addReply: (userOId: string, userName: string, targetUserOId: string, targetUserName: string, commentOId: string, content: string) => Promise<boolean>,
  deleteComment: (commentOId: string) => Promise<void>,
  deleteReply: (replyOId: string) => Promise<void>,
  editComment: (commentOId: string, newContent: string) => Promise<boolean>,
  editFile: (fileOId: string, fileName: string, content: string) => void,
  editFileStatus: (fileOId: string, newFileStatus: number) => Promise<boolean>,
  editReply: (replyOId: string, newContent: string) => Promise<boolean>,
  loadComments: (fileOId: string) => void,
  loadFile: (fileOId: string) => void,
  loadNoticeFile: () => void,

  selectDeleteComment: (commentOId: string) => void
  selectDeleteReply: (replyOId: string) => void
  selectEditComment: (commentOId: string) => void
  selectEditReply: (replyOId: string) => void
  selectFileUser: () => void
  selectReplyComment: (commentOId: string) => void
  selectReplyReply: (replyOId: string) => void

  unselectDeleteComment: () => void
  unselectDeleteReply: () => void
  unselectEditComment: () => void
  unselectEditReply: () => void
  unselectFileUser: () => void
  unselectReplyComment: () => void
  unselectReplyReply: () => void
}
// prettier-ignore
export const FileCallbacksContext = createContext<ContextType>({
  addComment: () => Promise.resolve(),
  addReply: () => Promise.resolve(false),
  deleteComment: () => Promise.resolve(),
  deleteReply: () => Promise.resolve(),
  editComment: () => Promise.resolve(false),
  editFile: () => {},
  editFileStatus: () => Promise.resolve(false),
  editReply: () => Promise.resolve(false),
  loadComments: () => {},
  loadFile: () => {},
  loadNoticeFile: () => {},

  selectDeleteComment: () => {},
  selectDeleteReply: () => {},
  selectEditComment: () => {},
  selectEditReply: () => {},
  selectFileUser: () => {},
  selectReplyComment: () => {},
  selectReplyReply: () => {},

  unselectDeleteComment: () => {},
  unselectDeleteReply: () => {},
  unselectEditComment: () => {},
  unselectEditReply: () => {},
  unselectFileUser: () => {},
  unselectReplyComment: () => {},
  unselectReplyReply: () => {}
})

export const useFileCallbacksContext = () => useContext(FileCallbacksContext)

export const FileCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setDirectories, setFileRows} = useDirectoryStatesContext()
  const {
    setCommentReplyArr,
    setCommentOId_delete,
    setCommentOId_edit,
    setCommentOId_reply,
    setEntireCommentReplyLen,
    setFile,
    setFileOId,
    setFileUser,
    setIsFileUserSelected,
    setReplyOId_delete,
    setReplyOId_edit,
    setReplyOId_reply
  } = useFileStatesContext()

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
          setCommentReplyArr(body.commentReplyArr)
          setEntireCommentReplyLen(body.entireCommentReplyLen)
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

  const addReply = useCallback(
    async (userOId: string, userName: string, targetUserOId: string, targetUserName: string, commentOId: string, content: string) => {
      const url = `/client/file/addReply`
      const data: HTTP.AddReplyType = {userOId, userName, targetUserOId, targetUserName, commentOId, content}

      return postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            setCommentReplyArr(body.commentReplyArr)
            setEntireCommentReplyLen(body.entireCommentReplyLen)
            U.writeJwtFromServer(jwtFromServer)
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const deleteComment = useCallback(async (commentOId: string) => {
    const url = `/client/file/deleteComment/${commentOId}`

    return delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          alert(`댓글 삭제가 완료되었습니다`)
          setCommentReplyArr(body.commentReplyArr)
          setEntireCommentReplyLen(body.entireCommentReplyLen)
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

  const deleteReply = useCallback(async (replyOId: string) => {
    const url = `/client/file/deleteReply/${replyOId}`

    return delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          alert(`대댓글 삭제가 완료되었습니다`)
          setCommentReplyArr(body.commentReplyArr)
          setEntireCommentReplyLen(body.entireCommentReplyLen)
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

  const editComment = useCallback(async (commentOId: string, newContent: string) => {
    const url = `/client/file/editComment`
    const data: HTTP.EditCommentType = {commentOId, newContent}

    return putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setCommentReplyArr(body.commentReplyArr)
          setEntireCommentReplyLen(body.entireCommentReplyLen)
          U.writeJwtFromServer(jwtFromServer)
          return true
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return false
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return false
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

  const editFileStatus = useCallback(async (fileOId: string, newFileStatus: number) => {
    const url = `/client/file/editFileStatus`
    const data: HTTP.EditFileStatusType = {fileOId, newFileStatus}

    return putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setExtraDirs(body.extraDirs)
          setExtraFileRows(body.extraFileRows)
          setFile(body.file)
          U.writeJwtFromServer(jwtFromServer)
          return true
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return false
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return false
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const editReply = useCallback(async (replyOId: string, newContent: string) => {
    const url = `/client/file/editReply`
    const data: HTTP.EditReplyType = {replyOId, newContent}

    return putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setCommentReplyArr(body.commentReplyArr)
          setEntireCommentReplyLen(body.entireCommentReplyLen)
          U.writeJwtFromServer(jwtFromServer)
          return true
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return false
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return false
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadComments = useCallback(
    (fileOId: string) => {
      const url = `/client/file/loadComments/${fileOId}`
      const NULL_JWT = ''

      get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setCommentReplyArr(body.commentReplyArr)
            setEntireCommentReplyLen(body.entireCommentReplyLen)
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

  const loadNoticeFile = useCallback(
    () => {
      const url = `/client/file/loadNoticeFile`
      const NULL_JWT = ''

      get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setFile(body.file)
            setFileOId(body.file.fileOId) // 이거 안해주면 file useEffect 때문에 에러난다
            setFileUser(body.user)
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

  // AREA3: 외부 사용 함수: http 아님

  const selectDeleteComment = useCallback(
    (commentOId: string) => {
      setCommentOId_delete(commentOId)
      setCommentOId_edit('')
      setCommentOId_reply('')
      setReplyOId_delete('')
      setReplyOId_edit('')
      setReplyOId_reply('')
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const selectDeleteReply = useCallback(
    (replyOId: string) => {
      setCommentOId_delete('')
      setCommentOId_edit('')
      setCommentOId_reply('')
      setReplyOId_edit('')
      setReplyOId_delete(replyOId)
      setReplyOId_reply('')
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const selectEditComment = useCallback(
    (commentOId: string) => {
      setCommentOId_delete('')
      setCommentOId_edit(commentOId)
      setCommentOId_reply('')
      setReplyOId_delete('')
      setReplyOId_edit('')
      setReplyOId_reply('')
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const selectEditReply = useCallback(
    (replyOId: string) => {
      setCommentOId_delete('')
      setCommentOId_edit('')
      setCommentOId_reply('')
      setReplyOId_edit(replyOId)
      setReplyOId_delete('')
      setReplyOId_reply('')
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const selectFileUser = useCallback(() => {
    setIsFileUserSelected(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectReplyComment = useCallback(
    (commentOId: string) => {
      setCommentOId_reply(commentOId)
      setCommentOId_delete('')
      setCommentOId_edit('')
      setReplyOId_delete('')
      setReplyOId_edit('')
      setReplyOId_reply('')
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const selectReplyReply = useCallback(
    (replyOId: string) => {
      setCommentOId_delete('')
      setCommentOId_edit('')
      setCommentOId_reply('')
      setReplyOId_edit('')
      setReplyOId_delete('')
      setReplyOId_reply(replyOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const unselectDeleteComment = useCallback(() => {
    setCommentOId_delete('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectDeleteReply = useCallback(() => {
    setReplyOId_delete('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectEditComment = useCallback(() => {
    setCommentOId_edit('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectEditReply = useCallback(() => {
    setReplyOId_edit('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectFileUser = useCallback(() => {
    setIsFileUserSelected(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectReplyComment = useCallback(() => {
    setCommentOId_reply('')
    setReplyOId_delete('')
    setReplyOId_edit('')
    setReplyOId_reply('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectReplyReply = useCallback(() => {
    setReplyOId_reply('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    addComment,
    addReply,
    deleteComment,
    deleteReply,
    editComment,
    editFile,
    editFileStatus,
    editReply,
    loadComments,
    loadFile,
    loadNoticeFile,

    selectDeleteComment,
    selectDeleteReply,
    selectEditComment,
    selectEditReply,
    selectFileUser,
    selectReplyComment,
    selectReplyReply,

    unselectDeleteComment,
    unselectDeleteReply,
    unselectEditComment,
    unselectEditReply,
    unselectFileUser,
    unselectReplyComment,
    unselectReplyReply
  }
  return <FileCallbacksContext.Provider value={value}>{children}</FileCallbacksContext.Provider>
}
