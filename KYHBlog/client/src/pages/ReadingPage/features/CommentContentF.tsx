import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentContentFProps = DivCommonProps & {comment: CommentType}

export const CommentContentF: FC<CommentContentFProps> = ({comment, className, style, ...props}) => {
  return (
    <div className={`CommentContent_F ${className || ''}`} style={style} {...props}>
      <div className="_commentContent">{comment.content}</div>
    </div>
  )
}
