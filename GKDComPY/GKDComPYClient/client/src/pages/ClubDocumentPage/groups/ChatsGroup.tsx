import {CSSProperties, FC, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Text3XL} from '../../../common/components'
import {ChatBlock, ReadPrevMessage} from '../components'
import {useChattingPartStatesContext} from '../parts'
type ChatsGroupProps = DivCommonProps & {}
export const ChatsGroup: FC<ChatsGroupProps> = ({className, ...props}) => {
  const {chatDivRef, chatsArr, isLoaded} = useChattingPartStatesContext()

  const [scrollTop, setScrollTop] = useState<number>(0)

  const styleLoading: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }

  // 로딩중일때 띄우는 화면
  if (!isLoaded) {
    return (
      <div className={`${className}`} style={styleLoading} {...props}>
        <Text3XL>Loading...</Text3XL>
      </div>
    )
  }

  return (
    <div
      className={`${className}`}
      onScroll={e => setScrollTop(chatDivRef?.current?.scrollTop || 0)}
      ref={chatDivRef}
      {...props} // BLANK LINE COMMENT:
    >
      {/* 이전 메시지 불러오기 버튼 */}
      {scrollTop === 0 && chatsArr.length > 0 && chatsArr[0].chatIdx > 0 && <ReadPrevMessage />}

      {/* 채팅 블록들 */}
      {chatsArr.map((chat, chatIdx) => (
        <ChatBlock chat={chat} key={`chat:${chatIdx}`} />
      ))}
    </div>
  )
}
