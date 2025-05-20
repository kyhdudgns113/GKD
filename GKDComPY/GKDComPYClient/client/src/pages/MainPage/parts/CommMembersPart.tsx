import {useLocation, useNavigate} from 'react-router-dom'
import {createContext, CSSProperties, FC, useCallback, useContext, useEffect, useState} from 'react'
import {DivCommonProps, Setter} from '../../../common'
import {EntireMemberGroup} from '../groups'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {SetMemberInfoDataType} from '../../../common/typesAndValues/httpDataTypes'
import {getWithJwt, putWithJwt} from '../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {ModalSetEntireMember} from '../modals'

// prettier-ignore
type ContextType = {
  clubMembersArr: MemberInfoType[][], setClubMembersArr: Setter<MemberInfoType[][]>,
  commMembers: {[memOId: string]: MemberInfoType}, setCommMembers: Setter<{[memOId: string]: MemberInfoType}>,
  commMembersArr: MemberInfoType[], setCommMembersArr: Setter<MemberInfoType[]>,

  isEMemberModal: string, setIsEMemberModal: Setter<string>,

  setMemberInfo: (
    memOId: string,
    name: string,
    batterPower: number | null,
    pitcherPower: number | null,
    clubOId: string | null,
    comment: string
  ) =>void,

  sortEntireByBatter: () => void,
  sortEntireByClub: () => void,
  sortEntireByName: () => void,
  sortEntireByPitcher: () => void
  sortEntireByTotal: () => void,
}
// prettier-ignore
export const CommMembersContext = createContext<ContextType>({
  clubMembersArr: [], setClubMembersArr: () => {},
  commMembers: {}, setCommMembers: () => {},
  commMembersArr: [], setCommMembersArr: () => {},

  isEMemberModal: '', setIsEMemberModal: () => {},
  
  setMemberInfo: () => {},

  sortEntireByBatter: () => {},
  sortEntireByClub: () => {},
  sortEntireByName: () => {},
  sortEntireByPitcher: () => {},
  sortEntireByTotal: () => {}
})

export const useCommMembersContext = () => useContext(CommMembersContext)

type CommMembersPartProps = DivCommonProps & {}
export const CommMembersPart: FC<CommMembersPartProps> = ({className, style, ...props}) => {
  const {comm, setWhichList} = useTemplateStatesContext()

  // 각 클럽마다 멤버들의 배열이다.
  const [clubMembersArr, setClubMembersArr] = useState<MemberInfoType[][]>([])
  const [commMembers, setCommMembers] = useState<{[memOId: string]: MemberInfoType}>({})
  const [commMembersArr, setCommMembersArr] = useState<MemberInfoType[]>([])
  /* 전체 멤버 수정시 사용. memOId 값을 갖는다. */
  const [isEMemberModal, setIsEMemberModal] = useState<string>('')

  const location = useLocation()
  const navigate = useNavigate()

  const styleDiv: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '700px',
    overflowY: 'scroll',
    width: 'fit-content'
  }

  const setMemberInfo = useCallback(
    (
      memOId: string,
      name: string,
      batterPower: number | null,
      pitcherPower: number | null,
      clubOId: string | null,
      comment: string
    ) => {
      if (comm && comm.commOId) {
        const {commOId} = comm
        const url = `/client/main/setMemberInfo`
        const data: SetMemberInfoDataType = {
          commOId,
          memOId,
          name,
          batterPower,
          pitcherPower,
          clubOId,
          comment
        }
        putWithJwt(url, data)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              setCommMembers(body.entireMembers)
              setCommMembersArr(body.entireMembersArr)
              setClubMembersArr(body.clubMembersArr)
              writeJwtFromServer(jwtFromServer)
            } // BLANK LINE COMMENT:
            else {
              alertErrors(url + ' ELSE', errObj)
            }
          })
          .catch(errObj => alertErrors(url + ' CATCH', errObj))
      }
    },
    [comm]
  )
  const sortEntireByBatter = useCallback(() => {
    setCommMembersArr(prev => {
      const newPrev = [...prev]
      newPrev.sort((mem1, mem2) => {
        return (mem2.batterPower || 0) - (mem1.batterPower || 0)
      })
      return newPrev
    })
  }, [])
  const sortEntireByClub = useCallback(() => {
    setCommMembersArr(prev => {
      const newPrev: MemberInfoType[] = []
      for (let i = 1; i < clubMembersArr.length; i++) {
        const clubMembers = clubMembersArr[i]
        clubMembers.forEach((member, memIdx) => newPrev.push(member))
      }
      const clubMembers = clubMembersArr[0]
      clubMembers.forEach((member, memIdx) => newPrev.push(member))

      return newPrev
    })
  }, [clubMembersArr])
  const sortEntireByName = useCallback(() => {
    setCommMembersArr(prev => {
      const newPrev = [...prev]
      newPrev.sort((mem1, mem2) => {
        return mem1.name.localeCompare(mem2.name)
      })
      return newPrev
    })
  }, [])
  const sortEntireByPitcher = useCallback(() => {
    setCommMembersArr(prev => {
      const newPrev = [...prev]
      newPrev.sort((mem1, mem2) => {
        return (mem2.pitcherPower || 0) - (mem1.pitcherPower || 0)
      })
      return newPrev
    })
  }, [])
  const sortEntireByTotal = useCallback(() => {
    setCommMembersArr(prev => {
      const newPrev = [...prev]
      newPrev.sort((mem1, mem2) => {
        return (
          (mem2.pitcherPower || 0) +
          (mem2.batterPower || 0) -
          (mem1.pitcherPower || 0) -
          (mem1.batterPower || 0)
        )
      })
      return newPrev
    })
  }, [])

  // Set page name
  useEffect(() => {
    setWhichList('commMembers')
  }, [location, navigate, setWhichList])
  // Get member's objects
  useEffect(() => {
    if (comm && comm.commOId) {
      const {commOId} = comm
      const url = `/client/main/getEntireMembers/${commOId}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setCommMembers(body.entireMembers)
            setCommMembersArr(body.entireMembersArr)
            setClubMembersArr(body.clubMembersArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    } // BLANK LINE COMMENT:
    else {
      setCommMembers({})
      setCommMembersArr([])
      setClubMembersArr([])
    }
  }, [comm])

  // prettier-ignore
  const value = {
    clubMembersArr, setClubMembersArr,
    commMembers, setCommMembers,
    commMembersArr, setCommMembersArr,

    isEMemberModal, setIsEMemberModal,

    setMemberInfo,

    sortEntireByBatter,
    sortEntireByClub,
    sortEntireByName,
    sortEntireByPitcher,
    sortEntireByTotal
  }

  return (
    <CommMembersContext.Provider value={value}>
      <div className={`${className}`} style={styleDiv} {...props}>
        <EntireMemberGroup />

        {isEMemberModal && <ModalSetEntireMember />}
      </div>
    </CommMembersContext.Provider>
  )
}
