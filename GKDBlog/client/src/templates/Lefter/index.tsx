import {LefterLayout} from './LefterLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type LefterProps = DivCommonProps & {}

export const Lefter: FC<LefterProps> = ({className, style, ...props}) => {
  return <LefterLayout className={className} style={style} {...props} />
}
