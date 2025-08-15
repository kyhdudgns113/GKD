import {NullPageLayout} from './NullPageLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type NullPageProps = DivCommonProps & {}

export const NullPage: FC<NullPageProps> = ({className, style, ...props}) => {
  return <NullPageLayout className={className} style={style} {...props} />
}
