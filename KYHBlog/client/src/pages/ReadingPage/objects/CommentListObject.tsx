import {CommentInfoGroup, ReplyInfoGroup} from '../groups'

import * as CT from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type CommentListObjectProps = DivCommonProps

export const CommentListObject: FC<CommentListObjectProps> = ({className, style, ...props}) => {
  const {commentArr} = CT.useFileStatesContext()

  return (
    <div className={`CommentList_Object ${className || ''}`} style={style} {...props}>
      {commentArr.map((comment, commentIdx) => {
        return (
          <div className={`_commentReplyContainer _${commentIdx}`} key={comment.commentOId}>
            <CommentInfoGroup comment={comment} />
            {comment.replyArr.map(reply => (
              <ReplyInfoGroup key={reply.replyOId} reply={reply} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
