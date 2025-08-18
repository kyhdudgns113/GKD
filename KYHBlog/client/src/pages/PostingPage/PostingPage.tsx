import {CheckAuth} from '@guard'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type PostingPageProps = DivCommonProps & {reqAuth?: number}

export const PostingPage: FC<PostingPageProps> = ({reqAuth, className, style, ...props}) => {
  const stylePostingPage: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  }

  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`PostingPage ${className || ''}`} style={stylePostingPage} {...props}>
        <p>PostingPage</p>
      </div>
    </CheckAuth>
  )
}
