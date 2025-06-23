import {SAKURA_BORDER} from '@value'

import {useReadingPageStatesContext} from '../_contexts/__states'

import {CommentObject} from '../objects'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type CommentsArrPartProps = DivCommonProps & {}

/**
 * 댓글 목록 파트
 * - 큰 파트 블록 안에 댓글 블록들을 배치한다.
 */
export const CommentsArrPart: FC<CommentsArrPartProps> = ({className, style, ...props}) => {
  const {commentsArr} = useReadingPageStatesContext()

  const stylePart: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '2px',

    display: 'flex',
    flexDirection: 'column',

    height: 'fit-content'
  }

  return (
    <div
      className={`COMMENTS_ARR_PART ${className || ''}`}
      style={{...stylePart, ...style}}
      {...props} // ::
    >
      {commentsArr.map((comment, cmtIdx) => (
        <CommentObject key={cmtIdx} comment={comment} />
      ))}
    </div>
  )
}
