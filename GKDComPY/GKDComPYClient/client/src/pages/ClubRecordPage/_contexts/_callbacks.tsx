import {FC, useCallback} from 'react'

import {createContext, PropsWithChildren} from 'react'

import {useContext} from 'react'
import {postWithJwt} from '../../../common/server'
import {useClubContext} from '../../../contexts'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {
  DeleteRowMemDataType,
  DeleteWeekRowDataType,
  AddRowMemberDataType,
  SetCommentDataType,
  SetDailyRecordType,
  SetRowMemberDataType,
  SetTHeadDataType
} from '../../../common/typesAndValues/httpDataTypes'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {putWithJwt} from '../../../common/server'
import {useClubRecordStatesContext} from './__states'

// prettier-ignore
type ContextType = {
  deleteMember: (name: string) => void,
  deleteRowWeek: (weekOId: string) => void,
  setWeekComment: (weekOId: string, comment: string) => void,

  submitAddMember: (
    weekOId: string,
    position: number,
    name: string,
    batterPower: number,
    pitcherPower: number
  ) => void
  submitComments: (dayIdx: number, comments: string) => void,
  submitRecord: (selDate: number, selName: string, condError: number, results: number[], comment: string, memOId: string | null) => void
  submitSetMember: (prevName: string, position: number, name: string, batterPower: number, pitcherPower: number, memOId: string | null) => void
  submitTHead: (dateIdx: number, enemyName: string, pitchOrder: number | null, order: string) => void
}
// prettier-ignore
export const ClubRecordCallbacksContext = createContext<ContextType>({
  deleteMember: () => {},
  deleteRowWeek: () => {},
  setWeekComment: () => {},


  submitAddMember: () => {},
  submitComments: () => {},
  submitRecord: () => {},
  submitSetMember: () => {},
  submitTHead: () => {}
})

export const useClubRecordCallbacksContext = () => useContext(ClubRecordCallbacksContext)

export const ClubRecordCallbacks: FC<PropsWithChildren> = ({children}) => {
  const {clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext()
  const {setWeekRowsArr} = useClubContext()

  /* eslint-disable */
  // prettier-ignore
  const {
    dateArr, setDateArr,
    keyDownESC, setKeyDownESC,

    selColIdx, setSelColIdx,
    selCommentIdx, setSelCommentIdx,
    selDate, setSelDate,
    selDelWeek, setSelDelWeek,
    selMemOId, setSelMemOId,
    selModName, setSelModName,
    selName, setSelName,
    selCommentWOId, setSelCommentWOId,
    selWeekOId, setSelWeekOId,

    sumWeekCond, setSumWeekCond,
    sumWeekDraw, setSumWeekDraw,
    sumWeekLose, setSumWeekLose,
    sumWeekMiss, setSumWeekMiss,
    sumWeekChecked, setSumWeekChecked,

    recordsArr, setRecordsArr,
    recordTable, setRecordTable,
    weeklyRecord, setWeeklyRecord,
    weekOId, setWeekOId,
  } = useClubRecordStatesContext()
  /* eslint-enable */

  const deleteMember = useCallback(
    (name: string) => {
      const url = `/client/record/deleteRowMem`
      const data: DeleteRowMemDataType = {weekOId, name}
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeeklyRecord(body.weeklyRecord)
            setRecordsArr(body.recordsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [weekOId, setRecordsArr, setWeeklyRecord]
  )
  const deleteRowWeek = useCallback(
    (weekOId: string) => {
      /**
       * 클라이언트에서 인덱스 0, -1 아닌거 쳐내면 안된다 \
       * 누가 지웠는데 그거 또 지우려고 시도하게 될 수도 있다 \
       */
      if (weekOId && clubsArr.length > 1 && clubIdx) {
        const clubOId = clubsArr[clubIdx].clubOId
        const url = `/client/record/deleteWeekRow`
        const data: DeleteWeekRowDataType = {clubOId, weekOId}
        putWithJwt(url, data)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res

            if (ok) {
              writeJwtFromServer(jwtFromServer)
              setWeekRowsArr(body.weekRowsArr)
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`${url} ELSE`, errObj)
            }
          })
          .catch(errObj => alertErrors(`${url} CATCH`, errObj))
      }
    },
    [clubsArr, clubIdx, setWeekRowsArr]
  )
  const setWeekComment = useCallback(
    (weekOId: string, comment: string) => {
      const url = '/client/record/setWeekComment'
      const data = {weekOId, comment}
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeeklyRecord(body.weeklyRecord)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setWeeklyRecord]
  )
  const submitAddMember = useCallback(
    (
      weekOId: string,
      position: number,
      name: string,
      batterPower: number,
      pitcherPower: number
    ) => {
      const url = `/client/record/addRowMember`
      const data: AddRowMemberDataType = {weekOId, position, name, batterPower, pitcherPower}
      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeeklyRecord(body.weeklyRecord)
            setRecordsArr(body.recordsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setRecordsArr, setWeeklyRecord]
  )
  const submitComments = useCallback(
    (dayIdx: number, comments: string) => {
      const data: SetCommentDataType = {weekOId, dayIdx, comments}
      const url = `/client/record/setComments`
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeeklyRecord(body.weeklyRecord)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} CATCH`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [weekOId, setWeeklyRecord]
  )
  const submitRecord = useCallback(
    (
      selDate: number,
      selName: string,
      condError: number,
      results: number[],
      comment: string,
      memOId: string | null
    ) => {
      const clubOId = clubsArr[clubIdx || 0].clubOId
      const data: SetDailyRecordType = {
        clubOId,
        start: weeklyRecord.start,
        end: weeklyRecord.end,
        date: selDate,
        name: selName,
        condError,
        results,
        comment,
        memOId
      }
      const url = `/client/record/submitRecord`
      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setRecordsArr(body.recordsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [clubsArr, clubIdx, weeklyRecord, setRecordsArr]
  )
  const submitSetMember = useCallback(
    (
      prevName: string,
      position: number,
      name: string,
      batterPower: number,
      pitcherPower: number,
      memOId: string | null
    ) => {
      const url = `/client/record/setRowMember`
      const data: SetRowMemberDataType = {
        weekOId,
        prevName,
        position,
        name,
        batterPower,
        pitcherPower,
        memOId
      }
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeeklyRecord(body.weeklyRecord)
            setRecordsArr(body.recordsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [weekOId, setRecordsArr, setWeeklyRecord]
  )
  const submitTHead = useCallback(
    (dateIdx: number, enemyName: string, pitchOrder: number | null, order: string) => {
      const clubOId = clubsArr[clubIdx || 0].clubOId
      const data: SetTHeadDataType = {clubOId, weekOId, dateIdx, enemyName, pitchOrder, order}
      const url = `/client/record/setTHead`
      postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeeklyRecord(body.weeklyRecord)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [clubIdx, clubsArr, weekOId, setWeeklyRecord]
  )

  // prettier-ignore
  const value = {
    deleteMember,
    deleteRowWeek,
    setWeekComment,

    submitAddMember,
    submitComments,
    submitRecord,
    submitSetMember,
    submitTHead
  }

  return (
    <ClubRecordCallbacksContext.Provider value={value}>
      {children}
    </ClubRecordCallbacksContext.Provider>
  )
}
