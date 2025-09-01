import {useCallback} from 'react'
import {useFileCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type CancelDelReplyButtonProps = ButtonCommonProps & {}

export const CancelDelReplyButton: FC<CancelDelReplyButtonProps> = ({className, style, ...props}) => {
  const {unselectDeleteReply} = useFileCallbacksContext()

  const onClickDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      unselectDeleteReply()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelDelReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickDelete}
      style={style}
      {...props} // ::
    >
      취소
    </button>
  )
}
