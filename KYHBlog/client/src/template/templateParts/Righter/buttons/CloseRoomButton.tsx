import {useCallback} from 'react'
import {Icon} from '@component'
import {useChatCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

type CloseRoomButtonProps = SpanCommonProps & {}

export const CloseRoomButton: FC<CloseRoomButtonProps> = ({className, style, ...props}) => {
  const {unselectChatRoom} = useChatCallbacksContext()

  const onClickIcon = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      e.preventDefault()
      unselectChatRoom()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Icon
      iconName="close"
      className={`CloseRoomButton ${className || ''}`}
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
