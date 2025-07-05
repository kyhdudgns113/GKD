import {SAKURA_BORDER, SAKURA_TEXT} from '@value'

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
    ...style,

    borderColor: SAKURA_BORDER,
    borderWidth: '2px',

    display: 'flex',
    flexDirection: 'column',

    height: 'fit-content',

    width: '100%'
  }
  const styleNoComments: CSSProperties = {
    color: SAKURA_TEXT,
    fontSize: '20px',
    fontWeight: 'bold',

    height: '160px',
    textAlign: 'center'
  }

  if (commentsArr.length === 0) return <div style={styleNoComments}>댓글이 없습니다.</div>

  return (
    <div
      className={`COMMENTS_ARR_PART ${className || ''}`}
      style={stylePart}
      {...props} // ::
    >
      {commentsArr.map((comment, cmtIdx) => (
        <CommentObject key={cmtIdx} comment={comment} />
      ))}
    </div>
  )
}
