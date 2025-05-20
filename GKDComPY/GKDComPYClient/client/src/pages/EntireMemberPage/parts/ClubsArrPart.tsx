import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {useEntireMemberStatesContext} from '../_contexts'
import {ClubMembersGroup} from '../groups'
import {useTemplateStatesContext} from '../../../template/_contexts'

type ClubsArrPartProps = DivCommonProps & {}

export const ClubsArrPart: FC<ClubsArrPartProps> = ({className, ...props}) => {
  const {comm} = useTemplateStatesContext()
  const {eMembersMatrix} = useEntireMemberStatesContext()

  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '16px'
  }

  return (
    <div className={`${className}`} style={styleDiv} {...props}>
      {eMembersMatrix.map((eMembersArr, colIdx) => {
        const {clubOIdsArr} = comm
        const lenClubs = clubOIdsArr.length
        const clubOId = clubOIdsArr[(colIdx + 1) % lenClubs]
        return <ClubMembersGroup clubOId={clubOId} key={colIdx} colIdx={colIdx} />
      })}
    </div>
  )
}
