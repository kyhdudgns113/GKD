import {FC} from 'react'
import {DivCommonProps} from '../../../common'
import {ClubListRow, CommunityListRow, LogListRow, UserListRow} from '../groupSidebars'

export type SidebarProps = DivCommonProps & {
  //
}
export const Sidebar: FC<SidebarProps> = ({className, ...props}) => {
  return (
    <div
      className={`select-none flex flex-col bg-gkd-sakura-bg border-4 border-gkd-sakura-border ${className}`}
      {...props}>
      <CommunityListRow className="mt-4" />
      <ClubListRow />
      <UserListRow />
      <LogListRow />
    </div>
  )
}
