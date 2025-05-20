import type {FC} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {DivCommonProps, Setter} from '../../../../common'
import {useAdminContext} from '../../AdminLayout'
import {ClubInfoType, CommunityInfoType, UserInfoAuthType} from '../../../../common/shareTypes'
import {delWithJwt, getWithJwt, postWithJwt, putWithJwt} from '../../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../../common/utils'
import {
  CommunityInfoPart,
  CommunityListPart,
  ModalAddClubToComm,
  ModalAddCommunity,
  ModalAddUserToComm,
  ModalDelClubFromComm,
  ModalDelUserFromComm
} from './parts'
import {
  AddClubDataType,
  AddCommDataType,
  AddUserDataType,
  ChangeCommNameDataType,
  SetCommAuthDataType,
  SetCommMaxClubsDataType,
  SetCommMaxUsersDataType
} from '../../../../common/httpDataTypes'

// prettier-ignore
type ContextType = {
  clubsArr: ClubInfoType[], setClubsArr: Setter<ClubInfoType[]>,
  commOId: string, setCommOId: Setter<string>,
  comms: {[commOId: string]: CommunityInfoType}, setComms: Setter<{[commOId: string]: CommunityInfoType}>
  commUsersArr: UserInfoAuthType[], setCommUsersArr: Setter<UserInfoAuthType[]>

  isModalAddComm: boolean, setIsModalAddComm: Setter<boolean>,
  isModalAddClub: string, setIsModalAddClub: Setter<string>,
  isModalAddUser: string, setIsModalAddUser: Setter<string>,
  isModalDelClub: number, setIsModalDelClub: Setter<number>,
  isModelDelUser: number, setIsModalDelUser: Setter<number>,

  addClub: (commOId: string, nameVal: string) => Promise<boolean>,
  addCommunity: (name: string) => void,
  addUserToComm: (id: string, password: string, commOId: string) => Promise<boolean>,
  changeCommunityName: (commOId: string, name: string) => void,
  deleteClub: (commOId: string, clubOId: string) => void,
  deleteUser: (commOId: string, uOId: string) => void,

  setCommMaxClubs: (commOId: string, maxUsers: number) => void,
  setCommMaxUsers: (commOId: string, maxUsers: number) => void,
  setUserAuthVal: (commOId: string, uOId: string, authVal: number) => void
}
// prettier-ignore
const CommunityListContext = createContext<ContextType>({
  clubsArr: [], setClubsArr: () => {},
  commOId: '', setCommOId: () => {},
  comms: {}, setComms: () => {},
  commUsersArr: [], setCommUsersArr: () => {},

  isModalAddComm: false, setIsModalAddComm: () => {},
  isModalAddClub: '', setIsModalAddClub: () => {},
  isModalAddUser: '', setIsModalAddUser: () => {},
  isModalDelClub: -1, setIsModalDelClub: () => {},
  isModelDelUser: -1, setIsModalDelUser: () => {},

  addClub: () => Promise.resolve(false),
  addCommunity: () => {},
  addUserToComm: () => Promise.resolve(false),
  changeCommunityName: () => {},
  deleteClub: () => {},
  deleteUser: () => {},

  setCommMaxClubs: () => {},
  setCommMaxUsers: () => {},
  setUserAuthVal: () => {}
})
export const useCommunityListContext = () => {
  return useContext(CommunityListContext)
}
// BLANK LINE COMMENT:
export const CommunityListPage: FC<DivCommonProps> = ({className, ...props}) => {
  const {setWhichList} = useAdminContext()

  const [clubsArr, setClubsArr] = useState<ClubInfoType[]>([])
  const [commOId, setCommOId] = useState<string>('')
  const [comms, setComms] = useState<{[commOId: string]: CommunityInfoType}>({})
  const [commUsersArr, setCommUsersArr] = useState<UserInfoAuthType[]>([])

  const [isModalAddComm, setIsModalAddComm] = useState<boolean>(false)
  // commOId 값을 갖는다.
  const [isModalAddClub, setIsModalAddClub] = useState<string>('')
  // commOId 값을 갖는다.
  const [isModalAddUser, setIsModalAddUser] = useState<string>('')
  // clubArr 의 인덱스 값을 갖는다.
  const [isModalDelClub, setIsModalDelClub] = useState<number>(-1)
  // userArr 의 인덱스 값을 갖는다.
  const [isModelDelUser, setIsModalDelUser] = useState<number>(-1)

  const addClub = useCallback(async (commOId: string, name: string) => {
    if (!commOId || commOId === 'admin' || !name) {
      alert(`공동체 이름이나 아이디가 왜이래?`)
      return Promise.resolve(false)
    }
    const data: AddClubDataType = {commOId, name}
    if (name === '탈퇴') {
      return postWithJwt(`/admin/community/addBanClub`, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setComms(body.comms)
            writeJwtFromServer(jwtFromServer)
            return true
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/admin/community/addBanClub ELSE`, errObj)
            return false
          }
        })
        .catch(errObj => {
          alertErrors(`/admin/community/addBanClub CATCH`, errObj)
          return false
        })
    } // BLANK LINE COMMENT:
    else {
      return postWithJwt(`/admin/community/addClub`, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setClubsArr(body.clubsArr)
            writeJwtFromServer(jwtFromServer)
            return true
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/admin/community/addClub ELSE`, errObj)
            return false
          }
        })
        .catch(errObj => {
          alertErrors(`/admin/community/addClub CATCH`, errObj)
          return false
        })
    }
  }, [])
  const addCommunity = useCallback((name: string) => {
    if (!name) {
      alert('이름이 비었어요...')
      return
    }

    const data: AddCommDataType = {name}

    postWithJwt(`/admin/community/addComm`, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          if (jwtFromServer) {
            writeJwtFromServer(jwtFromServer)
          }
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`/admin/community/addComm ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(`/admin/community/addComm CATCH`, errObj))
  }, [])
  /**
   * addUserToComm.then() 이나 await addUserToCom() 만 쓰자 \
   * catch 를 굳이 발생시키지 않았다
   *
   * @returns 실패하면 반역, 성공하면 혁명을 리턴한다 \
   * 실패하면 모달 안 닫기 위해서이다
   */
  const addUserToComm = useCallback((id: string, password: string, commOId: string) => {
    if (!id) {
      alert(`id 가 왜 비어있어?!?!`)
      return Promise.resolve(false)
    }
    if (!password) {
      alert('비밀번호 비었다.')
      return Promise.resolve(false)
    }
    if (!commOId || commOId === 'admin') {
      alert('commOId 가 이상하다')
      return Promise.resolve(false)
    }
    const data: AddUserDataType = {id, password, commOId}
    return postWithJwt(`/admin/community/addUser`, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setCommUsersArr(body.commUsersArr)
          writeJwtFromServer(jwtFromServer)
          return true
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`/admin/community/addUser ELSE`, errObj)
          return false
        }
      })
      .catch(errObj => {
        alertErrors(`/admin/community/addUser CATCH`, errObj)
        return false
      })
  }, [])
  const changeCommunityName = useCallback((commOId: string, name: string) => {
    if (!commOId) {
      alert(`commOId Error`)
      return
    }
    if (!name) {
      alert('이름이 왜 비었냐')
      return
    }

    const data: ChangeCommNameDataType = {commOId, name}
    putWithJwt(`/admin/community/changeName`, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`/admin/community/changeName ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(`/admin/community/changeName ELSE`, errObj))
  }, [])
  const deleteClub = useCallback((commOId: string, clubOId: string) => {
    if (!commOId) {
      alert('공동체 ID 가 이상해요')
      return
    }
    if (!clubOId) {
      alert('클럽 ID 가 이상해요')
      return
    }

    const url = `/admin/community/delClub/${commOId}/${clubOId}`
    delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(errObj => alertErrors(url + ' CATCH', errObj))
  }, [])
  const deleteUser = useCallback((commOId: string, uOId: string) => {
    if (!commOId) {
      alert('공동체 ID 가 이상해요')
      return
    }
    if (!uOId) {
      alert('유저 ID 가 이상해요')
      return
    }

    const url = `/admin/community/delUser/${commOId}/${uOId}`
    delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(errObj => alertErrors(url + ' CATCH', errObj))
  }, [])

  const setCommMaxClubs = useCallback((commOId: string, maxClubs: number) => {
    const url = '/admin/community/setCommMaxClubs'
    const data: SetCommMaxClubsDataType = {commOId, maxClubs}

    putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(errObj => alertErrors(url + ' CATCH', errObj))
  }, [])
  const setCommMaxUsers = useCallback((commOId: string, maxUsers: number) => {
    const url = '/admin/community/setCommMaxUsers'
    const data: SetCommMaxUsersDataType = {commOId, maxUsers}

    putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(errObj => alertErrors(url + ' CATCH', errObj))
  }, [])
  const setUserAuthVal = useCallback((commOId: string, uOId: string, authVal: number) => {
    const url = '/admin/community/setUserAuthVal'
    const data: SetCommAuthDataType = {commOId, uOId, authVal}

    putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(errObj => alertErrors(url + ' CATCH', errObj))
  }, [])

  // Set current page community
  useEffect(() => {
    setWhichList('community')
  }, [setWhichList])
  // Get comms
  useEffect(() => {
    getWithJwt(`/admin/community/getComms`)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setComms(body.comms)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`/admin/community/getComms ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(`/admin/community/getComms CATCH`, errObj))
  }, [])

  // prettier-ignore
  const value = {
    clubsArr, setClubsArr,
    commOId, setCommOId,
    comms, setComms,
    commUsersArr, setCommUsersArr,

    isModalAddComm, setIsModalAddComm,
    isModalAddClub, setIsModalAddClub,
    isModalAddUser, setIsModalAddUser,
    isModalDelClub, setIsModalDelClub,
    isModelDelUser, setIsModalDelUser,

    addClub,
    addCommunity,
    addUserToComm,
    changeCommunityName,
    deleteClub,
    deleteUser,

    setCommMaxClubs,
    setCommMaxUsers,
    setUserAuthVal,
  }
  // AREA3: TSX
  return (
    <CommunityListContext.Provider
      value={value}
      children={
        <div className={`flex flex-row h-full ${className}`} {...props}>
          <CommunityListPart />
          {commOId && <CommunityInfoPart className={`ml-8 mr-8`} />}

          {isModalAddComm && <ModalAddCommunity />}
          {isModalAddUser && <ModalAddUserToComm />}
          {isModalAddClub && <ModalAddClubToComm />}
          {isModalDelClub > -1 && <ModalDelClubFromComm />}
          {isModelDelUser > -1 && <ModalDelUserFromComm />}
        </div>
      }
    />
  )
}
