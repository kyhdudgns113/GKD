import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type EditCommentButtonProps = ButtonCommonProps & {comment: CommentType}

/**
 * 댓글을 수정하는 컴포넌트로 전환하는 버튼이다.
 * - 수정된 댓글을 서버에 제출하는 버튼은 SubmitEditCommentButton 이다.
 */
export const EditCommentButton: FC<EditCommentButtonProps> = ({comment, className, style, ...props}) => {
  const onClickEditComment = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`${comment.content} 클릭`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button className={`EditComment_Button _button_reading ${className || ''}`} onClick={onClickEditComment} style={style} {...props}>
      수정
    </button>
  )
}
