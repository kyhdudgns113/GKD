import {createContext, FC, PropsWithChildren, useContext, useState} from 'react'
import {DailyRecordType, WeeklyRecordType} from '../../../common/typesAndValues/shareTypes'
import {Setter} from '../../../common'

// prettier-ignore
type ContextType = {
  dateArr: number[], setDateArr: Setter<number[]>,
  keyDownEnter: boolean, setKeyDownEnter: Setter<boolean>,
  keyDownESC: boolean, setKeyDownESC: Setter<boolean>,

  selColIdx: number | null, setSelColIdx: Setter<number | null>,
  selCommentIdx: number | null, setSelCommentIdx: Setter<number | null>,
  selDate: number | null, setSelDate: Setter<number | null>,
  selDelWeek: string | null, setSelDelWeek: Setter<string | null>,
  selMemOId: string | null, setSelMemOId: Setter<string | null>,
  selModName: string, setSelModName: Setter<string>,
  selName: string, setSelName: Setter<string>,
  selCommentWOId: string, setSelCommentWOId: Setter<string>,
  selWeekOId: string, setSelWeekOId: Setter<string>,

  sumWeekCond: number, setSumWeekCond: Setter<number>,
  sumWeekDraw: number, setSumWeekDraw: Setter<number>,
  sumWeekLose: number, setSumWeekLose: Setter<number>,
  sumWeekMiss: number, setSumWeekMiss: Setter<number>,
  sumWeekChecked: number, setSumWeekChecked: Setter<number>,
  
  recordsArr: DailyRecordType[], setRecordsArr: Setter<DailyRecordType[]>,
  recordTable: {[name: string]: {[date: number]: DailyRecordType}}, setRecordTable: Setter<{[name: string]: {[date: number]: DailyRecordType}}>,
  weeklyRecord: WeeklyRecordType, setWeeklyRecord: Setter<WeeklyRecordType>,
  weekOId: string, setWeekOId: Setter<string>,
}
// prettier-ignore
export const ClubRecordStatesContext = createContext<ContextType>({
  dateArr: [], setDateArr: () => {},
  keyDownESC: false, setKeyDownESC: () => {},
  keyDownEnter: false, setKeyDownEnter: () => {},

  selColIdx: null, setSelColIdx: () => {},
  selCommentIdx: null, setSelCommentIdx: () => {},
  selDate: null, setSelDate: () => {},
  selDelWeek: null, setSelDelWeek: () => {},
  selMemOId: null, setSelMemOId: () => {},
  selModName: '', setSelModName: () => {},
  selName: '', setSelName: () => {},
  selCommentWOId: '', setSelCommentWOId: () => {},
  selWeekOId: '', setSelWeekOId: () => {},

  sumWeekCond: 0, setSumWeekCond: () => {},
  sumWeekDraw: 0, setSumWeekDraw: () => {},
  sumWeekLose: 0, setSumWeekLose: () => {},
  sumWeekMiss: 0, setSumWeekMiss: () => {},
  sumWeekChecked: 0, setSumWeekChecked: () => {},

  recordsArr: [], setRecordsArr: () => {},
  recordTable: {}, setRecordTable: () => {},
  weeklyRecord: {
    weekOId: '',
    clubOId: '',
    start: 0,
    end: 0,
    title: '',
    comment: '',
    rowInfo: {
      clubOId: '',
      membersInfo: []
    },
    colInfo: {
      clubOId: '',
      dateInfo: []
    }
  }, setWeeklyRecord: () => {},
  weekOId: '', setWeekOId: () => {},
})

export const useClubRecordStatesContext = () => useContext(ClubRecordStatesContext)

export const ClubRecordStates: FC<PropsWithChildren> = ({children}) => {
  const [dateArr, setDateArr] = useState<number[]>([])
  const [keyDownEnter, setKeyDownEnter] = useState<boolean>(false)
  const [keyDownESC, setKeyDownESC] = useState<boolean>(false)
  // 모달 띄울때 쓰인다.
  const [selDelWeek, setSelDelWeek] = useState<string | null>(null)
  const [selColIdx, setSelColIdx] = useState<number | null>(null)
  const [selCommentIdx, setSelCommentIdx] = useState<number | null>(null)
  const [selDate, setSelDate] = useState<number | null>(null)
  const [selMemOId, setSelMemOId] = useState<string | null>(null)
  const [selModName, setSelModName] = useState<string>('')
  const [selName, setSelName] = useState<string>('')
  const [selCommentWOId, setSelCommentWOId] = useState<string>('')
  const [selWeekOId, setSelWeekOId] = useState<string>('')
  // 주간 통계에 쓰인다.
  const [sumWeekCond, setSumWeekCond] = useState<number>(0)
  const [sumWeekDraw, setSumWeekDraw] = useState<number>(0)
  const [sumWeekLose, setSumWeekLose] = useState<number>(0)
  const [sumWeekMiss, setSumWeekMiss] = useState<number>(0)
  const [sumWeekChecked, setSumWeekChecked] = useState<number>(0)
  // 서버에서는 recordsArr 를 받자.
  // 이후 recordTable 로 클라이언트가 변환하자.
  // 그래야 서버 부담이 줄어든다.
  const [recordsArr, setRecordsArr] = useState<DailyRecordType[]>([])
  const [recordTable, setRecordTable] = useState<{
    [name: string]: {[date: number]: DailyRecordType}
  }>({})
  const [weeklyRecord, setWeeklyRecord] = useState<WeeklyRecordType>({
    weekOId: '',
    clubOId: '',
    start: 0,
    end: 0,
    title: '',
    comment: '',
    rowInfo: {
      clubOId: '',
      membersInfo: []
    },
    colInfo: {
      clubOId: '',
      dateInfo: []
    }
  })
  const [weekOId, setWeekOId] = useState<string>('')

  // prettier-ignore
  const value = {
    dateArr, setDateArr,
    keyDownEnter, setKeyDownEnter,
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
  }
  return (
    <ClubRecordStatesContext.Provider value={value}>{children}</ClubRecordStatesContext.Provider>
  )
}
