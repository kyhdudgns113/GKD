import {useCallback} from 'react'
import {Icon} from '@component'
import {useUserCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AlarmIconProps = DivCommonProps & {}
export const AlarmIcon: FC<AlarmIconProps> = ({className, style, ...props}) => {
  const {toggleAlarm} = useUserCallbacksContext()

  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    toggleAlarm()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Icon
      className={`AlarmIcon ${className || ''}`}
      iconName="notifications"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
