import './AdminLogsPage.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as P from './parts'

type AdminLogsPageProps = DivCommonProps

// prettier-ignore
export const AdminLogsPage: FC<AdminLogsPageProps> = ({className, style, ...props}) => {
  return (
    <div className={`AdminLogsPage ${className || ''}`} style={style} {...props}>
      <div className="_pageWrapper">
        {/* 1. 타이틀 */}
        <p className="_page_title">로그 관리 페이지</p>

        {/* 2. 로그 목록 테이블 */}
        <P.LogTablePart />
      </div>
    </div>
  )
}
