import {ReadingPageLayout} from './ReadingLayout'
import {ReadingPageProvider} from './_contexts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingPageProps = DivCommonProps & {}

export const ReadingPage: FC<ReadingPageProps> = ({className, ...props}) => {
  return (
    <ReadingPageProvider>
      <ReadingPageLayout className={className} {...props} />
    </ReadingPageProvider>
  )
}
