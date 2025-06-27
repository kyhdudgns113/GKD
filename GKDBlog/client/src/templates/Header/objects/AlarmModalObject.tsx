import {useEffect, useState} from 'react'

import {SAKURA_BORDER} from '@value'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useUserCallbacksContext} from '@contexts/user/_callbacks'

import {AlarmGroup} from '../groups'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {AlarmType} from '@shareType'

type AlarmModalObjectProps = DivCommonProps & {}

export const AlarmModalObject: FC<AlarmModalObjectProps> = ({className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()

  const {refreshAlarmArr} = useUserCallbacksContext()

  const [alarmArr, setAlarmArr] = useState<AlarmType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const styleObject: CSSProperties = {
    ...style,

    alignItems: 'center',

    backgroundColor: 'white',
    borderColor: SAKURA_BORDER,
    borderRadius: '16px',
    borderWidth: '2px',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    justifyContent: 'center',

    padding: '16px',

    position: 'absolute',
    top: '8px',
    left: '-250px',

    width: '250px',
    zIndex: 10
  }
  const styleGroupWrapper: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',

    maxHeight: '300px',

    overflowY: 'auto',

    width: '100%'
  }

  /**
   * 알람 배열 가져오기
   */
  useEffect(() => {
    if (userOId && isLoading) {
      refreshAlarmArr(setAlarmArr, setIsLoading)
    }
  }, [isLoading, userOId, refreshAlarmArr])

  return (
    <div className={`ALARM_MODAL_OBJECT ${className || ''}`} onClick={e => e.stopPropagation()} style={styleObject} {...props}>
      {isLoading && <p>Loading...</p>}
      {!isLoading && alarmArr.length === 0 && <p>No alarms</p>}
      {!isLoading && alarmArr.length > 0 && (
        <div className="ALARM_GROUP_WRAPPER " style={styleGroupWrapper}>
          {alarmArr.map(alarm => (
            <AlarmGroup key={alarm.dateString} alarm={alarm} />
          ))}
        </div>
      )}
    </div>
  )
}
