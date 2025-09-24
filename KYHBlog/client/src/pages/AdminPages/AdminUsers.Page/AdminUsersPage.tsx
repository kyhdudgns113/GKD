import './AdminUsersPage.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type AdminUsersPageProps = DivCommonProps

// prettier-ignore
export const AdminUsersPage: FC<AdminUsersPageProps> = ({className, style, ...props}) => {
  return (
    <div className={`AdminUsersPage ${className || ''}`} style={style} {...props}>
      <div className="_pageWrapper">
        {/* 1. 타이틀 */}
        <p className="_page_title">유저 관리 페이지</p>

        
      </div>
    </div>
  )
}
