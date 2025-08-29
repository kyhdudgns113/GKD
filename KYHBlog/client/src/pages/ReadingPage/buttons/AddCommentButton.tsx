import type {FC} from 'react'
import type {ButtonCommonProps} from '@prop'

type AddCommentButtonProps = ButtonCommonProps

export const AddCommentButton: FC<AddCommentButtonProps> = ({className, style, ...props}) => {
  return (
    <button className={`AddComment_Button ${className || ''}`} style={style} {...props}>
      등록
    </button>
  )
}
