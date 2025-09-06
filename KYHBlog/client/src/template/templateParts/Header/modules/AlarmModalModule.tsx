import {useEffect} from 'react'
import {useAuthStatesContext, useUserCallbacksContext, useUserStatesContext} from '@context'
import {MarginHeightBlock} from '@commons/components'
import {AlarmBlockGroup} from '../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type AlarmModalModuleProps = DivCommonProps & {}
export const AlarmModalModule: FC<AlarmModalModuleProps> = ({className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {alarmArr} = useUserStatesContext()
  const {checkNewAlarm, loadAlarmArr} = useUserCallbacksContext()

  useEffect(() => {
    checkNewAlarm()

    return () => {
      if (userOId) {
        loadAlarmArr(userOId)
      }
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`AlarmModal_Module ${className || ''}`}
      onClick={e => e.stopPropagation()}
      onDragStart={e => e.stopPropagation()}
      style={style}
      {...props} // ::
    >
      <MarginHeightBlock className="_empty_block" height="8px" />
      <div className="_alarm_arr_wrapper">
        {alarmArr.map(alarm => (
          <AlarmBlockGroup alarm={alarm} key={alarm.alarmOId} />
        ))}
      </div>
      <MarginHeightBlock className="_empty_block" height="8px" />
    </div>
  )
}
