import {MainPageCallbacks, MainPageEffects, MainPageStates} from './_contexts'
import {MainPageLayout} from './MainPageLayout'

export function MainPage() {
  return (
    <MainPageStates>
      <MainPageCallbacks>
        <MainPageEffects>
          <MainPageLayout />
        </MainPageEffects>
      </MainPageCallbacks>
    </MainPageStates>
  )
}
