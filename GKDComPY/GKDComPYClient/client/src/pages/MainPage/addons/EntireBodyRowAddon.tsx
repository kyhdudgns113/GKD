import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {SAKURA_BORDER, TableRowCommonProps} from '../../../common'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {numberPlusComma} from '../../../common/utils'
import {Icon, IconFilled} from '../../../common/components'
import {useCommMembersContext} from '../parts'

type EntireBodyRowAddonProps = TableRowCommonProps & {
  member: MemberInfoType
  memIdx: number
}

export const EntireBodyRowAddon: FC<EntireBodyRowAddonProps> = ({
  member,
  memIdx,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {clubsArr, comm} = useTemplateStatesContext()
  const {commMembersArr, setIsEMemberModal} = useCommMembersContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const fontSize = '12px'
  const height = '16px'

  const styleRow: CSSProperties = {
    borderColor: memIdx % 10 === 9 ? '#60A5FA' : memIdx % 5 === 4 ? '#4ADE80' : '#F0B8B8',
    borderBottomWidth:
      memIdx === commMembersArr.length - 1 ? '0px' : memIdx % 5 === 4 ? '4px' : '2px',
    color: '#F89890',
    height
  }
  // BLANK LINE COMMENT:
  const styleBatter: CSSProperties = {
    fontSize
  }
  const styleBorder: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px'
  }
  const styleClub: CSSProperties = {
    fontSize
  }
  const styleIcon: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    userSelect: 'none'
  }
  const styleIdx: CSSProperties = {
    fontSize
  }
  const styleName: CSSProperties = {
    fontSize
  }
  const stylePitcher: CSSProperties = {
    fontSize
  }
  const styleTotal: CSSProperties = {
    fontSize
  }

  const onClickRow = useCallback(
    (member: MemberInfoType) => (e: MouseEvent<HTMLTableRowElement>) => {
      setIsEMemberModal(member.memOId)
    },
    [setIsEMemberModal]
  )
  const onMouseEnterRow = useCallback((e: MouseEvent<HTMLTableRowElement>) => {
    setIsHover(true)
  }, [])
  const onMouseLeaveRow = useCallback((e: MouseEvent<HTMLTableRowElement>) => {
    setIsHover(false)
  }, [])

  // Init states
  useEffect(() => {
    setIsHover(false)
  }, [])

  return (
    <tr
      className={`${className} ` + (isHover ? ' bg-gkd-sakura-bg ' : ' bg-white ')}
      onClick={onClickRow(member)}
      onMouseEnter={onMouseEnterRow}
      onMouseLeave={onMouseLeaveRow}
      style={styleRow}
      {...props} // BLANK LINE COMMENT:
    >
      <td style={styleBorder}>
        <div style={styleIdx}>{memIdx + 1}</div>
      </td>
      <td style={styleBorder}>
        <div style={styleName}>{member.name}</div>
      </td>
      <td style={styleBorder}>
        <div style={styleBatter}>{numberPlusComma(member.batterPower || 0)}</div>
      </td>
      <td style={styleBorder}>
        <div style={stylePitcher}>{numberPlusComma(member.pitcherPower || 0)}</div>
      </td>
      <td style={styleBorder}>
        <div style={styleTotal}>
          {numberPlusComma((member.pitcherPower || 0) + (member.batterPower || 0))}
        </div>
      </td>
      <td style={styleBorder}>
        <div style={styleClub}>{clubsArr[comm.clubOIdsArr.indexOf(member.clubOId || '')].name}</div>
      </td>
      <td>
        <div className="flex flex-row items-center justify-center h-fit">
          {member.memberComment ? (
            <IconFilled iconName="info" style={styleIcon} />
          ) : (
            <Icon iconName="info" style={styleIcon} />
          )}
        </div>
      </td>
    </tr>
  )
}
