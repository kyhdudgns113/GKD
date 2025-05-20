import {CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {SAKURA_BORDER, TableRowCommonProps} from '../../../common'
import {DailyRecordType} from '../../../common/typesAndValues/shareTypes'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {RecordComment} from '../addon'

type RecentRecordProps = TableRowCommonProps & {dailyRecord: DailyRecordType}

export const RecentRecord: FC<RecentRecordProps> = ({dailyRecord, className, ...props}) => {
  const {clubs} = useTemplateStatesContext()

  const [clubName, setClubName] = useState<string>('')
  const [condErr, setCondErr] = useState<string>('')
  const [isComment, setIsComment] = useState<string>('')
  const [isHover, setIsHover] = useState<boolean>(false)
  const [sumDraw, setSumDraw] = useState<number>(0)
  const [sumLose, setSumLose] = useState<number>(0)
  const [sumMiss, setSumMiss] = useState<number>(0)

  const styleCategoryRow: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    color: '#F89890',
    textAlign: 'center'
  }
  const styleCComment: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '2px',
    position: 'relative',
    userSelect: 'none'
  }
  const styleCDate: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '2px'
  }

  const onEnter = useCallback(() => {
    setIsHover(true)
  }, [])
  const onLeave = useCallback(() => {
    setIsHover(false)
  }, [])

  // Init states
  useEffect(() => {
    setIsHover(false)
  }, [])
  // Set states
  useEffect(() => {
    if (dailyRecord) {
      const {clubOId, comment, condError, recordsArr} = dailyRecord

      let sumDraw = 0,
        sumLose = 0,
        sumMiss = 0

      setCondErr(condError > 0 ? 'X' : '')
      recordsArr.forEach((records, idx) => {
        switch (records.result) {
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
      setSumDraw(sumDraw)
      setSumLose(sumLose)
      setSumMiss(sumMiss)

      setIsComment(comment.length > 0 ? 'V' : '')

      if (clubs) {
        setClubName(clubs[clubOId]?.name || 'ERROR')
      }
    }
  }, [clubs, dailyRecord])

  return (
    <tr className={`${className}`} style={styleCategoryRow} {...props}>
      <td style={styleCDate}>{dailyRecord.date}</td>
      <td style={styleCDate}>{condErr}</td>
      <td style={styleCDate}>{sumDraw}</td>
      <td style={styleCDate}>{sumLose}</td>
      <td style={styleCDate}>{sumMiss}</td>
      <td onMouseEnter={onEnter} onMouseLeave={onLeave} style={styleCComment}>
        {isComment}
        {isHover && dailyRecord.comment && <RecordComment comment={dailyRecord.comment} />}
      </td>
      <td style={styleCDate}>{clubName}</td>
    </tr>
  )
}
