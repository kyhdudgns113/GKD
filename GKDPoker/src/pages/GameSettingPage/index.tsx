import {FC} from 'react'
import {DivCommonProps} from '../../common'
import {GameSettingCallbacks, GameSettingEffects, GameSettingStates} from './_context'
import {GameSettingLayout} from './GameSettingPageLayout'

type GameSettingPageProps = DivCommonProps & {}
export const GameSettingPage: FC<GameSettingPageProps> = ({className, ...props}) => {
  return (
    <GameSettingStates>
      <GameSettingCallbacks>
        <GameSettingEffects>
          <GameSettingLayout className={className} {...props} />
        </GameSettingEffects>
      </GameSettingCallbacks>
    </GameSettingStates>
  )
}
