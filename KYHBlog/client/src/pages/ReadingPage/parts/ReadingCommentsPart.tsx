import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingCommentsPartProps = DivCommonProps

export const ReadingCommentsPart: FC<ReadingCommentsPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`ReadingComments_Part ${className || ''}`} style={style} {...props}>
      <p>Reading Comments Part</p>
    </div>
  )
}
