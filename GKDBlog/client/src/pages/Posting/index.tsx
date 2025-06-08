import {PostingPageLayout} from './PostingLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type PostingPageProps = DivCommonProps & {}

/**
 * import 를 이쁘게 하기 위한 불필요한 코드
 */
export const PostingPage: FC<PostingPageProps> = ({className, ...props}) => {
  return <PostingPageLayout className={className} {...props} />
}
