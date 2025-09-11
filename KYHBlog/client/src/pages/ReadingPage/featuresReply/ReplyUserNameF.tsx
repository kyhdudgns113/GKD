import {useCallback} from 'react'
import {useFileCallbacksContext, useFileStatesContext} from '@context'
import {ReplyUserInfoE} from '../elements'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

type ReplyUserNameFProps = DivCommonProps & {reply: ReplyType}

export const ReplyUserNameF: FC<ReplyUserNameFProps> = ({reply, className, style, ...props}) => {
  const {replyOId_user} = useFileStatesContext()
  const {selectReplyUser} = useFileCallbacksContext()

  const isUserSelected = replyOId_user === reply.replyOId

  const onClickUserName = useCallback(
    (reply: ReplyType) => (e: MouseEvent<HTMLParagraphElement>) => {
      e.preventDefault()
      e.stopPropagation()
      selectReplyUser(reply.replyOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`ReplyUserName_F ${className || ''}`} style={style} {...props}>
      <p className="_replyUserName" onClick={onClickUserName(reply)}>
        {reply.userName}
      </p>
      {isUserSelected && <ReplyUserInfoE reply={reply} />}
    </div>
  )
}
