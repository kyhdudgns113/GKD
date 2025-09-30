import {createContext, useCallback, useContext} from 'react'
import {useNavigate} from 'react-router-dom'

import {NULL_AUTH_BODY} from '@nullValue'
import {getWithJwt, post} from '@server'

import type {FC, PropsWithChildren} from 'react'
import type {AuthBodyType, CallbackType} from '@type'

import * as C from '@context'
import * as HTTP from '@httpType'
import * as U from '@util'
import {AUTH_GUEST} from '@commons/secret'

// prettier-ignore
type ContextType = {
  logIn: (userId: string, password: string) => Promise<boolean>,
  logOut: () => void,
  refreshToken: (authLevel: number, errCallback?: CallbackType) => Promise<number>,
  signUp: (userId: string, userMail: string, userName: string, password: string) => Promise<boolean>
}
// prettier-ignore
export const AuthCallbacksContext = createContext<ContextType>({
  logIn: () => Promise.resolve(false),
  logOut: () => {},
  refreshToken: () => Promise.resolve(0),
  signUp: () => Promise.resolve(false)
})

export const useAuthCallbacksContext = () => useContext(AuthCallbacksContext)

export const AuthCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {lockLogIn, lockSignUp, releaseLogIn, releaseSignUp} = C.useLockCallbacksContext()
  const {setPicture, setUserAuth, setUserId, setUserMail, setUserName, setUserOId} = C.useAuthStatesContext()

  const navigate = useNavigate()

  // AREA1: 내부에서 사용할 함수
  const _writeAuthBodyObject = useCallback(
    async (body: AuthBodyType, callback?: CallbackType) => {
      await U.writeStringP('jwtFromServer', body.jwtFromServer)
      await U.writeStringP('picture', body.picture || '')
      await U.writeStringP('userAuth', body.userAuth.toString())
      await U.writeStringP('userId', body.userId)
      await U.writeStringP('userMail', body.userMail)
      await U.writeStringP('userName', body.userName)
      await U.writeStringP('userOId', body.userOId)

      setPicture(body.picture || '')
      setUserAuth(body.userAuth)
      setUserId(body.userId)
      setUserMail(body.userMail)
      setUserName(body.userName)
      setUserOId(body.userOId)

      if (callback) {
        callback()
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // AREA2: 외부에서 사용할 함수
  const logIn = useCallback(
    async (userId: string, password: string) => {
      const url = `/client/auth/logIn`
      const data: HTTP.LogInDataType = {userId, password}

      lockLogIn()

      return post(url, data, '')
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            const {picture, userAuth, userId, userMail, userName, userOId} = body.user
            const authBody: AuthBodyType = {
              jwtFromServer,
              picture,
              userAuth,
              userId,
              userMail,
              userName,
              userOId
            }
            _writeAuthBodyObject(authBody)
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
        .finally(() => releaseLogIn())
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const logOut = useCallback(() => {
    _writeAuthBodyObject(NULL_AUTH_BODY)
    navigate('/')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 토큰을 갱신하고 권한이 부족하면 콜백을 실행한다
   *
   * @returns Promise<number> 유저 권한
   */
  const refreshToken = useCallback(
    async (authLevel: number, errCallback?: CallbackType) => {
      const isJwt = await U.readStringP('jwtFromServer')
      if (isJwt) {
        const url = `/client/auth/refreshToken`
        return getWithJwt(url)
          .then(res => res.json())
          .then(res => {
            const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res
            const {userAuth} = body.user
            if (ok) {
              // getWithJwt 에서 토큰 갱신을 한다.
              const {picture, userAuth, userId, userMail, userName, userOId} = body.user
              const authBody: AuthBodyType = {
                jwtFromServer, // 코드 작성 용이하게 하기위한 중복코드...
                picture,
                userAuth,
                userId,
                userMail,
                userName,
                userOId
              }
              _writeAuthBodyObject(authBody)
              return userAuth as number
            } // ::
            else {
              _writeAuthBodyObject(NULL_AUTH_BODY)
              U.alertErrMsg(url, statusCode, gkdErrMsg, message)

              // 권한값 없거나 낮으면 콜백 부른다.
              if ((!userAuth || userAuth < authLevel) && errCallback) {
                errCallback()
              }
              return 0
            }
          })
          .catch(errObj => {
            U.alertErrors(url, errObj)
            _writeAuthBodyObject(NULL_AUTH_BODY)

            if (errCallback) {
              errCallback()
            }
            return 0
          })
      } // ::
      else {
        return _writeAuthBodyObject(NULL_AUTH_BODY).then(() => {
          if (authLevel > AUTH_GUEST && errCallback) {
            errCallback()
          }
          return 0
        })
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const signUp = useCallback(
    async (userId: string, userMail: string, userName: string, password: string) => {
      const url = `/client/auth/signUp`
      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      lockSignUp()

      return post(url, data, '')
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            const {picture, userAuth, userId, userMail, userName, userOId} = body.user
            const authBody: AuthBodyType = {
              jwtFromServer,
              picture,
              userAuth,
              userId,
              userMail,
              userName,
              userOId
            }
            _writeAuthBodyObject(authBody)
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
        .finally(() => releaseSignUp())
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // prettier-ignore
  const value: ContextType = {
    logIn,
    logOut,
    refreshToken,
    signUp
  }
  return <AuthCallbacksContext.Provider value={value}>{children}</AuthCallbacksContext.Provider>
}
