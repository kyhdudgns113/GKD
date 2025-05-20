import {DocumentCallbacks, DocumentEffects, DocumentStates} from './_contexts'
import {ClubDocumentPageLayout} from './ClubDocumentPageLayout'

export function ClubDocumentPage() {
  return (
    <DocumentStates>
      <DocumentCallbacks>
        <DocumentEffects>
          <ClubDocumentPageLayout />
        </DocumentEffects>
      </DocumentCallbacks>
    </DocumentStates>
  )
}
