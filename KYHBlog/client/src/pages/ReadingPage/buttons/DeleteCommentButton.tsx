import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type DeleteCommentButtonProps = ButtonCommonProps & {comment: CommentType}

/**
 * 댓글을 삭제할지 물어보는 모달을 띄우는 버튼이다.
 * - 실제 삭제는 SubmitDeleteCommentButton 이다.
 */
export const DeleteCommentButton: FC<DeleteCommentButtonProps> = ({comment, className, style, ...props}) => {
  const onClickDeleteComment = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`${comment.content} 클릭`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button className={`DeleteComment_Button _button_reading ${className || ''}`} onClick={onClickDeleteComment} style={style} {...props}>
      삭제
    </button>
  )
}
