import {createContext, useCallback, useContext} from 'react'
import {useNavigate} from 'react-router-dom'

import {NULL_AUTH_BODY} from '@nullValue'
import {post} from '@server'

import type {FC, PropsWithChildren} from 'react'
import type {AuthBodyType, CallbackType} from '@type'

import * as C from '@context'
import * as HTTP from '@httpType'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  logIn: (userId: string, password: string) => Promise<boolean>,
  logOut: () => void,
  signUp: (userId: string, userName: string, password: string) => Promise<boolean>
}
// prettier-ignore
export const AuthCallbacksContext = createContext<ContextType>({
  logIn: () => Promise.resolve(false),
  logOut: () => {},
  signUp: () => Promise.resolve(false)
})

export const useAuthCallbacksContext = () => useContext(AuthCallbacksContext)

export const AuthCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setLockLogIn, setLockSignUp} = C.useLockStatesContext()
  const {setPicture, setUserAuth, setUserId, setUserName, setUserOId} = C.useAuthStatesContext()

  const navigate = useNavigate()

  // AREA1: 내부에서 사용할 함수
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

  // AREA2: 외부에서 사용할 함수
  const logIn = useCallback(
    async (userId: string, password: string) => {
      const url = `/client/auth/logIn`
      const data: HTTP.LogInDataType = {userId, password}

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
          } // ::
          else {
            U.alertErrors(url + ' ELSE', errObj)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url + ' CATCH', errObj)
          return false
        })
        .finally(() => setLockLogIn(false))
    },
    [_writeAuthBodyObject, setLockLogIn]
  )

  const logOut = useCallback(() => {
    _writeAuthBodyObject(NULL_AUTH_BODY)
    navigate('/')
  }, [_writeAuthBodyObject, navigate])

  const signUp = useCallback(
    async (userId: string, userName: string, password: string) => {
      const url = `/client/auth/signUp`
      const data: HTTP.SignUpDataType = {userId, userName, password}

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
          } // ::
          else {
            U.alertErrors(url + ' ELSE', errObj)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url + ' CATCH', errObj)
          return false
        })
        .finally(() => setLockSignUp(false))
    },
    [_writeAuthBodyObject, setLockSignUp]
  )

  // prettier-ignore
  const value: ContextType = {
    logIn,
    logOut,
    signUp
  }
  return <AuthCallbacksContext.Provider value={value}>{children}</AuthCallbacksContext.Provider>
}
