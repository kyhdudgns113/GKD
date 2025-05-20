import {createContext, useCallback, useContext} from 'react'
import {useEntireMemberStatesContext} from './__states'
import {writeJwtFromServer} from '../../../common/utils'
import {alertErrors} from '../../../common/utils/alertErrors'
import {getWithJwt} from '../../../common/server/getAndDel'
import {putWithJwt} from '../../../common/server/postAndPut'
import {SetEMemMatrixDataType} from '../../../common/typesAndValues/httpDataTypes'

// prettier-ignore
type ContextType = {
  dropElement: (rowIdx: number, colIdx: number) => void
  loadData: (commOId: string) => void
  saveArr: (commOId: string) => void
  setClub: (commOId: string) => void
  sortColumnArr: (colIdx: number, sortBy: string) => void
}
// prettier-ignore
export const EntireMemberCallbacksContext = createContext<ContextType>({
  dropElement:  () => {},
  loadData: () => {},
  setClub: () => {},
  saveArr: () => {},
  sortColumnArr: () => {}
})

export const useEntireMemberCallbacksContext = () => useContext(EntireMemberCallbacksContext)

export function EntireMemberCallbacks({children}: {children: React.ReactNode}) {
  const {dragColIdx, setDragColIdx, dragRowIdx, setDragRowIdx, eMembersMatrix, setEMembersMatrix} =
    useEntireMemberStatesContext()

  const dropElement = useCallback(
    (rowIdx: number, colIdx: number) => {
      if (dragColIdx !== null && dragRowIdx !== null) {
        setEMembersMatrix(prev => {
          const newPrev = prev.map(row => [...row])
          const member = newPrev[dragColIdx][dragRowIdx]
          newPrev[dragColIdx].splice(dragRowIdx, 1)
          newPrev[colIdx].splice(rowIdx, 0, member)
          return newPrev
        })
      }

      setDragColIdx(null)
      setDragRowIdx(null)
    },
    [dragColIdx, dragRowIdx, setDragColIdx, setDragRowIdx, setEMembersMatrix]
  )
  const loadData = useCallback(
    (commOId: string) => {
      const url = `/client/members/loadData/${commOId}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setEMembersMatrix(body.eMembersMatrix)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setEMembersMatrix]
  )
  const setClub = useCallback(
    (commOId: string) => {
      const url = `/client/members/getMembers/${commOId}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setEMembersMatrix(body.eMembersMatrix)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setEMembersMatrix]
  )
  const saveArr = useCallback(
    (commOId: string) => {
      const url = `/client/members/saveMatrix`
      const data: SetEMemMatrixDataType = {commOId, eMembersMatrix}
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, errObj, jwtFromServer} = res
          if (ok) {
            // NOTE: 이미 여기서 바꿨기 때문에 추가로 받아오지 않는다.
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [eMembersMatrix]
  )
  const sortColumnArr = useCallback(
    (colIdx: number, sortBy: string) => {
      setEMembersMatrix(prev => {
        const newPrev = prev.map(row => [...row])
        newPrev[colIdx].sort((a, b) => {
          if (sortBy === 'name') {
            return a.name.localeCompare(b.name)
          } // BLANK LINE COMMENT:
          else if (sortBy === 'nameReverse') {
            return b.name.localeCompare(a.name) || 0
          } // BLANK LINE COMMENT:
          else if (sortBy === 'pitcherPower') {
            return (b.pitcherPower || 0) - (a.pitcherPower || 0)
          } // BLANK LINE COMMENT:
          else if (sortBy === 'pitcherPowerReverse') {
            return (a.pitcherPower || 0) - (b.pitcherPower || 0)
          } // BLANK LINE COMMENT:
          else if (sortBy === 'totalPower') {
            return (
              (b.batterPower || 0) +
              (b.pitcherPower || 0) -
              (a.batterPower || 0) -
              (a.pitcherPower || 0)
            )
          } // BLANK LINE COMMENT:
          else if (sortBy === 'totalPowerReverse') {
            return (
              (a.batterPower || 0) +
              (a.pitcherPower || 0) -
              (b.batterPower || 0) -
              (b.pitcherPower || 0)
            )
          } else {
            // 아무것도 아니면 총 전력순으로 정렬한다.
            return (
              (b.batterPower || 0) +
              (b.pitcherPower || 0) -
              (a.batterPower || 0) -
              (a.pitcherPower || 0)
            )
          }
        })
        return newPrev
      })
    },
    [setEMembersMatrix]
  )
  // prettier-ignore
  const value = {
    dropElement,
    loadData,
    setClub,
    saveArr,
    sortColumnArr
  }
  return (
    <EntireMemberCallbacksContext.Provider value={value}>
      {children}
    </EntireMemberCallbacksContext.Provider>
  )
}
