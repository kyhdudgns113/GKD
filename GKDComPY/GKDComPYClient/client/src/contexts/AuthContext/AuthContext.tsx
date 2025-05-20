import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {AuthBodyType, CallbackType, Setter} from '../../common'

import * as U from '../../common/utils'
import {useNavigate} from 'react-router-dom'
import {LogInDataType} from '../../common/typesAndValues/httpDataTypes'
import {getWithJwt, post} from '../../common/server'

// prettier-ignore
type ContextType = {
  id: string, setId: Setter<string>,
  uOId: string, setUOId: Setter<string>,

  checkLoggedIn: () => void,
  logIn: (id: string, password: string) => void,
  logOut: () => void,
  refreshToken: () => void,
}
// prettier-ignore
export const AuthContext = createContext<ContextType>({
  id: '', setId: () => {},
  uOId: '', setUOId: () => {},

  checkLoggedIn: async () => {},
  logIn: () => {},
  logOut: () => {},
  refreshToken: async () => {}
})

export const useAuthContext = () => useContext(AuthContext)

type AuthProviderProps = {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({children}) => {
  const [id, setId] = useState<string>('')
  const [uOId, setUOId] = useState<string>('')

  const nullAuthBody: AuthBodyType = useMemo(() => {
    // export 하는 함수의 dependency 로 들어가기 때문에
    // useMemo 로 해야한다.
    const elem: AuthBodyType = {
      id: '',
      jwtFromServer: '',
      uOId: ''
    }
    return elem
  }, [])

  const navigate = useNavigate()

  // AREA1: Private function Area
  /**
   * Setter 때문에 여기에 있어야 한다
   */
  const writeAuthBodyObject = useCallback((body: AuthBodyType, callback?: CallbackType) => {
    U.writeStringP('jwt', body.jwtFromServer).then(() => {
      U.writeStringP('id', body.id).then(() => {
        U.writeStringP('uOId', body.uOId).then(() => {
          setId(body.id)
          setUOId(body.uOId)
          callback && callback()
        })
      })
    })
  }, [])

  // AREA2: Exporting function area
  /**
   * getWithJwt 에서 이미 토큰 갱신하기 때문에 여기서 굳이 안한다 \
   * 로그인이 안 되어 있을경우 당연하 guard 를 통과하지 못할것이다 \
   * 따라서 서버에서 jwt 전송도 안해준다
   */
  const checkLoggedIn = useCallback(async () => {
    const isJwt = await U.readStringP('jwt')
    if (isJwt) {
      getWithJwt(`/client/refreshToken`)
        .then(res => res.json())
        .then(res => {
          const {ok} = res
          if (ok) {
            navigate('/client')
          } // BLANK LINE COMMENT:
          else {
            alert('토큰이 만료되었어요')
            writeAuthBodyObject(nullAuthBody, () => navigate('/'))
          }
        })
        .catch(errObj => {
          if (errObj['expiredAt']) {
            alert('토큰이 만료되었어요. 재 로그인 부탁드려요!')
          } // BLANK LINE COMMENT:
          else {
            U.alertErrors(`/client/refreshToken CATCH`, errObj)
          }
          // 얘는 뭐가됬던 실행해야됨.
          writeAuthBodyObject(nullAuthBody, () => navigate('/'))
        })
    }
  }, [nullAuthBody, navigate, writeAuthBodyObject])
  const refreshToken = useCallback(async () => {
    const isJwt = await U.readStringP('jwt')
    if (isJwt) {
      getWithJwt(`/client/refreshToken`)
        .then(res => res.json())
        .then(res => {
          const {ok} = res
          if (ok) {
            // getWithJwt 에서 토큰 갱신을 한다.
            // ok 일때 해 줄 필요가 없다.
          } // BLANK LINE COMMENT:
          else {
            writeAuthBodyObject(nullAuthBody, () => navigate('/'))
          }
        })
        .catch(errObj => {
          U.alertErrors(`/client/refreshToken CATCH`, errObj)
          writeAuthBodyObject(nullAuthBody, () => navigate('/'))
        })
    } // BLANK LINE COMMENT:
    else {
      writeAuthBodyObject(nullAuthBody, () => navigate('/'))
    }
  }, [nullAuthBody, navigate, writeAuthBodyObject])
  const logIn = useCallback(
    (id: string, pwVal: string) => {
      if (!id || !pwVal) {
        return
      } // BLANK LINE COMMENT:
      const loginData: LogInDataType = {
        id: id,
        password: pwVal
      }

      // 로그인 하기 전에는 토큰이 없기 때문에 postWithJwt 쓰면 안된다.
      post('/client/logIn', loginData, null)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            writeAuthBodyObject(body, () => navigate('/client'))
          } // BLANK LINE COMMENT:
          else {
            U.alertErrors(`/client/logIn ELSE`, errObj)
          }
        })
        .catch(errObj => U.alertErrors(`/client/logIn CATCH`, errObj))
        .finally(() => {})
    },
    [navigate, writeAuthBodyObject]
  )
  const logOut = useCallback(() => {
    writeAuthBodyObject(nullAuthBody, () => navigate('/'))
  }, [nullAuthBody, navigate, writeAuthBodyObject])

  // 새로고침시 행동
  // 새로고침등의 이슈로 useState 에 저장되어있던 id, uOId 이 날아가는 경우가 있다.
  // jwt 는 읽어오지 않는다. 어차피 setJwt 같은거 해봐야 쓸데도 없다.
  // 한 쪽 tab 에서 refreshToken 호출되었을 때, 다른 탭에서도 호출이 되지는 않기 때문이다.
  // 그러면 갱신되지 않은 탭에서 뭔가를 하려고 할 때, 로컬 스토리지에는 싱싱한 jwt 가 있음에도 불구하고
  // 이미 만료가 된 jwt 로 인증을 하려다가 로그아웃 당할 수 있다.
  useEffect(() => {
    U.readStringP('id').then(idVal => {
      U.readStringP('uOId').then(uOIdVal => {
        setId(idVal || '')
        setUOId(uOIdVal || '')
      })
    })
  }, [])

  // prettier-ignore
  const value = {
    id, setId,
    uOId, setUOId,

    checkLoggedIn,
    logIn,
    logOut,
    refreshToken
  }
  return <AuthContext.Provider value={value} children={children} />
}
