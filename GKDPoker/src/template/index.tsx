import {FC} from 'react'
import {DivCommonProps} from '../common'
import {
  TemplateCallbacks,
  TemplateEffects,
  TemplateGameStates,
  TemplateStates,
  TemplateTableStates,
  TemplateUserStates
} from './_context'
import {TemplateLayout} from './TemplateLayout'

type TemplateProps = DivCommonProps & {}
export const Template: FC<TemplateProps> = ({className, ...props}) => {
  return (
    <TemplateStates>
      <TemplateGameStates>
        <TemplateUserStates>
          <TemplateTableStates>
            <TemplateCallbacks>
              <TemplateEffects>
                <TemplateLayout className={className} {...props} />
              </TemplateEffects>
            </TemplateCallbacks>
          </TemplateTableStates>
        </TemplateUserStates>
      </TemplateGameStates>
    </TemplateStates>
  )
}
