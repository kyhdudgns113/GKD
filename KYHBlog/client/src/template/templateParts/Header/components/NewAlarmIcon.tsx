import {useUserStatesContext} from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import {ALARM_STATUS_NEW} from '@commons/typesAndValues'

type NewAlarmIconProps = DivCommonProps & {}

export const NewAlarmIcon: FC<NewAlarmIconProps> = ({className, style, ...props}) => {
  const {alarmArr} = useUserStatesContext()

  if (alarmArr.filter(alarm => alarm.alarmStatus === ALARM_STATUS_NEW).length === 0) return null

  return (
    <div className={`NewAlarmIcon ${className || ''}`} style={style} {...props}>
      {alarmArr.filter(alarm => alarm.alarmStatus === ALARM_STATUS_NEW).length}
    </div>
  )
}
