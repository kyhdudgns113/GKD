import {CSSProperties, FC, useState} from 'react'
import {DivCommonProps, SAKURA_BG} from '../../common'
import {useTemplateStatesContext} from '../_contexts'
import {ClubPageRow, EntireMemberRow, MainPageRow, BannedPageRow} from '../groupSidebars'

type SidebarProps = DivCommonProps & {
  width: string
}
export const Sidebar: FC<SidebarProps> = ({width, className, ...props}) => {
  const {banClub, clubsArr} = useTemplateStatesContext()
  // 0 이면 후보군 클럽을 의미하고, 이는 리스트에 출력되지 않는다.
  // null 의 역할을 할 수 있다.
  // 클릭이 됬다고 페이지 정보가 바뀌어선 안되기에 여기에서 처리한다.
  const [clickedClubRow, setClickedClubRow] = useState<number | null>(null)

  const styleSidebar: CSSProperties = {
    backgroundColor: SAKURA_BG,
    borderColor: 'transparent',
    borderWidth: '4px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    boxShadow: '0px 0px 12px rgba(120, 92, 92, 1)',

    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    userSelect: 'none',

    width
  }
  return (
    <div
      className={`SIDE_BAR ${className || ''}`}
      style={styleSidebar}
      {...props} // BLANK LINE COMMENT:
    >
      <MainPageRow arg={{setClickedClubRow}} className="mt-4" />
      <EntireMemberRow arg={{setClickedClubRow}} />
      {clubsArr.map((club, clubIdx) => (
        <ClubPageRow
          arg={{club, clubIdx, clickedClubRow, setClickedClubRow}}
          key={`cRK:${clubIdx}`}
        />
      ))}
      <BannedPageRow arg={{club: banClub, clubIdx: -1, clickedClubRow, setClickedClubRow}} />
    </div>
  )
}
