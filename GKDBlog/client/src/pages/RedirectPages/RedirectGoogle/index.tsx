import type {FC} from 'react'
import type {DivCommonProps} from '../../../common'
import {RedirectGoogleLayout} from './RedirectGoogleLayout'

type RedirectGooglePageProps = DivCommonProps & {}

export const RedirectGooglePage: FC<RedirectGooglePageProps> = ({className, ...props}) => {
  return <RedirectGoogleLayout className={className} {...props} />
}
