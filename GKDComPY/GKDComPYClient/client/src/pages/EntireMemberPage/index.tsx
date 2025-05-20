import {EntireMemberCallbacks, EntireMemberEffects, EntireMemberStates} from './_contexts'
import {EntireMemberPageLayout} from './EntireMemberPageLayout'

export function EntireMemberPage() {
  return (
    <EntireMemberStates>
      <EntireMemberCallbacks>
        <EntireMemberEffects>
          <EntireMemberPageLayout />
        </EntireMemberEffects>
      </EntireMemberCallbacks>
    </EntireMemberStates>
  )
}
