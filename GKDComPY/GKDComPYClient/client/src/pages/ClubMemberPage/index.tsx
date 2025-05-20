import {ClubMemberCallbacks, ClubMemberEffects, ClubMemberStates} from './_contexts'
import {ClubMemberPageLayout} from './ClubMemberPageLayout'

export function ClubMemberPage() {
  return (
    <ClubMemberStates>
      <ClubMemberCallbacks>
        <ClubMemberEffects>
          <ClubMemberPageLayout />
        </ClubMemberEffects>
      </ClubMemberCallbacks>
    </ClubMemberStates>
  )
}
