import {ClubRecordCallbacks, ClubRecordEffects, ClubRecordStates} from './_contexts'
import {ClubRecordPageLayout} from './ClubRecordPageLayout'

export function ClubRecordPage() {
  return (
    <ClubRecordStates>
      <ClubRecordCallbacks>
        <ClubRecordEffects>
          <ClubRecordPageLayout />
        </ClubRecordEffects>
      </ClubRecordCallbacks>
    </ClubRecordStates>
  )
}
