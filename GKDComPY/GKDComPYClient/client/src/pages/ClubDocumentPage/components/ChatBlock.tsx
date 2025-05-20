import {CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../common'
import {ChatType} from '../../../common/typesAndValues/shareTypes'
import {useAuthContext} from '../../../contexts'

type ChatBlockProps = DivCommonProps & {
  chat: ChatType
}
export const ChatBlock: FC<ChatBlockProps> = ({chat, className, ...props}) => {
  const {uOId} = useAuthContext()

  const isMyChat = uOId === chat.uOId

  const styleBlock: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: isMyChat ? 'auto' : '',
    marginTop: '4px',
    maxWidth: '70%',
    width: 'fit-content'
  }
  const styleContent: CSSProperties = {
    backgroundColor: 'white',
    borderColor: SAKURA_BORDER,
    borderRadius: '8px',
    borderWidth: '4px',
    boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)',
    marginLeft: isMyChat ? 'auto' : '',
    padding: '4px',
    whiteSpace: 'pre-wrap',
    width: 'fit-content'
  }
  const styleId: CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: '1.75rem',
    marginLeft: isMyChat ? 'auto' : ''
  }

  return (
    <div className={`${className}`} style={styleBlock} {...props}>
      <p style={styleId}>{chat.id}</p>
      <p style={styleContent}>{chat.content}</p>
    </div>
  )
}
