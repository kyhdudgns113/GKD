import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type CommentListObjectProps = DivCommonProps

export const CommentListObject: FC<CommentListObjectProps> = ({className, style, ...props}) => {
  return (
    <div className={`CommentList_Object ${className || ''}`} style={style} {...props}>
      <p>CommentListObject</p>
    </div>
  )
}
