// import {CheckAuth} from '@guard'

import './_styles/AdminPage.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as P from './parts'

type AdminPageProps = DivCommonProps & {reqAuth?: number}

// prettier-ignore
export const AdminPage: FC<AdminPageProps> = ({reqAuth, className, style, ...props}) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  return (
    // <CheckAuth reqAuth={reqAuth}>
    <div className={`AdminPage ${className || ''}`} style={style} {...props}>
      <div className="_pageWrapper">
        {/* 1. 타이틀 */}
        <p className="_page_title">관리자 페이지</p>

        {/* 2. 0번째 행: 유저, 로그 */}
        <div className="_page_row _row_0">
          <P.UsersPart />
          <P.LogsPart />
        </div>

        {/* 3. 1번째 행: 게시글, 빈 블록 */}
        <div className="_page_row _row_1">
          <P.PostsPart />
          <P.EmptyPart />
        </div>
      </div>
    </div>
    // </CheckAuth>
  )
}
