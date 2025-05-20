import {FC} from 'react'
import {DivCommonProps} from '../../common'
import {NullPageEffects} from './_context'
import {NullPageStates} from './_context'
import {NullPageCallbacks} from './_context'
import {NullPageLayout} from './NullPageLayout'

type NullPageProps = DivCommonProps & {}
export const NullPage: FC<NullPageProps> = ({className, ...props}) => {
  return (
    <NullPageStates>
      <NullPageCallbacks>
        <NullPageEffects>
          <NullPageLayout className={className} {...props} />
        </NullPageEffects>
      </NullPageCallbacks>
    </NullPageStates>
  )
}
