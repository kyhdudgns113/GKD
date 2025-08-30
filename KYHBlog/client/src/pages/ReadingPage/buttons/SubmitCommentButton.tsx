import {useCallback} from 'react'
import {COMMENT_MAX_LENGTH} from '@shareValue'

import * as CT from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type SubmitCommentButtonProps = ButtonCommonProps

/**
 * 작성된 댓글을 서버에 제출하는 버튼이다.
 */
export const SubmitCommentButton: FC<SubmitCommentButtonProps> = ({className, style, ...props}) => {
  const {userName, userOId} = CT.useAuthStatesContext()
  const {comment, fileOId, setComment} = CT.useFileStatesContext()
  const {addComment} = CT.useFileCallbacksContext()
  const {lockComment, releaseComment} = CT.useLockCallbacksContext()
  const {isCommentLocked} = CT.useLockStatesContext()

  const onClickSubmit = useCallback(
    (userOId: string, userName: string, fileOId: string, comment: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (isCommentLocked.current.isLock) {
        alert('댓글 등록중이에요')
        return
      }

      if (!comment || !comment.trim()) {
        return
      }

      if (comment.length > COMMENT_MAX_LENGTH) {
        alert(`댓글은 ${COMMENT_MAX_LENGTH}자 이하로 작성해주세요.`)
        return
      }

      lockComment()
      addComment(userOId, userName, fileOId, comment)
        .then(() => {
          setComment('')
        })
        .finally(() => {
          releaseComment()
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitComment_Button _button_reading ${className || ''}`}
      onClick={onClickSubmit(userOId, userName, fileOId, comment)}
      style={style}
      {...props} // ::
    >
      등록
    </button>
  )
}
