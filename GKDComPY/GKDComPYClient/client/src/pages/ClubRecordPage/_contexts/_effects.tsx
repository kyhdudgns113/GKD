import {createContext, FC, PropsWithChildren, useContext, useEffect} from 'react'
import {getWithJwt} from '../../../common/server'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {DailyRecordType} from '../../../common/typesAndValues/shareTypes'
import {alertErrors, shiftDateValue, writeJwtFromServer} from '../../../common/utils'
import {useClubRecordStatesContext} from './__states'
import {useLocation, useNavigate} from 'react-router-dom'
type ContextType = {}
export const ClubRecordEffectsContext = createContext<ContextType>({})

export const useClubRecordEffectsContext = () => useContext(ClubRecordEffectsContext)

export const ClubRecordEffects: FC<PropsWithChildren> = ({children}) => {
  const {setWhichList} = useTemplateStatesContext()
  const {clubsArr, selectedClubIdx: clubIdx, setSelectedClubIdx} = useTemplateStatesContext()

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

  const location = useLocation()
  const navigate = useNavigate()

  // 이걸 해야 주간 대전기록 화면이 초기화 된다.
  useEffect(() => {
    setWeekOId('')
  }, [clubIdx, setWeekOId])
  // Set page name
  useEffect(() => {
    if (clubsArr.length > 0) {
      const newSelClubIdx = parseInt(location.pathname.split('client/club/record/')[1])
      if (newSelClubIdx === 0 || newSelClubIdx >= clubsArr.length) {
        alert('이런거 하지 말아주세요 ㅠㅠ')
        navigate('/')
      }
      setSelectedClubIdx(newSelClubIdx)
      setWhichList('record')
    }
  }, [clubsArr, location, navigate, setSelectedClubIdx, setWhichList])
  // Set week table info
  useEffect(() => {
    if (weekOId) {
      getWithJwt(`/client/record/getWeeklyRecord/${weekOId}`)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setWeeklyRecord(body.weeklyRecord)
            setRecordsArr(body.recordsArr)
            const start = body.weeklyRecord.start
            setDateArr([
              start,
              shiftDateValue(start, 1),
              shiftDateValue(start, 2),
              shiftDateValue(start, 3),
              shiftDateValue(start, 4),
              shiftDateValue(start, 5)
            ])
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/client/club/getWeeklyRecord ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`/client/club/getWeeklyRecord CATCH`, errObj))
    }
  }, [weekOId, setDateArr, setRecordsArr, setWeeklyRecord])
  // recordsArr -> recordTable
  useEffect(() => {
    if (recordsArr.length > 0) {
      const newTable: {[name: string]: {[date: number]: DailyRecordType}} = {}
      recordsArr.forEach(record => {
        const {date, name} = record
        if (!newTable[name]) {
          newTable[name] = {}
        }
        newTable[name][date] = record
      })
      setRecordTable(newTable)
    }
  }, [recordsArr, setRecordTable])
  const value = {}
  return (
    <ClubRecordEffectsContext.Provider value={value}>{children}</ClubRecordEffectsContext.Provider>
  )
}
