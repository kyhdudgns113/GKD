import {RighterLayout} from './RighterLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({className, style, ...props}) => {
  return <RighterLayout className={className} style={style} {...props} />
}
