import {CommentBtnRowF, CommentContentF, CommentUserNameF, CommentDateF} from '../features'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentInfoGroupProps = DivCommonProps & {comment: CommentType}

export const CommentInfoGroup: FC<CommentInfoGroupProps> = ({comment, className, style, ...props}) => {
  return (
    <div className={`CommentInfo_Group ${className || ''}`} style={style} {...props}>
      <div className="_commentHeaderContainer">
        <CommentUserNameF comment={comment} />
        <CommentBtnRowF comment={comment} />
      </div>
      <CommentContentF comment={comment} />
      <CommentDateF comment={comment} />
    </div>
  )
}
