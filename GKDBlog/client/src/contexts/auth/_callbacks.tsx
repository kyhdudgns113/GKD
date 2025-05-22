import {createContext, useCallback, useContext} from 'react'
import {alertErrors, getWithJwt, NULL_AUTH_BODY, post} from '../../common'
import type {FC, PropsWithChildren} from 'react'
import type {LogInDataType, SignUpDataType} from '../../common/typesAndValues/httpTypes'
import type {AuthBodyType, CallbackType} from '../../common/typesAndValues/types'
import {useAuthStatesContext} from './__states'
import {useNavigate} from 'react-router-dom'

import * as U from '../../common/utils'

// prettier-ignore
type ContextType = {
  getUserGoogleInfo: (jwtFromServer: string) => Promise<boolean>
  logIn: (userId: string, password: string) => Promise<boolean>
  logOut: () => void
  refreshToken: (authLevel: number, errCallback?: CallbackType) => Promise<number>
  signUp: (userId: string, userName: string, password: string) => Promise<boolean>
}
// prettier-ignore
export const AuthCallbacksContext = createContext<ContextType>({
  getUserGoogleInfo: () => Promise.resolve(false),
  logIn: () => Promise.resolve(false),
  logOut: () => {},
  refreshToken: () => Promise.resolve(0),
  signUp: () => Promise.resolve(false)
})

export const useAuthCallbacksContext = () => useContext(AuthCallbacksContext)

export const AuthCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setPicture, setUserAuth, setUserId, setUserName, setUserOId} = useAuthStatesContext()

  const navigate = useNavigate()

  const _writeAuthBodyObject = useCallback(
    async (body: AuthBodyType, callback?: CallbackType) => {
      await U.writeStringP('jwtFromServer', body.jwtFromServer)
      await U.writeStringP('picture', body.picture || '')
      await U.writeStringP('userAuth', body.userAuth.toString())
      await U.writeStringP('userId', body.userId)
      await U.writeStringP('userName', body.userName)
      await U.writeStringP('userOId', body.userOId)

      setPicture(body.picture || '')
      setUserAuth(body.userAuth)
      setUserId(body.userId)
      setUserName(body.userName)
      setUserOId(body.userOId)

      if (callback) {
        callback()
      }
    },
    [setPicture, setUserAuth, setUserId, setUserName, setUserOId]
  )

  /**
   * RedirectGooglePage 에서 실행한다 \
   * redirect 시 수신되는 jwt 를 이용하여 유저 정보를 받아온다 \
   * 유저 정보를 받아오면 유저 정보를 저장하고 로그인 상태를 변경한다 \
   */
  const getUserGoogleInfo = useCallback(
    async (_jwtFromServer: string) => {
      const url = `/client/auth/getUserGoogleInfo/${_jwtFromServer}`
      return getWithJwt(url, _jwtFromServer)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            const {picture, userAuth, userId, userName, userOId} = body
            const authBody: AuthBodyType = {
              jwtFromServer,
              picture,
              userAuth,
              userId,
              userName,
              userOId
            }
            U.writeJwtFromServer(jwtFromServer)
            _writeAuthBodyObject(authBody)
            return true
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url, errObj)
            _writeAuthBodyObject(NULL_AUTH_BODY)
            return false
          }
        })
        .catch(errObj => {
          alertErrors(url, errObj)
          _writeAuthBodyObject(NULL_AUTH_BODY)
          return false
        })
    },
    [_writeAuthBodyObject]
  )

  const logIn = useCallback(
    async (userId: string, password: string) => {
      const url = `/client/auth/logIn`
      const data: LogInDataType = {
        userId,
        password
      }
      return post(url, data, '')
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            const {picture, userAuth, userId, userName, userOId} = body.user
            const authBody: AuthBodyType = {
              jwtFromServer,
              picture,
              userAuth,
              userId,
              userName,
              userOId
            }
            _writeAuthBodyObject(authBody)
            return true
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
            return false
          }
        })
        .catch(errObj => {
          alertErrors(url + ' CATCH', errObj)
          return false
        })
    },
    [_writeAuthBodyObject]
  )

  const logOut = useCallback(() => {
    navigate('/')
    _writeAuthBodyObject(NULL_AUTH_BODY)
  }, [_writeAuthBodyObject, navigate])

  const refreshToken = useCallback(
    async (authLevel: number, errCallback?: CallbackType) => {
      const isJwt = await U.readStringP('jwtFromServer')
      if (isJwt) {
        const url = `/client/auth/refreshToken`
        return getWithJwt(url, '')
          .then(res => res.json())
          .then(res => {
            const {ok, body, jwtFromServer} = res
            const {userAuth} = body.user
            if (ok) {
              // getWithJwt 에서 토큰 갱신을 한다.
              const {picture, userAuth, userId, userName, userOId} = body.user
              const authBody: AuthBodyType = {
                jwtFromServer, // 코드 작성 용이하게 하기위한 중복코드...
                picture,
                userAuth,
                userId,
                userName,
                userOId
              }
              _writeAuthBodyObject(authBody)
              return userAuth as number
            } // BLANK LINE COMMENT:
            else {
              alert(`토큰이 만료된겨 뭐여?`)
              _writeAuthBodyObject(NULL_AUTH_BODY)

              // 권한값 없거나 낮으면 콜백 부른다.
              if ((!userAuth || userAuth < authLevel) && errCallback) {
                errCallback()
              }
              return 0
            }
          })
          .catch(errObj => {
            alertErrors(url + ' CATCH', errObj)
            _writeAuthBodyObject(NULL_AUTH_BODY)
            if (errCallback) {
              errCallback()
            }
            return 0
          })
      } // BLANK LINE COMMENT:
      else {
        return _writeAuthBodyObject(NULL_AUTH_BODY).then(() => {
          if (errCallback) {
            errCallback()
          }
          return 0
        })
      }
    },
    [_writeAuthBodyObject]
  )

  const signUp = useCallback(
    async (userId: string, userName: string, password: string) => {
      const url = `/client/auth/signUp`
      const data: SignUpDataType = {
        userId,
        userName,
        password
      }
      return post(url, data, '')
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            const {picture, userAuth, userId, userName, userOId} = body.user
            const authBody: AuthBodyType = {
              jwtFromServer,
              picture,
              userAuth,
              userId,
              userName,
              userOId
            }
            _writeAuthBodyObject(authBody)
            return true
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
            return false
          }
        })
        .catch(errObj => {
          alertErrors(url + ' CATCH', errObj)
          return false
        })
    },
    [_writeAuthBodyObject]
  )

  // prettier-ignore
  const value: ContextType = {
    getUserGoogleInfo,
    logIn,
    logOut,
    refreshToken,
    signUp
  }
  return <AuthCallbacksContext.Provider value={value}>{children}</AuthCallbacksContext.Provider>
}
