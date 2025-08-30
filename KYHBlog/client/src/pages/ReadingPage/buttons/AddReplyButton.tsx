import {useCallback} from 'react'
import {useAuthStatesContext} from '@context'
import {AUTH_GUEST} from '@secret'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type AddReplyButtonProps = ButtonCommonProps & {comment: CommentType}

/**
 * 대댓글을 작성하는 컴포넌트를 띄우는 버튼이다.
 * - 제출하는 버튼은 SubmitReplyButton 이다.
 */
export const AddReplyButton: FC<AddReplyButtonProps> = ({comment, className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()

  const onClickAddReply = useCallback(
    (userAuth: number) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (userAuth === AUTH_GUEST) {
        alert(`로그인 이후 이용할 수 있어요`)
        return
      }

      alert(`${comment.content} 클릭`)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`AddReply_Button _button_reading ${className || ''}`}
      onClick={onClickAddReply(userAuth)}
      style={style}
      {...props} // ::
    >
      댓글
    </button>
  )
}
