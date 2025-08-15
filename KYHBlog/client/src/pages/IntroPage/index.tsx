import {IntroPageLayout} from './IntroPageLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type IntroPageProps = DivCommonProps & {}

export const IntroPage: FC<IntroPageProps> = ({className, style, ...props}) => {
  return <IntroPageLayout className={className} style={style} {...props} />
}
