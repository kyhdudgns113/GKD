import type {FC} from 'react'
import type {DivCommonProps} from '../../../common'
import {RedirectErrMsgLayout} from './RedirectErrMsgLayout'

type RedirectErrMsgPageProps = DivCommonProps & {}

export const RedirectErrMsgPage: FC<RedirectErrMsgPageProps> = ({className, ...props}) => {
  return <RedirectErrMsgLayout className={className} {...props} />
}
