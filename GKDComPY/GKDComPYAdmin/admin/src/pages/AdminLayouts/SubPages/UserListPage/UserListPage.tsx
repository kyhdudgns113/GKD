import type {FC} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {DivCommonProps, Setter} from '../../../../common'
import {UserInfoAuthType} from '../../../../common/shareTypes'
import {AddUserButton} from './parts'
import {ModalAddUser, ModalSetUserComm} from './modals'
import {UserInfoChart} from './parts/UserInfoChart'
import {useAdminContext} from '../../AdminLayout'
import {getWithJwt, postWithJwt, putWithJwt} from '../../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../../common/utils'
import {AddUserDataType, SetCommAuthDataType} from '../../../../common/httpDataTypes'

// prettier-ignore
type ContextType = {
  isModalAddUser: boolean, setIsModalAddUser: Setter<boolean>,
  isModalSetComm: string, setIsModalSetComm: Setter<string>,
  users: {[uOId: string]: UserInfoAuthType}, setUsers: Setter<{[uOId: string]: UserInfoAuthType}>

  addUser: (id: string, pw: string, commOId: string) => void,
  setUserCommAuthority: (uOId: string, commOId: string, authVal: number | null) => void
}
// prettier-ignore
const UserListContext = createContext<ContextType>({
  isModalAddUser: false, setIsModalAddUser: () => {},
  isModalSetComm: '', setIsModalSetComm: () => {},
  users: {}, setUsers: () => {},

  addUser: () => {},
  setUserCommAuthority: () => {}
})
export const useUserListContext = () => {
  return useContext(UserListContext)
}

export const UserListPage: FC<DivCommonProps> = ({className, ...props}) => {
  const {setWhichList} = useAdminContext()

  const [isModalAddUser, setIsModalAddUser] = useState<boolean>(false)
  /** 여기엔 선택한 유저의 uOId 가 들어간다. */
  const [isModalSetComm, setIsModalSetComm] = useState<string>('')
  const [users, setUsers] = useState<{[uOId: string]: UserInfoAuthType}>({})

  // AREA1: Export Function
  /**
   * 함수의 재사용을 위해서라도 여기서 에러 검출한다 \
   * SignUp 이랑 다른점 : 여기서는 jwt 를 갱신한다
   */
  const addUser = useCallback(async (id: string, password: string, commOId: string) => {
    if (!id || !password || !commOId) return

    const data: AddUserDataType = {id, password, commOId}
    postWithJwt('/admin/userList/addUser', data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setUsers(body.users)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`/admin/userList/addUser ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(`/admin/userList/addUser CATCH`, errObj))
  }, [])
  const setUserCommAuthority = useCallback(
    async (uOId: string, commOId: string, authVal: number | null) => {
      if (!uOId || !commOId) return

      const data: SetCommAuthDataType = {uOId, commOId, authVal}
      putWithJwt(`/admin/userList/setUserCommAuth`, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setUsers(body.users)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/admin/userList/setUserCommAuth ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`/admin/userList/setUserCommAuth CATCH`, errObj))
    },
    []
  )

  // AREA2: useEffect
  // Get users
  useEffect(() => {
    getWithJwt(`/admin/userList/getUsers`)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setUsers(body.users)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`/admin/userList/getUsers ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(`/admin/userList/getUsers CATCH`, errObj))
  }, [])
  // Set whichList
  useEffect(() => {
    setWhichList('user')
  }, [setWhichList])

  // AREA3: value
  // prettier-ignore
  const value = {
    isModalAddUser, setIsModalAddUser,
    isModalSetComm, setIsModalSetComm,
    users, setUsers,    

    addUser,
    setUserCommAuthority
  }

  // AREA1: TSX
  return (
    <UserListContext.Provider
      value={value}
      children={
        <div className={`flex flex-row ${className}`} {...props}>
          <div className={`flex flex-col `} onClick={e => setIsModalSetComm('')}>
            <AddUserButton className="mt-6 ml-8" />
            <UserInfoChart className="mt-4 ml-8" />
          </div>
          {isModalSetComm && <ModalSetUserComm />}

          {isModalAddUser && <ModalAddUser />}
        </div>
      }
    />
  )
}
