import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {SAKURA_BG, SAKURA_BG_50, SAKURA_BORDER} from '@value'

import {useModalStatesContext} from '@contexts/modal/__states'
import {useUserCallbacksContext} from '@contexts/user/_callbacks'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {AlarmType} from '@shareType'

type AlarmGroupProps = DivCommonProps & {
  alarm: AlarmType
}

export const AlarmGroup: FC<AlarmGroupProps> = ({alarm, className, style, ...props}) => {
  const {setIsOpenAlarm} = useModalStatesContext()
  const {deleteAlarm} = useUserCallbacksContext()

  const navigate = useNavigate()

  const styleGroup: CSSProperties = {
    ...style,

    borderColor: SAKURA_BORDER,
    borderWidth: '2px',
    color: '#000000',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',

    paddingBottom: '2px',
    paddingLeft: '4px',
    paddingRight: '4px',
    paddingTop: '2px'
  }
  const styleBold: CSSProperties = {
    fontSize: '16px'
  }
  const styleMent: CSSProperties = {
    fontSize: '14px'
  }
  const styleContent: CSSProperties = {
    color: '#888888',
    fontSize: '14px',
    overflow: 'hidden',
    paddingLeft: '4px',
    paddingRight: '4px',
    textOverflow: 'ellipsis',

    whiteSpace: 'nowrap',
    width: '100%'
  }

  const onClickGroup = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsOpenAlarm(false)

      deleteAlarm(alarm)

      navigate(`/reading/${alarm.targetObjectId}`)
    },
    [alarm, deleteAlarm, navigate, setIsOpenAlarm]
  )

  return (
    <div className={`ALARM_GROUP ` + (className || '')} style={styleGroup} onClick={onClickGroup} {...props}>
      <style>
        {`
          .ALARM_GROUP {
            background-color: ${alarm.isReceived ? '#FFFFFF' : SAKURA_BG};
          }
          .ALARM_GROUP:hover {
            background-color: ${SAKURA_BG_50};
          }
          `}
      </style>
      <p style={styleMent}>
        <b style={styleBold}>{alarm.sendUserName}</b> 님의 댓글
      </p>
      <div style={styleContent}>{alarm.content}</div>
    </div>
  )
}
