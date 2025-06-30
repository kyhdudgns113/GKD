import {DefaultPageProvider} from './contexts'
import {DefaultPageLayout} from './DefaultPageLayout'

import type {DivCommonProps} from '@prop'
import type {FC} from 'react'

type DefaultPageProps = DivCommonProps & {}

export const DefaultPage: FC<DefaultPageProps> = ({className, style, ...props}) => {
  return (
    <DefaultPageProvider>
      <DefaultPageLayout className={className} style={style} {...props} />
    </DefaultPageProvider>
  )
}
