import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {TableCellCommonProps} from '../../../common'
import {useClubRecordStatesContext} from '../_contexts'
import {WeeklyRecordType} from '../../../common/typesAndValues/shareTypes'

type TBodyWeekCommentBlockProps = TableCellCommonProps & {}

export const TBodyWeekCommentBlock: FC<TBodyWeekCommentBlockProps> = ({className, ...props}) => {
  const {weeklyRecord, setSelCommentWOId} = useClubRecordStatesContext()

  const styleCategory: CSSProperties = {
    // backgroundColor: '#F8E8E0', // bg-gkd-sakura-bg
    color: '#F89890',
    cursor: 'pointer',
    height: '100%'
  }

  const onClickDiv = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      setSelCommentWOId(weeklyRecord.weekOId)
    },
    [weeklyRecord, setSelCommentWOId]
  )

  const tunedComments = (weeklyRecord: WeeklyRecordType) => {
    return weeklyRecord.comment.split('\n').map((comm, idx) => (
      <>
        {comm}
        <br />
      </>
    ))
  }

  return (
    <td colSpan={5} onClick={onClickDiv} style={styleCategory}>
      {(weeklyRecord.comment && tunedComments(weeklyRecord)) || '주간 코멘트 입력'}
    </td>
  )
}
