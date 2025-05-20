import {CSSProperties, FC, useEffect, useState} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../common'
import {DailyRecordType, MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {getWithJwt} from '../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {RecentRecord} from '../addons'

type MemberRecentBlockProps = DivCommonProps & {
  member: MemberInfoType
}
export const MemberRecentBlock: FC<MemberRecentBlockProps> = ({member, className, ...props}) => {
  const [dailyRecordsArr, setDailyRecordsArr] = useState<DailyRecordType[]>([])
  const [dateRange, setDateRange] = useState<number>(0)

  const styleCategoryRow: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '4px',
    color: '#F89890',
    fontWeight: 700,
    textAlign: 'center'
  }
  const styleCDate: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '4.5rem'
  }
  const styleCCond: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '2rem'
  }
  const styleDiv: CSSProperties = {
    marginTop: '16px'
  }
  const styleTable: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '4px',
    width: '100%'
  }
  const styleTitleRow: CSSProperties = {
    borderCollapse: 'collapse',
    borderColor: SAKURA_BORDER,
    borderWidth: '4px',
    color: '#F89890',
    fontWeight: 700,
    textAlign: 'center'
  }
  const styleTitleRowD: CSSProperties = {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    paddingTop: '4px',
    paddingBottom: '4px'
  }

  const NullJsx = () => {
    return (
      <div className={`${className}`} style={styleDiv} {...props}>
        <p>최근 {dateRange}일간 기록이 없어요.</p>
      </div>
    )
  }

  // Init states
  useEffect(() => {
    setDailyRecordsArr([])
    setDateRange(112)
  }, [])
  // Get dailyRecordsArr
  useEffect(() => {
    if (dateRange > 0 && member) {
      const url = `/client/club/getMemberRecordsArr/${member.memOId}/${dateRange}`

      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            writeJwtFromServer(jwtFromServer)
            setDailyRecordsArr(body.dailyRecordsArr)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    }
  }, [dateRange, member])

  if (dailyRecordsArr.length === 0) return NullJsx()

  return (
    <div className={`${className}`} style={styleDiv} {...props}>
      <table style={styleTable}>
        {/* 테이블 헤드 */}
        <thead>
          {/* 테이블 제목 */}
          <tr style={styleTitleRow}>
            <td colSpan={7} style={styleTitleRowD}>
              최근 기록
            </td>
          </tr>
          {/* 카테고리들 */}
          <tr style={styleCategoryRow}>
            <td style={styleCDate}>날짜</td>
            <td style={styleCCond}>컨</td>
            <td style={styleCCond}>무</td>
            <td style={styleCCond}>패</td>
            <td style={styleCCond}>미</td>
            <td style={styleCCond}>?</td>
            <td>클럽</td>
          </tr>
        </thead>
        {/* 테이블 바디 */}
        <tbody>
          {dailyRecordsArr.map((dailyRecord, rIdx) => (
            <RecentRecord dailyRecord={dailyRecord} key={`key${rIdx}`} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
