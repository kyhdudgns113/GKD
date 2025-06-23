import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

type ReplyContentBlockProps = DivCommonProps & {
  reply: ReplyType
}

/* eslint-disable */
export const ReplyContentBlock: FC<ReplyContentBlockProps> = ({
  reply,
  className,
  style,
  ...props
}) => {
  const styleBlock: CSSProperties = {
    ...style,

    alignItems: 'center',

    display: 'flex',
    flexDirection: 'row',

    height: 'fit-content',

    width: '100%'
  }
  const styleNameContent: CSSProperties = {
    borderColor: '#CCCCCC',
    borderRadius: '4px',
    borderWidth: '1px',
    fontSize: '16px',

    marginRight: '8px',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: '100%'
  }
  return (
    <div className={`REPLY_HEAD_CONTENT ${className || ''}`} style={styleBlock} {...props}>
      <p style={styleNameContent}>
        <b style={{fontSize: '17px'}}>
          <i>{reply.targetUserName}</i>
        </b>
        {'  '}
        {reply.content}
      </p>
    </div>
  )
}
/* eslint-enable */
