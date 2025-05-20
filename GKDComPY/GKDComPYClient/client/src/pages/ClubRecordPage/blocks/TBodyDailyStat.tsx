import {CSSProperties, FC, useEffect, useState} from 'react'
import {SAKURA_BORDER, TableCellCommonProps} from '../../../common'
import {useClubRecordStatesContext} from '../_contexts'
import {TextLG} from '../../../common/components'

type DailyStateType = {
  sumCondJangYu: number
  sumDraw: number
  sumLose: number
  sumMiss: number
}

type TBodyDailyStatProps = TableCellCommonProps & {}
export const TBodyDailyStat: FC<TBodyDailyStatProps> = ({className, ...props}) => {
  const {recordTable, weeklyRecord} = useClubRecordStatesContext()

  const [dailyStats, setDailyState] = useState<DailyStateType[]>([])

  const styleDaily: CSSProperties = {
    borderLeftWidth: '6px',
    borderColor: SAKURA_BORDER
  }

  // Init dailyStats
  useEffect(() => {
    setDailyState(
      Array(6)
        .fill(null)
        .map((_, idx) => {
          return {
            sumCondJangYu: 0,
            sumDraw: 0,
            sumLose: 0,
            sumMiss: 0
          }
        })
    )
  }, [])
  // Calculate dailyStats
  useEffect(() => {
    if (recordTable && weeklyRecord) {
      setDailyState(
        weeklyRecord.colInfo.dateInfo.map((dayInfo, dayIdx) => {
          let sumCondJangYu = 0,
            sumDraw = 0,
            sumLose = 0,
            sumMiss = 0

          weeklyRecord.rowInfo.membersInfo.forEach((memInfo, memIdx) => {
            if (recordTable[memInfo.name] && recordTable[memInfo.name][dayInfo.date]) {
              const memRecord = recordTable[memInfo.name][dayInfo.date]
              const {condError, recordsArr} = memRecord

              sumCondJangYu += condError > 0 ? 1 : 0

              recordsArr.forEach((recordBlock, rIdx) => {
                switch (recordBlock.result) {
                  case 1:
                    sumDraw += 1
                    break
                  case 2:
                    sumLose += 1
                    break
                  case 3:
                    sumMiss += 1
                    break
                }
              })
            }
          })

          return {sumCondJangYu, sumDraw, sumLose, sumMiss}
        })
      )
    } // BLANK LINE COMMENT:
    else {
      // 버그 생기기 전에 해주자
      setDailyState(
        Array(6)
          .fill(null)
          .map((_, idx) => {
            return {
              sumCondJangYu: 0,
              sumDraw: 0,
              sumLose: 0,
              sumMiss: 0
            }
          })
      )
    }
  }, [recordTable, weeklyRecord])

  return (
    <>
      <td colSpan={5}>
        <TextLG>{'일간 통계'}</TextLG>
      </td>
      {weeklyRecord.colInfo.dateInfo.map((dayInfo, dayIdx) => {
        return (
          <td colSpan={5} style={styleDaily}>
            <TextLG>{`${dailyStats[dayIdx]?.sumCondJangYu} 컨 ${dailyStats[dayIdx]?.sumDraw} 무`}</TextLG>
            <TextLG>{`${dailyStats[dayIdx]?.sumLose} 패 ${dailyStats[dayIdx]?.sumMiss} 미`}</TextLG>
          </td>
        )
      })}
    </>
  )
}
