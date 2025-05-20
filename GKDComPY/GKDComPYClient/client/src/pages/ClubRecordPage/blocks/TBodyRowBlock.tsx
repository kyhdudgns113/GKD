import React, {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {TableRowCommonProps} from '../../../common'
import {RecordMemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {useClubRecordStatesContext} from '../_contexts'
import {Crown} from '../../../common/components/FontAwesome'

type TBodyRowBlockProps = TableRowCommonProps & {
  memInfo: RecordMemberInfoType
}
export const TBodyRowBlock: FC<TBodyRowBlockProps> = ({memInfo, className, ...props}) => {
  const {dateArr, recordTable, setSelDate, setSelMemOId, setSelModName, setSelName} =
    useClubRecordStatesContext()

  const [condErrs, setCondErrs] = useState<string[]>([])
  const [gameResults, setGameResults] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ])
  const [isHover, setIsHover] = useState<boolean>(false)
  const [memComments, setMemComments] = useState<boolean[]>([])
  const [name, setName] = useState<string>('')
  const [sumCond, setSumCond] = useState<number>(0)
  const [sumDraw, setSumDraw] = useState<number>(0)
  const [sumLose, setSumLose] = useState<number>(0)
  const [sumMiss, setSumMiss] = useState<number>(0)
  const [sumChecked, setSumChecked] = useState<number>(0)

  const cnBd = 'border-gkd-sakura-border border-2 text-gkd-sakura-text'
  const cnCt = 'w-[28px]'

  const styleV: CSSProperties = {
    borderRightWidth: '4px'
  }

  const onClickModifyModal = useCallback(
    (memInfo: RecordMemberInfoType) => (e: MouseEvent<HTMLTableCellElement>) => {
      setSelModName(memInfo.name)
      setSelMemOId(memInfo.memOId)
    },
    [setSelMemOId, setSelModName]
  )
  const onClickRecordModal = useCallback(
    (memInfo: RecordMemberInfoType, date: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      setSelMemOId(memInfo.memOId)
      setSelName(memInfo.name)
      setSelDate(date)
    },
    [setSelDate, setSelMemOId, setSelName]
  )
  const onMouseEnterRow = useCallback((e: MouseEvent<HTMLTableRowElement>) => {
    setIsHover(true)
  }, [])
  const onMouseLeaveRow = useCallback((e: MouseEvent<HTMLTableRowElement>) => {
    setIsHover(false)
  }, [])

  // Init state
  useEffect(() => {
    setIsHover(false)
  }, [])
  // Set name
  useEffect(() => {
    setName(memInfo.name)
  }, [memInfo])
  // Set chart elements & sums
  useEffect(() => {
    if (name && dateArr.length > 0) {
      const newCondErrs = Array(6).fill(null)
      const newGameResults = Array(6)
        .fill(null)
        .map(() => [' ', ' ', ' '])
      const newMemComments = Array(6).fill(false)
      for (let i = 0; i < 6; i++) {
        const memRecord = recordTable[name]
        if (memRecord) {
          const dailyRecord = memRecord[dateArr[i]]
          if (dailyRecord) {
            // Set condErrors
            if (dailyRecord.condError > 0) {
              newCondErrs[i] = 'X'
              setSumCond(prev => prev + 1)
            }

            // Set gameResults
            for (let j = 0; j < 3; j++) {
              switch (dailyRecord.recordsArr[j].result) {
                case 0:
                  newGameResults[i][j] = ''
                  break
                case 1:
                  newGameResults[i][j] = '무'
                  setSumDraw(prev => prev + 1)
                  break
                case 2:
                  newGameResults[i][j] = '패'
                  setSumLose(prev => prev + 1)
                  break
                case 3:
                  newGameResults[i][j] = 'X'
                  setSumMiss(prev => prev + 1)
                  break
                case 4:
                  newGameResults[i][j] = '△'
                  break
                default:
                  newGameResults[i][j] = '?'
                  break
              }
            }

            // Set sumChecked
            if (dailyRecord.comment.length > 0) {
              setSumChecked(prev => prev + 1)
            }

            // --- end Set gameResults
            newMemComments[i] = dailyRecord.comment ? true : false
          }
        }
      }
      setCondErrs(newCondErrs)
      setGameResults(newGameResults)
      setMemComments(newMemComments)
    }

    return () => {
      setSumChecked(0)
      setSumCond(0)
      setSumDraw(0)
      setSumLose(0)
      setSumMiss(0)
    }
  }, [dateArr, name, recordTable])

  return (
    <tr
      className={` ${className}` + (isHover ? ' bg-gkd-sakura-bg ' : ' ')}
      onMouseEnter={onMouseEnterRow}
      onMouseLeave={onMouseLeaveRow}
      {...props} // BLANK LINE COMMENT:
    >
      {/* 멤버 주간 통계 */}
      <td className={`${cnBd} ${cnCt}`}>{sumCond > 0 ? sumCond : ''}</td>
      <td className={`${cnBd} ${cnCt}`}>{sumDraw > 0 ? sumDraw : ''}</td>
      <td className={`${cnBd} ${cnCt}`}>{sumLose > 0 ? sumLose : ''}</td>
      <td className={`${cnBd} ${cnCt}`}>{sumMiss > 0 ? sumMiss : ''}</td>
      <td className={`${cnBd} ${cnCt}`} style={styleV}>
        {sumChecked > 0 ? sumChecked : ''}
      </td>

      {/* 왕관 여부 */}
      <td className={`${cnBd}`} onClick={onClickModifyModal(memInfo)}>
        {memInfo.position === 2 ? (
          <Crown className="text-yellow-500" />
        ) : memInfo.position === 1 ? (
          <Crown className="text-gray-500" />
        ) : (
          ''
        )}
      </td>

      {/* 닉네임 */}
      <td className={` ${cnBd}`} onClick={onClickModifyModal(memInfo)}>
        {memInfo.name}
      </td>

      {/* 타자력 */}
      <td className={` ${cnBd}`} onClick={onClickModifyModal(memInfo)}>
        {memInfo.batterPower?.toLocaleString()}
      </td>

      {/* 투수력 */}
      <td className={` ${cnBd}`} onClick={onClickModifyModal(memInfo)}>
        {memInfo.pitcherPower?.toLocaleString()}
      </td>

      {/* 전투력 */}
      <td
        className={` ${cnBd}`}
        onClick={onClickModifyModal(memInfo)}
        style={{borderRightWidth: '6px'}}>
        {((memInfo.batterPower || 0) + (memInfo.pitcherPower || 0)).toLocaleString()}
      </td>

      {/* 일자별 기록 표기 */}
      {Array(6)
        .fill(null)
        .map((_, dayIdx) => {
          const date = dateArr[dayIdx]
          const recordRow = recordTable[memInfo.name]
          const record = recordRow ? recordRow[date] : null
          const isNull =
            record?.recordsArr[0].result === 4 ||
            record?.recordsArr[1].result === 4 ||
            record?.recordsArr[2].result === 4
          const cnBgNull = isNull ? 'bg-gray-300' : ''

          return (
            // td 들만 모아놔야 하는데, key 값을 넣어줘야 한다.
            // 그래서 React.Fragment 를 썼다.
            <React.Fragment key={`tdDay:${dayIdx}`}>
              <td className={`${cnBgNull} ${cnBd}`} onClick={onClickRecordModal(memInfo, date)}>
                {condErrs[dayIdx] || ' '}
              </td>
              <td className={`${cnBgNull} ${cnBd}`} onClick={onClickRecordModal(memInfo, date)}>
                {gameResults[dayIdx][0] || ' '}
              </td>
              <td className={`${cnBgNull} ${cnBd}`} onClick={onClickRecordModal(memInfo, date)}>
                {gameResults[dayIdx][1] || ' '}
              </td>
              <td className={`${cnBgNull} ${cnBd}`} onClick={onClickRecordModal(memInfo, date)}>
                {gameResults[dayIdx][2] || ' '}
              </td>
              <td
                className={`${cnBgNull} ${cnBd}`}
                style={{borderRightWidth: '6px'}}
                onClick={onClickRecordModal(memInfo, date)} // BLANK LINE COMMENT:
              >
                {memComments[dayIdx] && 'V'}
              </td>
            </React.Fragment>
          )
        })}
    </tr>
  )
}
