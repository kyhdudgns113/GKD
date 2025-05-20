import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {TableCellCommonProps} from '../../../common'
import {RecordDateInfoType} from '../../../common/typesAndValues/shareTypes'
import {TextXL} from '../../../common/components'
import {useClubRecordStatesContext} from '../_contexts'

type TBodyBottomBlockProps = TableCellCommonProps & {
  dayInfo: RecordDateInfoType
  dayIdx: number
}
export const TBodyBottomBlock: FC<TBodyBottomBlockProps> = ({
  dayInfo,
  dayIdx,
  className,
  ...props
}) => {
  const {setSelCommentIdx} = useClubRecordStatesContext()

  const styleBlock: CSSProperties = {
    borderWidth: '6px',
    cursor: 'pointer',
    height: '6rem',
    maxWidth: '10px',
    userSelect: 'none'
  }

  const onClickComment = useCallback(
    (dayIdx: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      setSelCommentIdx(dayIdx)
    },
    [setSelCommentIdx]
  )

  return (
    <>
      <td
        className={`border-gkd-sakura-border text-gkd-sakura-text ${className}`}
        colSpan={5}
        onClick={onClickComment(dayIdx)}
        style={styleBlock}
        {...props} // BLANK LINE COMMENT:
      >
        {dayInfo.comments ? (
          dayInfo.comments.split('\n').map((comment, idx) => (
            <span className="max-w-full" key={`key${idx}`}>
              <p className="break-all max-w-full text-xs">{comment.replace(/ /g, '\u00A0')}</p>
              {/* <br /> */}
            </span>
          ))
        ) : (
          <TextXL>{`<< 코멘트 >>`}</TextXL>
        )}
      </td>
    </>
  )
}
