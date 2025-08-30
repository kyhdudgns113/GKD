import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type SubmitEditCommentButtonProps = ButtonCommonProps & {comment: CommentType; content: string}

export const SubmitEditCommentButton: FC<SubmitEditCommentButtonProps> = ({comment, content, className, style, ...props}) => {
  const onClickSubmitEditComment = useCallback(
    (content: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      alert(`바뀌기 전의 내용은 ${comment.content} 바뀌기 후의 내용은 ${content}`)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitEditComment_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickSubmitEditComment(content)}
      style={style}
      {...props} // ::
    >
      제출
    </button>
  )
}
