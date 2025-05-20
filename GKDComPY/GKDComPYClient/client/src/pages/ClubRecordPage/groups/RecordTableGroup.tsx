import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {SAKURA_BORDER, TableCommonProps} from '../../../common'
import {
  TBodyBottomBlock,
  TBodyDailyStatBlock,
  TBodyRowBlock,
  TBodyWeekCommentBlock,
  THeadBlock
} from '../blocks'
import {useClubRecordStatesContext} from '../_contexts'
import {Icon} from '../../../common/components'

type RecordTableGroupProps = TableCommonProps & {}
export const RecordTableGroup: FC<RecordTableGroupProps> = ({className, ...props}) => {
  const {weeklyRecord, weekOId, setSelWeekOId} = useClubRecordStatesContext()

  const styleAddMember: CSSProperties = {
    borderWidth: '6px',
    borderColor: SAKURA_BORDER
  }
  const styleTable: CSSProperties = {
    alignContent: 'center',
    borderCollapse: 'collapse',
    borderColor: SAKURA_BORDER,
    borderWidth: '6px',

    flexShrink: 0,
    marginTop: '10px',
    tableLayout: 'auto',
    textAlign: 'center',
    minWidth: 'fit-content'
  }

  const onClickAddMember = useCallback(
    (weekOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      setSelWeekOId(weekOId)
    },
    [setSelWeekOId]
  )

  return (
    <table className={`RECORD_TABLE_GROUP ${className || ''}`} style={styleTable}>
      {/* 머리 : 카테고리, 일간정보 등등 */}
      <THeadBlock />

      <tbody className={`text-sm`}>
        {/* 몸통 : 멤버별 기록 */}
        {weeklyRecord.rowInfo.membersInfo.map((memInfo, memIdx) => {
          const cnBd =
            memIdx % 10 === 9
              ? 'border-b-4 border-blue-500 '
              : memIdx % 5 === 4
              ? 'border-b-4 border-green-500 '
              : ''
          return <TBodyRowBlock className={cnBd} key={`memRow:${memIdx}`} memInfo={memInfo} />
        })}

        {/* 허리 : 행들의 통계 */}
        <TBodyDailyStatBlock />

        {/* 하체 : 행 추가 + 주간 코멘트 */}
        <tr>
          {/* 주간 코멘트 */}
          <TBodyWeekCommentBlock />
          {/* 멤버 추가 */}
          <td colSpan={5} style={styleAddMember}>
            <Icon
              className="select-none cursor-pointer "
              iconName="add_circle"
              onClick={onClickAddMember(weekOId)}
            />
          </td>
          {/* 날짜별 코멘트 및 멤버추가 라인 */}
          {weeklyRecord.colInfo.dateInfo.map((dayInfo, dayIdx) => (
            <TBodyBottomBlock dayInfo={dayInfo} dayIdx={dayIdx} key={`dateComment:${dayIdx}`} />
          ))}
        </tr>
      </tbody>
    </table>
  )
}
