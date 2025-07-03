import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {SAKURA_BORDER, TableBodyCommonProps} from '../../../../../common'
import {useLogContext} from '../LogListPage'
import {ShowGKDGroup, ShowStateGroup} from '../groups'

type LogTableBodyProps = TableBodyCommonProps & {}
export const LogTableBody: FC<LogTableBodyProps> = ({className, ...props}) => {
  const {logsArr} = useLogContext()

  const [isHoverArr, setIsHoverArr] = useState<boolean[]>([])
  const [isGkdHoverArr, setIsGkdHoverArr] = useState<boolean[]>([])

  const borderColor = SAKURA_BORDER

  const styleDate: CSSProperties = {
    borderColor,
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center'
  }
  const styleTime: CSSProperties = {
    borderColor,
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center'
  }
  const styleUser: CSSProperties = {
    borderColor,
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center'
  }
  const styleLog: CSSProperties = {
    borderColor,
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
    fontSize: '14px',
    fontWeight: 600,
    paddingLeft: '4px'
  }
  const styleState: CSSProperties = {
    borderColor,
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
    fontSize: '14px',
    fontWeight: 600,
    position: 'relative',
    textAlign: 'center'
  }
  const styleGkd: CSSProperties = {
    borderColor,
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
    fontSize: '14px',
    fontWeight: 600,
    position: 'relative',
    textAlign: 'center'
  }

  const onMouseEnter = useCallback(
    (logIdx: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      setIsHoverArr(prev => {
        const newPrev = [...prev]
        newPrev[logIdx] = true
        return newPrev
      })
    },
    []
  )
  const onMouseLeave = useCallback(
    (logIdx: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      setIsHoverArr(prev => {
        const newPrev = [...prev]
        newPrev[logIdx] = false
        return newPrev
      })
    },
    []
  )
  const onMouseEnterGkd = useCallback(
    (logIdx: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      setIsGkdHoverArr(prev => {
        const newPrev = [...prev]
        newPrev[logIdx] = true
        return newPrev
      })
    },
    []
  )
  const onMouseLeaveGkd = useCallback(
    (logIdx: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      setIsGkdHoverArr(prev => {
        const newPrev = [...prev]
        newPrev[logIdx] = false
        return newPrev
      })
    },
    []
  )
  // Init states
  useEffect(() => {
    setIsHoverArr(logsArr.map(_ => false))
    setIsGkdHoverArr(logsArr.map(_ => false))
  }, [logsArr])

  return (
    <tbody className={`${className}`} {...props}>
      {logsArr.map((log, logIdx) => {
        if (log.gkdLog) {
          const {date, gkdLog, userId, gkdStatus, gkd} = log
          const dateObj = new Date(date)
          const utc = dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000
          const seoulTime = new Date(utc + 18 * 60 * 60 * 1000).toISOString()
          const [yearMonthDay, dateTimes] = seoulTime.toString().split('T')
          const yMD = yearMonthDay.split('-').join('').substring(2)
          const dateTime = dateTimes.split('.')[0]

          return (
            <tr className="hover:bg-gkd-sakura-bg" key={`log${logIdx}`}>
              <td className="LOG_DATE" style={styleDate}>
                <p>{yMD}</p>
              </td>
              <td className="LOG_TIME" style={styleTime}>
                <p>{dateTime}</p>
              </td>
              <td className="LOG_ID" style={styleUser}>
                <p>{userId}</p>
              </td>
              <td className="LOG_MSG" style={styleLog}>
                <p>{gkdLog}</p>
              </td>
              <td
                className="LOG_STATE"
                onMouseEnter={onMouseEnter(logIdx)}
                onMouseLeave={onMouseLeave(logIdx)}
                style={styleState} // BLANK LINE COMMENT:
              >
                {'?'}
                {isHoverArr[logIdx] && <ShowStateGroup gkdStatus={gkdStatus} />}
              </td>
              <td className="LOG_GKD" style={styleGkd}>
                {'G'}
                {isGkdHoverArr[logIdx] && <ShowGKDGroup gkd={gkd} />}
              </td>
            </tr>
          )
        } // BLANK LINE COMMENT:
        else {
          return null
        }
      })}
    </tbody>
  )
}
