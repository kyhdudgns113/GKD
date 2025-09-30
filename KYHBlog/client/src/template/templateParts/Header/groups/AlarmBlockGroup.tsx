import {useCallback, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {useUserCallbacksContext} from '@context'
import {ALARM_TYPE_FILE_COMMENT, ALARM_TYPE_TAG_REPLY, ALARM_TYPE_COMMENT_REPLY, ALARM_STATUS_NEW} from '@commons/typesAndValues'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {AlarmType} from '@shareType'

type AlarmBlockGroupProps = DivCommonProps & {alarm: AlarmType}

export const AlarmBlockGroup: FC<AlarmBlockGroupProps> = ({alarm, className, style, ...props}) => {
  const {closeAlarm, removeAlarm} = useUserCallbacksContext()

  const navigate = useNavigate()

  const isNew = useMemo(() => {
    return alarm.alarmStatus === ALARM_STATUS_NEW
  }, [alarm])

  let ment = ''

  switch (alarm.alarmType) {
    case ALARM_TYPE_FILE_COMMENT:
      ment = ' 님이 댓글을 달았습니다.'
      break
    case ALARM_TYPE_COMMENT_REPLY:
      ment = ' 님이 대댓글을 달았습니다.'
      break
    case ALARM_TYPE_TAG_REPLY:
      ment = ' 님이 나를 태그했습니다.'
      break
  }

  const onClickAlarm = useCallback(
    (alarm: AlarmType) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      closeAlarm()
      navigate(`/main/reading/${alarm.fileOId}`)
      removeAlarm(alarm.alarmOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`AlarmBlock_Group ${isNew ? '_new' : '_old'} ${className || ''}`} onClick={onClickAlarm(alarm)} style={style} {...props}>
      <div className="_alarm_ment">
        <b>{alarm.senderUserName}</b>
        {ment}
      </div>
      <div className="_alarm_content">{alarm.content}</div>
    </div>
  )
}
