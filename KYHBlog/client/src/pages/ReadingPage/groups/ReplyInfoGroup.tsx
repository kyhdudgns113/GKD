import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

type ReplyInfoGroupProps = DivCommonProps & {reply: ReplyType}

export const ReplyInfoGroup: FC<ReplyInfoGroupProps> = ({reply, className, style, ...props}) => {
  return (
    <div className={`ReplyInfo_Group ${className || ''}`} style={style} {...props}>
      <p>{reply.content}</p>
    </div>
  )
}
