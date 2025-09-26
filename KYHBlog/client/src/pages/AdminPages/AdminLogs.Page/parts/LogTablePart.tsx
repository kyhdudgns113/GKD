import {useCallback} from 'react'
import {Icon} from '@component'
import {useAdminCallbacksContext, useAdminStatesContext} from '@context'
import {GKDErrorObject, GKDStatusObject} from '../objects.logs'

import type {FC, MouseEvent} from 'react'
import type {TableCommonProps} from '@commons/typesAndValues'

type LogTablePartProps = TableCommonProps & {}

export const LogTablePart: FC<LogTablePartProps> = ({className, style, ...props}) => {
  const {logArr, logOId_showError, logOId_showStatus} = useAdminStatesContext()
  const {openLogGKDError, openLogGKDStatus} = useAdminCallbacksContext()

  const onClickIconError = useCallback(
    (nowShowOId: string, logOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      if (nowShowOId === logOId) {
        openLogGKDError('')
      } // ::
      else {
        openLogGKDError(logOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

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
            <th className="_th_error">에러</th>
          </tr>
        </thead>
        <tbody>
          {logArr.map((log, logIdx) => {
            const isGKDStatus = Object.keys(log.gkdStatus).length > 0
            const isError = (log.gkdErrMsg?.length || 0) > 0

            // DateString 생성
            const d = new Date(log.date)

            const year = d.getFullYear()
            const month = d.getMonth() + 1
            const day = d.getDate()

            const hours = String(d.getHours()).padStart(2, '0')
            const minutes = String(d.getMinutes()).padStart(2, '0')
            const seconds = String(d.getSeconds()).padStart(2, '0')

            const dateString = `${year}. ${month}. ${day} ${hours}:${minutes}:${seconds}`

            return (
              <tr key={logIdx}>
                <td className="_td_date">{dateString}</td>
                <td className="_td_userId">{log.userId}</td>
                <td className="_td_gkdLog">{log.gkdErrMsg || log.gkdLog}</td>
                <td className="_td_gkdstatus">
                  <div className="_td_gkdstatus_icon_wrapper">
                    {isGKDStatus && <Icon iconName="info" onClick={onClickIconStatus(logOId_showStatus, log.logOId)} />}
                    {isGKDStatus && logOId_showStatus === log.logOId && <GKDStatusObject log={log} />}
                  </div>
                </td>
                <td className="_td_error">
                  <div className="_td_error_icon_wrapper">
                    {isError && <Icon iconName="crisis_alert" onClick={onClickIconError(logOId_showError, log.logOId)} />}
                    {isError && logOId_showError === log.logOId && <GKDErrorObject log={log} />}
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
