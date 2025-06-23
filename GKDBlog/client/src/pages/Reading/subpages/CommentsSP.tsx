import {CommentAddPart, CommentsArrPart} from '../parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import {MarginHeightBlock} from '@components/MarginBlocks'

type CommentsSPProps = DivCommonProps & {}

/**
 * CommentsSP
 *   1. 댓글 작성란
 *   2. 댓글 목록
 */
export const CommentsSP: FC<CommentsSPProps> = ({className, style, ...props}) => {
  const styleSP: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    width: '800px'
  }

  return (
    <div className={`COMMENTS_SP ${className || ''}`} style={styleSP} {...props}>
      {/* 1. 댓글 작성란 */}
      <CommentAddPart />

      <MarginHeightBlock height="32px" />

      {/* 2. 댓글 목록 */}
      <CommentsArrPart />
    </div>
  )
}
