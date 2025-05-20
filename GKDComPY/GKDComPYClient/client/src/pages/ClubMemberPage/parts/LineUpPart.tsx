import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {MemberInfoBlock, MemberLineUpBlock, MemberRecentBlock} from '../blocks'
import {VerticalLine} from '../addons'
import {useClubContext} from '../../../contexts'
import {useClubMemberStatesContext} from '../_contexts'

type LineUpPartProps = DivCommonProps & {}
export const LineUpPart: FC<LineUpPartProps> = ({className, ...props}) => {
  const {members} = useClubContext()
  const {memOId} = useClubMemberStatesContext()

  const [moveClicked, setMoveClicked] = useState<boolean>(false)

  const member = members[memOId]

  const styleBg: CSSProperties = {
    borderColor: '#F8B8B8',
    borderWidth: '6px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'row',
    maxHeight: '100%',

    overflow: 'auto',

    paddingLeft: '32px',
    paddingRight: '32px',
    paddingTop: '24px',
    paddingBottom: '24px',

    width: '1080px',
    height: '1000px'
  }
  const styleLeft: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100%',
    width: '320px'
  }

  const onClickBackGround = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setMoveClicked(false)
  }, [])

  if (!memOId || !member) return null
  return (
    <div
      className={`LINE_UP_PART ${className || ''}`}
      onClick={onClickBackGround}
      style={styleBg}
      {...props} // BLANK LINE COMMENT:
    >
      <div className="MEM_INFO_DIV " style={styleLeft}>
        <MemberInfoBlock
          member={member}
          moveClicked={moveClicked}
          setMoveClicked={setMoveClicked}
        />
        <MemberRecentBlock member={member} />
      </div>
      <VerticalLine className="ml-8" heightPx={900} />
      <MemberLineUpBlock className="ml-8" member={member} />
    </div>
  )
}
