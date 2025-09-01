import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

type ReplyUserNameFProps = DivCommonProps & {reply: ReplyType}

export const ReplyUserNameF: FC<ReplyUserNameFProps> = ({reply, className, style, ...props}) => {
  const onClickUserName = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`클릭하면 모달 띄워지게 해야돼요.`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`ReplyUserName_F ${className || ''}`} style={style} {...props}>
      <p className="_replyUserName" onClick={onClickUserName}>
        {reply.userName}
      </p>
    </div>
  )
}
