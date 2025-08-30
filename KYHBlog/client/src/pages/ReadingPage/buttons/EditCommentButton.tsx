import {useCallback} from 'react'
import {useAuthStatesContext, useFileCallbacksContext, useFileStatesContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type EditCommentButtonProps = ButtonCommonProps & {comment: CommentType}

/**
 * 댓글을 수정하는 컴포넌트로 전환하는 버튼이다.
 * - 수정된 댓글을 서버에 제출하는 버튼은 SubmitEditCommentButton 이다.
 */
export const EditCommentButton: FC<EditCommentButtonProps> = ({comment, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {commentOId_edit} = useFileStatesContext()
  const {selectEditComment} = useFileCallbacksContext()

  const onClickEditComment = useCallback(
    (userOId: string, commentOId_edit: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (userOId !== comment.userOId) {
        alert(`작성자가 아니면 수정할 수 없어요`)
        return
      }

      if (commentOId_edit === comment.commentOId) {
        selectEditComment('')
      } // ::
      else {
        selectEditComment(comment.commentOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`EditComment_Button _button_reading ${className || ''}`}
      onClick={onClickEditComment(userOId, commentOId_edit)}
      style={style}
      {...props}
    >
      수정
    </button>
  )
}
