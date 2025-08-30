import {useAuthStatesContext} from '@context'
import {AddReplyButton, EditCommentButton, DeleteCommentButton} from '../buttons'

import type {FC} from 'react'

import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentBtnRowFProps = DivCommonProps & {comment: CommentType}

export const CommentBtnRowF: FC<CommentBtnRowFProps> = ({comment, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()

  return (
    <div className={`CommentBtnRow_F ${className || ''}`} style={style} {...props}>
      {userOId === comment.userOId && <EditCommentButton comment={comment} />}
      {userOId === comment.userOId && <DeleteCommentButton comment={comment} />}
      <AddReplyButton comment={comment} />
    </div>
  )
}
