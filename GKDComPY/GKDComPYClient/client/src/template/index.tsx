import {FC} from 'react'
import {DivCommonProps} from '../common'
import {TemplateCallbacks, TemplateEffects, TemplateStates} from './_contexts'
import {TemplateLayout} from './TemplateLayout'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({className, ...props}) => {
  // 여기서 이벤트 리스터 설정하면 states 나 hooks 잘 못 가져올 수 있다.
  return (
    <TemplateStates>
      <TemplateCallbacks>
        <TemplateEffects>
          <TemplateLayout className={className} {...props} />
        </TemplateEffects>
      </TemplateCallbacks>
    </TemplateStates>
  )
}
