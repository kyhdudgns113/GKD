import {useCallback} from 'react'
import {useFileCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type CancelReplyReplyButtonProps = ButtonCommonProps & {}

export const CancelReplyReplyButton: FC<CancelReplyReplyButtonProps> = ({className, style, ...props}) => {
  const {unselectReplyReply} = useFileCallbacksContext()

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      unselectReplyReply()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelReplyReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickCancel}
      style={style}
      {...props} // ::
    >
      취소
    </button>
  )
}
