import {RedirectMainPageLayout} from './RedirectMainPageLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RedirectMainPageProps = DivCommonProps & {}

export const RedirectMainPage: FC<RedirectMainPageProps> = ({className, style, ...props}) => {
  return <RedirectMainPageLayout className={className} style={style} {...props} />
}
