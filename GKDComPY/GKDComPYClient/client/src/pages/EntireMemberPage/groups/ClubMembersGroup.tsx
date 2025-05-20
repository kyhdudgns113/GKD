import {CSSProperties, FC} from 'react'
import {
  BLUE100,
  BLUE600,
  DivCommonProps,
  GRAY300,
  GRAY700,
  GREEN100,
  GREEN600,
  PURPLE100,
  PURPLE700,
  RED100,
  RED500,
  YELLOW100,
  YELLOW600
} from '../../../common'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {ClubMemberArrBlock, TableTitles} from '../blocks'
import {useEntireMemberStatesContext} from '../_contexts'

type ClubMembersGroupProps = DivCommonProps & {
  clubOId: string
  colIdx: number
}
export const ClubMembersGroup: FC<ClubMembersGroupProps> = ({
  clubOId,
  colIdx,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {clubs} = useTemplateStatesContext()
  const {eMembersMatrix} = useEntireMemberStatesContext()

  const backgroundColorsArr = [RED100, YELLOW100, GREEN100, BLUE100, PURPLE100, GRAY300, '#FFFFFF']
  const arrLen1 = backgroundColorsArr.length
  const backgroundColor = backgroundColorsArr[colIdx % arrLen1]

  const borderColorsArr = [RED500, YELLOW600, GREEN600, BLUE600, PURPLE700, GRAY700, '#000000']
  const arrLen = borderColorsArr.length
  const borderColor = borderColorsArr[colIdx % arrLen]

  const styleDiv: CSSProperties = {
    marginRight: '8px',
    textAlign: 'center'
  }
  const styleName: CSSProperties = {
    backgroundColor,
    borderColor,
    borderTopWidth: '4px',
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    color: borderColor,
    fontWeight: 700
  }
  // BLANK LINE COMMENT:
  if (!clubOId) return null
  return (
    <div className={`flex flex-col  ${className}`} style={styleDiv} {...props}>
      {/* 클럽 이름 */}
      <p style={styleName}>
        {clubs[clubOId].name} : {eMembersMatrix[colIdx].length}명
      </p>

      {/* 테이블 제목 */}
      <TableTitles colIdx={colIdx} />

      {/* 테이블 내용: 클럽 멤버 목록 */}
      <ClubMemberArrBlock colIdx={colIdx} />
    </div>
  )
}
