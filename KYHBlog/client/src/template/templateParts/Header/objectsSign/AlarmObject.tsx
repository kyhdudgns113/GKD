import {Icon} from '@component'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type AlarmObjectProps = DivCommonProps & {}

/**
 * SignAreaPart 에서 알람 관련 정보를 보여주는 부분이다.
 *
 * - 알람 유무 및 갯수 표시
 * - 버튼 클릭시 알람 목록 표시
 */
export const AlarmObject: FC<AlarmObjectProps> = ({className, style, ...props}) => {
  const styleObject: CSSProperties = {
    ...style,

    height: 'fit-content',

    overflow: 'visible',
    position: 'relative',
    width: 'auto'
  }

  return (
    <div className={`Alarm_Object ${className || ''}`} style={styleObject} {...props}>
      {/* 1. 알람 아이콘 */}
      <Icon className="_alarmIcon" iconName="notifications" />

      {/* 2. 알람 갯수 */}

      {/* 3. 알람 목록 */}
    </div>
  )
}
