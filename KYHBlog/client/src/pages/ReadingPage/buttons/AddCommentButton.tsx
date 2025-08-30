import {useCallback} from 'react'
import {useAuthStatesContext, useFileCallbacksContext, useFileStatesContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import {COMMENT_MAX_LENGTH} from '@commons/typesAndValues'

type AddCommentButtonProps = ButtonCommonProps

export const AddCommentButton: FC<AddCommentButtonProps> = ({className, style, ...props}) => {
  const {userName, userOId} = useAuthStatesContext()
  const {comment, fileOId} = useFileStatesContext()
  const {addComment} = useFileCallbacksContext()

  const onClickSubmit = useCallback(
    (userOId: string, userName: string, fileOId: string, comment: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (!comment || !comment.trim()) {
        return
      }

      if (comment.length > COMMENT_MAX_LENGTH) {
        alert(`댓글은 ${COMMENT_MAX_LENGTH}자 이하로 작성해주세요.`)
        return
      }

      addComment(userOId, userName, fileOId, comment)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`AddComment_Button ${className || ''}`}
      onClick={onClickSubmit(userOId, userName, fileOId, comment)}
      style={style}
      {...props} // ::
    >
      등록
    </button>
  )
}
