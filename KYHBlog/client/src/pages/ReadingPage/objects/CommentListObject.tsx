import {CommentInfoGroup, ReplyInfoGroup} from '../groups'
import * as CT from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type CommentListObjectProps = DivCommonProps

export const CommentListObject: FC<CommentListObjectProps> = ({className, style, ...props}) => {
  const {commentReplyArr} = CT.useFileStatesContext()

  return (
    <div className={`CommentList_Object ${className || ''}`} style={style} {...props}>
      {commentReplyArr.map((element, elemIdx) => {
        const isReply = 'replyOId' in element

        return (
          <div className={`_commentReplyContainer _${elemIdx}`} key={elemIdx}>
            {isReply ? <ReplyInfoGroup reply={element} /> : <CommentInfoGroup comment={element} />}
          </div>
        )
      })}
    </div>
  )
}
