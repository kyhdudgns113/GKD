import {useCallback} from 'react'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type ChatUserButtonProps = DivCommonProps & {
  targetUserOId: string
}

export const ChatUserButton: FC<ChatUserButtonProps> = ({targetUserOId, className, style, ...props}) => {
  const onClickIcon = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()

    alert(`채팅은 댓글 이후에 구현해요\n${targetUserOId}`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Icon
      className={`ChatUserButton _btn ${className || ''}`}
      iconName="mail"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
