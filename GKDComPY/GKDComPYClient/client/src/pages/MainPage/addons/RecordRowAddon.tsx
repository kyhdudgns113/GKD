import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {SAKURA_BORDER, TableRowCommonProps} from '../../../common'
import {DailyRecordType} from '../../../common/typesAndValues/shareTypes'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {RecordComment} from '../addon/RecordComment'

type RecordRowAddonProps = TableRowCommonProps & {
  mentWidth: number
  record: DailyRecordType
}

export const RecordRowAddon: FC<RecordRowAddonProps> = ({
  mentWidth,
  record,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {clubsArr} = useTemplateStatesContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const styleAlphaRow: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',

    color: '#F89890',
    // position: 'relative',
    textAlign: 'center'
  }
  const styleDate: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px'
  }
  const styleMent: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    position: 'relative',
    userSelect: 'none',
    width: `${mentWidth}px`
  }

  const onEnter = useCallback((e: MouseEvent<HTMLTableCellElement>) => {
    setIsHover(true)
  }, [])
  const onLeave = useCallback((e: MouseEvent<HTMLTableCellElement>) => {
    setIsHover(false)
  }, [])
  const clubName = useCallback(
    (clubOId: string) => {
      for (let club of clubsArr) {
        if (club.clubOId === clubOId) {
          return club.name
        }
      }
      return 'ERR'
    },
    [clubsArr]
  )
  const resultVal = useCallback((result: number) => {
    switch (result) {
      case 0:
        return ''
      case 1:
        return '무'
      case 2:
        return '패'
      case 3:
        return '미'
      case 4:
        return ''
      case 5:
        return '△'
      default:
        return ''
    }
  }, [])

  return (
    <tr className={`border-gkd-sakura-border ${className}`} style={styleAlphaRow} {...props}>
      {/* 날짜 */}
      <td style={styleDate}>{record.date}</td>

      {/* 컨장유 */}
      <td style={styleDate}>{record.condError > 0 ? 'X' : ''}</td>

      {/* 대전기록 1 */}
      <td style={styleDate}>{resultVal(record.recordsArr[0].result)}</td>

      {/* 대전기록 2 */}
      <td style={styleDate}>{resultVal(record.recordsArr[1].result)}</td>

      {/* 대전기록 3 */}
      <td style={styleDate}>{resultVal(record.recordsArr[2].result)}</td>

      {/* 코멘트 */}
      <td onMouseEnter={onEnter} onMouseLeave={onLeave} style={styleMent}>
        {record.comment ? 'V' : ''}
        {/* 모달: 코멘트 */}
        {isHover && record && record.comment && <RecordComment comment={record.comment} />}
      </td>

      {/* 클럽 이름 */}
      <td>{clubName(record.clubOId)}</td>
    </tr>
  )
}
