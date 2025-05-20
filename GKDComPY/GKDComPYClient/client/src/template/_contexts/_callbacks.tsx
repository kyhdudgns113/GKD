import {createContext, PropsWithChildren, FC, useContext, useCallback} from 'react'
import {useTemplateStatesContext} from './__states'
import {alertErrors} from '../../common/utils'
import {talkToGKD} from '../../common/utils'
import {
  AddClubDataType,
  AddUserDataType,
  ModifySelfInfoDataType,
  SetUserInfoDataType
} from '../../common/typesAndValues/httpDataTypes'
import {postWithJwt, putWithJwt} from '../../common/server'
import {writeJwtFromServer} from '../../common/utils'

// prettier-ignore
type ContextType = {
  addClub: (url: string, commOId: string, name: string) => void,
  addUser: (url: string, commOId: string, id: string, password: string) => void
  modifySelf: (url: string, uOId: string, id: string, prevPassword: string, newPassword: string) => void
  modifyUser: (url: string, uOId: string, id: string, password: string) => void
}
// prettier-ignore
export const TemplateCallbacksContext = createContext<ContextType>({
  addClub: () => {},
  addUser: () => {},
  modifySelf: () => {},
  modifyUser: () => {},
})

export const useTemplateCallbacksContext = () => useContext(TemplateCallbacksContext)

export const TemplateCallbacks: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const {
    setClubsArr,
    setComm,
    setUsers,
  } = useTemplateStatesContext()

  /**
   * 인자 체크는 이 함수 부르기 전에 한다.
   */
  const addClub = useCallback(
    (url: string, commOId: string, name: string) => {
      const data: AddClubDataType = {commOId, name}
      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            if (name === '탈퇴') {
              setComm(body.comm)
            } // BLANK LINE COMMENT:
            else {
              setClubsArr(body.clubsArr)
            }
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            if (errObj.limit) {
              talkToGKD()
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`${url} ELSE`, errObj)
            }
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setClubsArr, setComm]
  )
  /**
   * 인자 체크는 불러오는곳에서 한다.
   */
  const addUser = useCallback(
    (url: string, commOId: string, id: string, password: string) => {
      const data: AddUserDataType = {commOId, id, password}

      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setUsers(body.users)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            if (errObj.limit) {
              talkToGKD()
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`${url} CATCH`, errObj)
            }
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setUsers]
  )
  const modifySelf = useCallback(
    (url: string, uOId: string, id: string, prevPassword: string, newPassword: string) => {
      const data: ModifySelfInfoDataType = {uOId, id, prevPassword, newPassword}
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            writeJwtFromServer(jwtFromServer)
            setUsers(body.users)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setUsers]
  )
  /**
   * 인자 체크는 불러오는 곳에서 한다.
   */
  const modifyUser = useCallback(
    (url: string, uOId: string, id: string, password: string) => {
      const authVal = null
      const data: SetUserInfoDataType = {uOId, id, password, authVal}
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setUsers(body.users)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setUsers]
  )

  // prettier-ignore
  const value = {
    addClub,
    addUser,
    modifySelf,
    modifyUser
  }
  return (
    <TemplateCallbacksContext.Provider value={value}>{children}</TemplateCallbacksContext.Provider>
  )
}
