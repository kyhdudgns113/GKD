import {useCallback} from 'react'

import {useUserStatesContext} from '@contexts/user/__states'
import {useModalStatesContext} from '@contexts/modal/__states'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AlarmCntObjectProps = DivCommonProps & {}

export const AlarmCntObject: FC<AlarmCntObjectProps> = ({className, style, ...props}) => {
  const {setIsOpenAlarm} = useModalStatesContext()
  const {newAlarmArrLen} = useUserStatesContext()

  const styleObject: CSSProperties = {
    ...style,

    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',

    borderColor: '#FF0000',
    borderRadius: '10px',
    borderWidth: '2px',

    cursor: 'pointer',
    display: 'flex',
    height: '24px',
    justifyContent: 'center',

    paddingLeft: '6px',
    paddingRight: '6px',
    position: 'absolute',
    top: '0px',
    left: '16px',

    width: 'fit-content',
    zIndex: 10
  }
  const styleText: CSSProperties = {
    color: '#FF0000',
    fontSize: '14px',
    fontWeight: 900,

    textAlign: 'center',
    zIndex: 10
  }

  const onClickAlarmCnt = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsOpenAlarm(prev => !prev)
    },
    [setIsOpenAlarm]
  )

  if (newAlarmArrLen === 0) return null

  return (
    <div
      className={`ALARM_CNT_OBJECT ${className || ''}`}
      onClick={onClickAlarmCnt}
      style={styleObject}
      {...props} // ::
    >
      <p style={styleText}>{newAlarmArrLen}</p>
    </div>
  )
}
