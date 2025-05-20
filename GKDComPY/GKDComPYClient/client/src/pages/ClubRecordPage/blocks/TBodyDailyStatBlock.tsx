import {CSSProperties, FC, useEffect, useState} from 'react'
import {useClubRecordStatesContext} from '../_contexts'
import {TextLG} from '../../../common/components'
import {SAKURA_BORDER} from '../../../common'

type DailyStateType = {
  sumCondJangYu: number
  sumDraw: number
  sumLose: number
  sumMiss: number
  sumChecked: number
}

type TBodyDailyStatProps = {}
export const TBodyDailyStatBlock: FC<TBodyDailyStatProps> = () => {
  const {
    recordTable,
    sumWeekChecked,
    sumWeekCond,
    sumWeekDraw,
    sumWeekLose,
    sumWeekMiss,
    weeklyRecord,
    setSumWeekChecked,
    setSumWeekCond,
    setSumWeekDraw,
    setSumWeekLose,
    setSumWeekMiss
  } = useClubRecordStatesContext()

  const [dailyStats, setDailyState] = useState<DailyStateType[]>([])

  const styleCategory: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderLeftWidth: '6px'
  }
  const styleDaily: CSSProperties = {
    borderLeftWidth: '6px',
    borderColor: SAKURA_BORDER
  }
  const styleRow: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderTopWidth: '6px'
  }
  const styleStats: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '6px',
    borderRightWidth: '2px',
    color: '#f89890',
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: '1.625rem'
  }
  const styleStatsCategory: CSSProperties = {
    backgroundColor: '#F8E8E0',
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '4px',
    borderRightWidth: '2px',
    color: '#f89890',
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: '1.5rem'
  }

  // Init dailyStats
  useEffect(() => {
    setDailyState(
      Array(6)
        .fill(null)
        .map((_, idx) => {
          return {
            sumChecked: 0,
            sumCondJangYu: 0,
            sumDraw: 0,
            sumLose: 0,
            sumMiss: 0
          }
        })
    )
  }, [])
  // Set dailyStats. 일간 통계 계산하는곳.
  useEffect(() => {
    if (recordTable && weeklyRecord) {
      setDailyState(
        weeklyRecord.colInfo.dateInfo.map((dayInfo, dayIdx) => {
          let sumCondJangYu = 0,
            sumDraw = 0,
            sumLose = 0,
            sumMiss = 0,
            sumChecked = 0

          weeklyRecord.rowInfo.membersInfo.forEach((memInfo, memIdx) => {
            if (recordTable[memInfo.name] && recordTable[memInfo.name][dayInfo.date]) {
              const memRecord = recordTable[memInfo.name][dayInfo.date]
              const {comment, condError, recordsArr} = memRecord

              sumCondJangYu += condError > 0 ? 1 : 0
              sumChecked += comment.length > 0 ? 1 : 0

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

          return {sumChecked, sumCondJangYu, sumDraw, sumLose, sumMiss}
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
              sumChecked: 0,
              sumCondJangYu: 0,
              sumDraw: 0,
              sumLose: 0,
              sumMiss: 0
            }
          })
      )
    }
  }, [recordTable, weeklyRecord])
  // Calculate weeklyStats
  useEffect(() => {
    if (dailyStats && dailyStats.length === 6) {
      let sumWeekChecked = 0
      let sumWeekCond = 0
      let sumWeekDraw = 0
      let sumWeekLose = 0
      let sumWeekMiss = 0
      dailyStats.forEach((stat, idx) => {
        sumWeekChecked += stat.sumChecked
        sumWeekCond += stat.sumCondJangYu
        sumWeekDraw += stat.sumDraw
        sumWeekLose += stat.sumLose
        sumWeekMiss += stat.sumMiss
      })
      setSumWeekChecked(sumWeekChecked)
      setSumWeekCond(sumWeekCond)
      setSumWeekDraw(sumWeekDraw)
      setSumWeekLose(sumWeekLose)
      setSumWeekMiss(sumWeekMiss)
    }
  }, [
    dailyStats,
    setSumWeekChecked,
    setSumWeekCond,
    setSumWeekDraw,
    setSumWeekLose,
    setSumWeekMiss
  ])

  return (
    <>
      <tr style={styleRow}>
        <td style={styleStatsCategory}>컨</td>
        <td style={styleStatsCategory}>무</td>
        <td style={styleStatsCategory}>패</td>
        <td style={styleStatsCategory}>미</td>
        <td style={styleStatsCategory}>V</td>
        <td colSpan={5} rowSpan={2} style={styleCategory}>
          <TextLG>{'주간 / 일간'}</TextLG>
        </td>
        {weeklyRecord.colInfo.dateInfo.map((dayInfo, dayIdx) => {
          return (
            <td colSpan={5} key={`keys${dayIdx}`} rowSpan={2} style={styleDaily}>
              <TextLG>{`${dailyStats[dayIdx]?.sumCondJangYu} 컨 ${dailyStats[dayIdx]?.sumDraw} 무`}</TextLG>
              <TextLG>{`${dailyStats[dayIdx]?.sumLose} 패 ${dailyStats[dayIdx]?.sumMiss} 미`}</TextLG>
            </td>
          )
        })}
      </tr>
      <tr>
        <td style={styleStats}>{sumWeekCond}</td>
        <td style={styleStats}>{sumWeekDraw}</td>
        <td style={styleStats}>{sumWeekLose}</td>
        <td style={styleStats}>{sumWeekMiss}</td>
        <td style={styleStats}>{sumWeekChecked}</td>
      </tr>
    </>
  )
}
