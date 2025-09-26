import {useCallback} from 'react'
import {Icon} from '@component'
import {useAdminCallbacksContext, useAdminStatesContext} from '@context'
import {GKDStatusObject} from '../objects.logs'

import type {FC, MouseEvent} from 'react'
import type {TableCommonProps} from '@commons/typesAndValues'

type LogTablePartProps = TableCommonProps & {}

export const LogTablePart: FC<LogTablePartProps> = ({className, style, ...props}) => {
  const {logArr, logOId_showStatus} = useAdminStatesContext()
  const {openLogGKDStatus} = useAdminCallbacksContext()

  const onClickIconStatus = useCallback(
    (nowShowOId: string, logOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      if (nowShowOId === logOId) {
        openLogGKDStatus('')
      } // ::
      else {
        openLogGKDStatus(logOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`LogTable_Part ${className || ''}`} style={style} {...props}>
      <table className="_table">
        <thead>
          <tr>
            <th className="_th_date">날짜</th>
            <th className="_th_userId">유저 ID</th>
            <th className="_th_gkdLog">로그 메시지</th>
            <th className="_th_gkdstatus">상태</th>
          </tr>
        </thead>
        <tbody>
          {logArr.map((log, logIdx) => {
            const isGKDStatus = Object.keys(log.gkdStatus).length > 0

            return (
              <tr key={logIdx}>
                <td className="_td_date">{new Date(log.date).toLocaleString()}</td>
                <td className="_td_userId">{log.userId}</td>
                <td className="_td_gkdLog">{log.gkdLog}</td>
                <td className="_td_gkdstatus">
                  <div className="_td_gkdstatus_icon_wrapper">
                    {isGKDStatus && <Icon iconName="info" onClick={onClickIconStatus(logOId_showStatus, log.logOId)} />}
                    {isGKDStatus && logOId_showStatus === log.logOId && <GKDStatusObject />}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
