import {CSSProperties, FC, useCallback, KeyboardEvent} from 'react'
import {DivCommonProps} from '../../common'
import {MemberListPart} from './parts'
import {LineUpPart} from './parts'
import {ModalDelMemberPart} from './parts'
import {ModalAddMemberPart} from './parts'
import {useClubMemberStatesContext} from './_contexts'
import {useClubContext} from '../../contexts'

type ClubMemberPageLayoutProps = DivCommonProps & {}

export const ClubMemberPageLayout: FC<ClubMemberPageLayoutProps> = ({className, ...props}) => {
  const {delMemOId, setKeyDownESC, setMemOId} = useClubMemberStatesContext()
  const {isAddMemModal} = useClubContext()

  const styleDivMain: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    paddingTop: '36px',
    width: 'fit-content'
  }

  const onKeyDownDivMain = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Escape':
          setKeyDownESC(true)
          break
      }
    },
    [setKeyDownESC]
  )

  return (
    <div
      className={`PAGE_CLUB_MEMBER ${className || ''}`}
      onClick={e => setMemOId('')}
      onKeyDown={onKeyDownDivMain}
      style={styleDivMain}
      tabIndex={0}
      {...props} // BLANK LINE COMMENT:
    >
      <MemberListPart />
      <LineUpPart className="ml-8" />

      {isAddMemModal && <ModalAddMemberPart />}
      {delMemOId && <ModalDelMemberPart />}
    </div>
  )
}
