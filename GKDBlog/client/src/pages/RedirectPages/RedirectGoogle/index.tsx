import {RedirectGoogleLayout} from './RedirectGoogleLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RedirectGooglePageProps = DivCommonProps & {}

export const RedirectGooglePage: FC<RedirectGooglePageProps> = ({className, ...props}) => {
  return <RedirectGoogleLayout className={className} {...props} />
}
