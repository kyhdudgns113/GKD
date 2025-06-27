import {createContext, useCallback, useContext} from 'react'
import {delWithJwt, get, postWithJwt, putWithJwt} from '@server'
import {alertErrors, writeJwtFromServer} from '@util'

import {useReadingPageStatesContext} from './__states'
import {useAuthCallbacksContext} from '@contexts/auth/_callbacks'
import {useAuthStatesContext} from '@contexts/auth/__states'

import type {FC, PropsWithChildren} from 'react'
import type {ReplyType} from '@shareType'

import * as HTTP from '@httpType'

// prettier-ignore
type ContextType = {
  addComment: (fileOId: string, content: string) => void
  addReply: (commentOId: string, targetUserName: string, targetUserOId: string, content: string) => void

  deleteComment: (commentOId: string) => void
  modifyComment: (commentOId: string, content: string) => void
  modifyReply: (reply: ReplyType, newContent: string) => void

  readCommentsArr: (fileOId: string) => void
  readFile: (fileOId: string) => void

  deleteReply: (reply: ReplyType) => void
}
// prettier-ignore
export const ReadingPageCallbacksContext = createContext<ContextType>({
  addComment: () => {},
  addReply: () => {},

  deleteComment: () => {},
  modifyComment: () => {},
  modifyReply: () => {},

  readCommentsArr: () => {},
  readFile: () => {},

  deleteReply: () => {},  
})

export const useReadingPageCallbacksContext = () => useContext(ReadingPageCallbacksContext)

export const ReadingPageCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId} = useAuthStatesContext()
  const {refreshToken} = useAuthCallbacksContext()
  const {setCommentsArr, setFile, setIsFileLoaded} = useReadingPageStatesContext()

  // POST AREA:
  const addComment = useCallback(
    (fileOId: string, content: string) => {
      const url = `/client/reading/addComment`
      const data: HTTP.AddCommentDataType = {
        content,
        fileOId,
        userOId
      }
      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            alert('댓글 작성이 완료되었어요')
            setCommentsArr(body.commentsArr)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => {
          if (err.jwt) {
            alert('로그인 이후 이용할 수 있습니다')
          } // ::
          else {
            alertErrors(url + ' CATCH', err)
          }
        })
    },
    [userOId, setCommentsArr]
  )

  const addReply = useCallback(
    (commentOId: string, targetUserName: string, targetUserOId: string, content: string) => {
      const url = `/client/reading/addReply`
      const data: HTTP.AddReplyDataType = {
        commentOId,
        targetUserName,
        targetUserOId,
        content
      }
      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            alert('대댓글 작성이 완료되었어요')
            setCommentsArr(body.commentsArr)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setCommentsArr]
  )

  // PUT AREA:
  const deleteReply = useCallback(
    (reply: ReplyType) => {
      /**
       * put으로 하는 이유
       * - date 값은 DB 에 있는거랑 뭔가 다르다
       * - dateString 은 한글이 섞여서 url 에 전달이 안된다.
       */
      const {commentOId, dateString, userOId} = reply

      const url = `/client/reading/deleteReply`
      const data: HTTP.DeleteReplyDataType = {
        commentOId,
        dateString,
        userOId
      }
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            alert('대댓글 삭제가 완료되었어요')
            setCommentsArr(body.commentsArr)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    [setCommentsArr]
  )

  const modifyComment = useCallback(
    (commentOId: string, content: string) => {
      const url = `/client/reading/modifyComment`
      const data: HTTP.ModifyCommentDataType = {
        commentOId,
        content
      }
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            alert('댓글 수정이 완료되었어요')
            setCommentsArr(body.commentsArr)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    [setCommentsArr]
  )

  const modifyReply = useCallback(
    async (reply: ReplyType, newContent: string) => {
      // 토큰 갱신을 하기 위한 목적으로만 호출함.
      // 권한체크 안한다.
      await refreshToken(0)

      const {commentOId, dateString, userOId} = reply
      const content = newContent

      const url = `/client/reading/modifyReply`
      const data: HTTP.ModifyReplyDataType = {
        commentOId,
        content,
        dateString,
        userOId
      }
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            alert('대댓글 수정이 완료되었어요')
            setCommentsArr(body.commentsArr)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    [refreshToken, setCommentsArr]
  )

  // GET AREA:
  const readCommentsArr = useCallback(
    async (fileOId: string) => {
      // 토큰 갱신을 하기 위한 목적으로만 호출함.
      // 권한체크 안한다.
      await refreshToken(0)

      if (!fileOId) {
        alert('fileOId 가 없습니다.')
        return
      }

      const url = `/client/reading/readCommentsArr/${fileOId}`
      const jwt = ''
      get(url, jwt)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            const {commentsArr} = body
            setCommentsArr(commentsArr)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    [refreshToken, setCommentsArr]
  )

  const readFile = useCallback(
    async (fileOId: string) => {
      // 토큰 갱신을 하기 위한 목적으로만 호출함.
      // 권한체크 안한다.
      await refreshToken(0)

      if (!fileOId) {
        alert('fileOId 가 없습니다.')
        return
      }

      const url = `/client/reading/readFile/${fileOId}`
      const jwt = ''

      get(url, jwt)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            setFile(body.file)
            setIsFileLoaded(true)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setFile, setIsFileLoaded, refreshToken]
  )

  // DELETE AREA:
  const deleteComment = useCallback(
    (commentOId: string) => {
      const url = `/client/reading/deleteComment/${commentOId}`
      delWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            alert('댓글 삭제가 완료되었어요')
            setCommentsArr(body.commentsArr)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    [setCommentsArr]
  )

  // prettier-ignore
  const value: ContextType = {
    addComment,
    addReply,

    deleteComment,
    modifyComment,
    modifyReply,

    readCommentsArr,
    readFile,
    
    deleteReply,
  }
  return <ReadingPageCallbacksContext.Provider value={value}>{children}</ReadingPageCallbacksContext.Provider>
}
