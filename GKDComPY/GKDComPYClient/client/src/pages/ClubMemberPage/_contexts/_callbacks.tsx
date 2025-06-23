import {createContext, useContext, FC, PropsWithChildren, useCallback} from 'react'
import {alertErrors} from '../../../common/utils'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {useClubContext} from '../../../contexts'
import {
  ChangeMemClubDataType,
  SetCardInfoDataType,
  SetMemberCommentDataType
} from '../../../common/typesAndValues/httpDataTypes'
import {delWithJwt, putWithJwt} from '../../../common/server'
import {writeJwtFromServer} from '../../../common/utils'

// prettier-ignore
type ContextType = {
  changeClub: (memOId: string, clubOId: string) => void,
  changeMemberComment: (memOId: string, newComment: string) => void,
  deleteMember: (memOId: string) => void,
  setCardInfo: (memOId: string, posIdx: number, name: string, skillIdxs: number[], skillLevels: number[]) => void
}
// prettier-ignore
export const ClubMemberCallbacksContext = createContext<ContextType>({
  changeClub: () => {},
  changeMemberComment: () => {},
  deleteMember: () => {},
  setCardInfo: () => {},
})

export const useClubMemberCallbacksContext = () => useContext(ClubMemberCallbacksContext)

export const ClubMemberCallbacks: FC<PropsWithChildren> = ({children}) => {
  const {clubsArr, comm, selectedClubIdx} = useTemplateStatesContext()
  const {setMembers} = useClubContext()

  const changeClub = useCallback(
    (memOId: string, clubOId: string) => {
      const data: ChangeMemClubDataType = {memOId, clubOId}
      const url = `/client/club/member/changeClub`
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setMembers(body.members)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setMembers]
  )
  const changeMemberComment = useCallback(
    (memOId: string, newComment: string) => {
      if (clubsArr.length > 0 && selectedClubIdx !== null) {
        let clubOId = ''
        if (selectedClubIdx >= 0) {
          clubOId = clubsArr[selectedClubIdx].clubOId
        } else {
          clubOId = comm.banClubOId
        }
        const url = `/client/club/setMemComment`
        const data: SetMemberCommentDataType = {
          clubOId,
          memOId,
          memberComment: newComment
        }
        putWithJwt(url, data)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              writeJwtFromServer(jwtFromServer)
              setMembers(body.members)
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`${url} ELSE`, errObj)
            }
          })
          .catch(errObj => alertErrors(`${url} CATCH`, errObj))
      }
    },
    [clubsArr, selectedClubIdx, setMembers]
  )
  const deleteMember = useCallback(
    (memOId: string) => {
      const club = clubsArr[selectedClubIdx || 0]
      if (club) {
        const clubOId = club.clubOId
        const url = `/client/club/deleteMem/${clubOId}/${memOId}`
        delWithJwt(url)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              setMembers(body.members)
              writeJwtFromServer(jwtFromServer)
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`${url} ELSE`, errObj)
            }
          })
          .catch(errObj => alertErrors(`${url} CATCH`, errObj))
      }
    },
    [clubsArr, selectedClubIdx, setMembers]
  )
  const setCardInfo = useCallback(
    (memOId: string, posIdx: number, name: string, skillIdxs: number[], skillLevels: number[]) => {
      const data: SetCardInfoDataType = {memOId, posIdx, name, skillIdxs, skillLevels}
      const url = `/client/club/member/setCardInfo`
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setMembers(body.members)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setMembers]
  )

  // prettier-ignore
  const value = {
    changeClub,
    changeMemberComment,
    deleteMember,
    setCardInfo
  }
  return (
    <ClubMemberCallbacksContext.Provider value={value}>
      {children}
    </ClubMemberCallbacksContext.Provider>
  )
}
