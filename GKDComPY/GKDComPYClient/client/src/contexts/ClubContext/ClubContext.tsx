import type {FC} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {MemberInfoType, WeeklyRecordType} from '../../common/typesAndValues/shareTypes'
import {Setter} from '../../common'
import {getWithJwt, postWithJwt} from '../../common/server'
import {useTemplateStatesContext} from '../../template/_contexts'
import {alertErrors, writeJwtFromServer} from '../../common/utils'
import {AddNextWeekDataType} from '../../common/typesAndValues/httpDataTypes'

// prettier-ignore
type ContextType = {
  isAddMemModal: string, setIsAddMemModal: Setter<string>,
  members: {[memOId: string]: MemberInfoType}, setMembers: Setter<{[memOId: string]: MemberInfoType}>
  membersArr: MemberInfoType[], setMembersArr: Setter<MemberInfoType[]>,
  memberSortBy: string, setMemberSortBy: Setter<string>,
  weekRowsArr: WeeklyRecordType[], setWeekRowsArr: Setter<WeeklyRecordType[]>,

  addNextWeek: (clubOId: string) => void,
  addPrevWeek: (clubOId: string) => void
}
// prettier-ignore
export const ClubContext = createContext<ContextType>({
  isAddMemModal: '', setIsAddMemModal: () => {},
  members: {}, setMembers: () => {},
  membersArr: [], setMembersArr: () => {},
  memberSortBy: '', setMemberSortBy: () => {},
  weekRowsArr: [], setWeekRowsArr: () => {},

  addNextWeek: () => {},
  addPrevWeek: () => {},
})
export const useClubContext = () => {
  return useContext(ClubContext)
}

export const ClubProvider: FC = () => {
  const {banClubOId, clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext()

  /**
   * members, membersArr : 선택한 클럽의 멤버 \
   * 이 곳은 선택한 클럽만 관리하는 곳이다. \
   * 다른 클럽 멤버를 여기서 알 필요가 없다. \
   */
  const [isAddMemModal, setIsAddMemModal] = useState<string>('')
  const [members, setMembers] = useState<{[memOId: string]: MemberInfoType}>({})
  const [membersArr, setMembersArr] = useState<MemberInfoType[]>([])
  const [memberSortBy, setMemberSortBy] = useState<string>('')
  const [weekRowsArr, setWeekRowsArr] = useState<WeeklyRecordType[]>([])

  const addNextWeek = useCallback((clubOId: string) => {
    const url = `/client/record/addNextWeek`
    const data: AddNextWeekDataType = {clubOId}
    postWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setWeekRowsArr(body.weekRowsArr)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`${url} ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(`${url} CATCH`, errObj))
  }, [])
  const addPrevWeek = useCallback((clubOId: string) => {
    const url = `/client/record/addPrevWeek`
    const data: AddNextWeekDataType = {clubOId}
    postWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setWeekRowsArr(body.weekRowsArr)
          writeJwtFromServer(jwtFromServer)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(`${url} ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(`${url} CATCH`, errObj))
  }, [])

  // Get club's members
  useEffect(() => {
    if (clubsArr.length > 0 && clubIdx != null) {
      const clubOId = clubIdx >= 0 ? clubsArr[clubIdx].clubOId : banClubOId
      getWithJwt(`/client/club/getMembers/${clubOId}`)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setMembers(body.members)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/client/club/getMembers/${clubsArr[clubIdx || 0].clubOId} ELSE`, errObj)
          }
        })
        .catch(errObj =>
          alertErrors(`/client/club/getMembers/${clubsArr[clubIdx || 0].clubOId} CATCH`, errObj)
        )
    } // BLANK LINE COMMENT:
    else {
      // 이거 안하면 뜬금없이 후보군 멤버가 뜨기도 한다.
      setMembers({})
    }
  }, [banClubOId, clubIdx, clubsArr])
  // Set and sort club's membersArr
  useEffect(() => {
    const newArr = Object.keys(members).map(memOId => members[memOId])
    if (memberSortBy === 'name') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return mem1.name.localeCompare(mem2.name)
        }
      })
    } // BLANK LINE COMMENT:
    else if (memberSortBy === 'nameReverse') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return mem2.name.localeCompare(mem1.name)
        }
      })
    } // BLANK LINE COMMENT:
    else if (memberSortBy === 'total') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return (
            (mem2.batterPower || 0) +
            (mem2.pitcherPower || 0) -
            ((mem1.batterPower || 0) + (mem1.pitcherPower || 0))
          )
        }
      })
    } // BLANK LINE COMMENT:
    else if (memberSortBy === 'totalReverse') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return (
            (mem1.batterPower || 0) +
            (mem1.pitcherPower || 0) -
            ((mem2.batterPower || 0) + (mem2.pitcherPower || 0))
          )
        }
      })
    } // BLANK LINE COMMENT:
    else if (memberSortBy === 'batterPower') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return (mem2.batterPower || 0) - (mem1.batterPower || 0)
        }
      })
    } // BLANK LINE COMMENT:
    else if (memberSortBy === 'batterPowerReverse') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return (mem1.batterPower || 0) - (mem2.batterPower || 0)
        }
      })
    } // BLANK LINE COMMENT:
    else if (memberSortBy === 'pitcherPower') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return (mem2.pitcherPower || 0) - (mem1.pitcherPower || 0)
        }
      })
    } // BLANK LINE COMMENT:
    else if (memberSortBy === 'pitcherPowerReverse') {
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return (mem1.pitcherPower || 0) - (mem2.pitcherPower || 0)
        }
      })
    } // BLANK LINE COMMENT:
    else {
      // 나머지 경우 : 투타 합 높은게 위로 오도록
      newArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return (
            (mem2.batterPower || 0) +
            (mem2.pitcherPower || 0) -
            ((mem1.batterPower || 0) + (mem1.pitcherPower || 0))
          )
        }
      })
    }
    setMembersArr(newArr)
  }, [members, memberSortBy])
  // Get weekRowsArr
  useEffect(() => {
    if (clubsArr.length > 0 && clubIdx !== null && clubIdx >= 0) {
      const clubOId = clubsArr[clubIdx || 0].clubOId
      const url = `/client/record/getWeekRowsArr/${clubOId}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeekRowsArr(body.weekRowsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    } // BLANK LINE COMMENT:
    else {
      // 탈퇴 멤버 페이지인 경우이다.
      setWeekRowsArr([])
    }
  }, [clubIdx, clubsArr])

  // prettier-ignore
  const value = {
    isAddMemModal, setIsAddMemModal,
    members, setMembers,
    membersArr, setMembersArr,
    memberSortBy, setMemberSortBy,
    weekRowsArr, setWeekRowsArr,

    addNextWeek,
    addPrevWeek
  }
  // BLANK LINE COMMENT:
  return <ClubContext.Provider value={value} children={<Outlet />} />
}
