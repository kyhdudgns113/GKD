import {useCallback} from 'react'
import {useFileCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type CancelDelCommentButtonProps = ButtonCommonProps & {}

export const CancelDelCommentButton: FC<CancelDelCommentButtonProps> = ({className, style, ...props}) => {
  const {unselectDeleteComment} = useFileCallbacksContext()

  const onClickDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      unselectDeleteComment()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelDelComment_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickDelete}
      style={style}
      {...props} // ::
    >
      취소
    </button>
  )
}
