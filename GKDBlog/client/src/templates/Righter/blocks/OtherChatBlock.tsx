import type {ChatType} from '@shareType'
import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC} from 'react'

type OtherChatBlockProps = DivCommonProps & {
  chat: ChatType
}

export const OtherChatBlock: FC<OtherChatBlockProps> = ({chat, className, style, ...props}) => {
  const styleObject: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',

    marginBottom: '5px',
    marginTop: '5px'
  }
  // const styleName: CSSProperties = {
  //   fontSize: '12px',
  //   fontWeight: 'bold'
  // }
  const styleContent: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderColor: '#888888',
    borderWidth: '1px',
    borderRadius: '8px',

    fontSize: '14px',

    marginLeft: '8px',
    maxWidth: '70%',
    padding: '8px',

    width: 'fit-content'
  }

  return (
    <div className={`OTHER_CHAT_BLOCK ${className || ''}`} style={styleObject} {...props}>
      {/* 1. 유저 이름 */}
      {/* <p style={styleName}>{chat.userName}</p> */}

      {/* 2. 메시지 내용 */}
      <div style={styleContent}>{chat.content}</div>
    </div>
  )
}
