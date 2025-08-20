import {CheckAuth} from '@guard'
import {ManageDirectoryPart} from './parts'

import './_styles/PostingPage.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type PostingPageProps = DivCommonProps & {reqAuth?: number}

export const PostingPage: FC<PostingPageProps> = ({reqAuth, className, style, ...props}) => {
  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`PostingPage ${className || ''}`} style={style} {...props}>
        <ManageDirectoryPart />
        <div>EditingFilePartDiv</div>
      </div>
    </CheckAuth>
  )
}
