import {AlarmIcon, NewAlarmIcon} from '../components'
import {useUserStatesContext} from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import {AlarmModalModule} from '../modules'

type AlarmInfoObjectProps = DivCommonProps & {}

/**
 * SignAreaPart 에서 알람 관련 정보를 보여주는 부분이다.
 *
 * - 알람 유무 및 갯수 표시
 * - 버튼 클릭시 알람 목록 표시
 */
export const AlarmInfoObject: FC<AlarmInfoObjectProps> = ({className, style, ...props}) => {
  const {isAlarmOpen} = useUserStatesContext()

  return (
    <div className={`AlarmInfo_Object ${className || ''}`} style={style} {...props}>
      {/* 1. 알람 아이콘 */}
      <AlarmIcon className="_alarmIcon" />

      {/* 2. 알람 갯수 */}
      <NewAlarmIcon />

      {/* 3. 알람 목록 */}
      {isAlarmOpen && <AlarmModalModule />}
    </div>
  )
}
