import type {ChatType} from '@shareType'
import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC} from 'react'

type UserChatBlockProps = DivCommonProps & {
  chat: ChatType
}

export const UserChatBlock: FC<UserChatBlockProps> = ({chat, className, style, ...props}) => {
  const styleObject: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',

    marginBottom: '5px',
    marginLeft: 'auto',
    marginTop: '5px',

    width: '100%'
  }
  // const styleName: CSSProperties = {
  //   fontSize: '12px',
  //   fontWeight: 'bold'
  // }
  const styleContent: CSSProperties = {
    backgroundColor: '#FFFFAA',
    borderColor: '#888888',
    borderWidth: '1px',
    borderRadius: '8px',

    fontSize: '14px',

    marginLeft: 'auto',
    marginRight: '8px',

    maxWidth: '70%',
    padding: '8px',

    width: 'fit-content'
  }

  return (
    <div className={`USER_CHAT_BLOCK ${className || ''}`} style={styleObject} {...props}>
      {/* 1. 유저 이름 */}
      {/* <p style={styleName}>{chat.userName}</p> */}

      {/* 2. 메시지 내용 */}
      <div style={styleContent}>{chat.content}</div>
    </div>
  )
}
