import {SAKURA_BORDER} from '@value'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentShowGroupProps = DivCommonProps & {
  comment: CommentType
}

export const CommentShowGroup: FC<CommentShowGroupProps> = ({comment, className, style, ...props}) => {
  const styleGroup: CSSProperties = {
    ...style,

    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',

    display: 'flex',
    flexDirection: 'column',

    paddingBottom: '4px',
    paddingLeft: '20px',
    paddingRight: '20px',

    width: '100%'
  }
  const styleContent: CSSProperties = {
    fontSize: '16px',
    fontWeight: 400,

    minHeight: '32px',

    margin: '8px',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: 'auto'
  }

  return (
    <div className={`COMMENT_SHOW_GROUP ${className || ''}`} style={styleGroup} {...props}>
      <p style={styleContent}>{comment.content}</p>
    </div>
  )
}
