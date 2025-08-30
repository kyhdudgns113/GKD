import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type AddReplyButtonProps = ButtonCommonProps & {comment: CommentType}

/**
 * 대댓글을 작성하는 컴포넌트를 띄우는 버튼이다.
 * - 제출하는 버튼은 SubmitReplyButton 이다.
 */
export const AddReplyButton: FC<AddReplyButtonProps> = ({comment, className, style, ...props}) => {
  const onClickAddReply = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`${comment.content} 클릭`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button className={`AddReply_Button _button_reading ${className || ''}`} onClick={onClickAddReply} style={style} {...props}>
      댓글
    </button>
  )
}
