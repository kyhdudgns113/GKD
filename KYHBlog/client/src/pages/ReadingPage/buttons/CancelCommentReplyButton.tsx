import {useCallback} from 'react'
import {useFileCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type CancelCommentReplyButtonProps = ButtonCommonProps & {}

export const CancelCommentReplyButton: FC<CancelCommentReplyButtonProps> = ({className, style, ...props}) => {
  const {unselectReplyComment} = useFileCallbacksContext()

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      unselectReplyComment()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelCommentReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickCancel}
      style={style}
      {...props} // ::
    >
      취소
    </button>
  )
}
