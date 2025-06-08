import {RedirectErrMsgLayout} from './RedirectErrMsgLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RedirectErrMsgPageProps = DivCommonProps & {}

export const RedirectErrMsgPage: FC<RedirectErrMsgPageProps> = ({className, ...props}) => {
  return <RedirectErrMsgLayout className={className} {...props} />
}
