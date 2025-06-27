import {useCallback, useEffect, useState} from 'react'

import {OtherChatBlock, UserChatBlock} from '../blocks'

import {useAuthStatesContext} from '@contexts/auth/__states'

import type {Setter} from '@type'
import type {DivCommonProps} from '@prop'
import type {ChatType} from '@shareType'
import type {CSSProperties, FC, MouseEvent, RefObject} from 'react'
import {useUserCallbacksContext} from '@contexts/user/_callbacks'

type RoomBodyObjectProps = DivCommonProps & {
  chatArr: ChatType[]
  divRef: RefObject<HTMLDivElement | null>
  setChatArr: Setter<ChatType[]>
}

export const RoomBodyObject: FC<RoomBodyObjectProps> = ({
  chatArr,
  divRef,
  setChatArr,
  // ::
  className,
  style,
  ...props
}) => {
  const {userOId} = useAuthStatesContext()
  const {getChatArr} = useUserCallbacksContext()

  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState<boolean>(false)

  const styleObject: CSSProperties = {
    ...style,

    backgroundColor: '#F8FFF8',

    borderColor: '#888888',
    borderBottomWidth: '4px',
    borderTopWidth: '4px',

    display: 'flex',
    flexDirection: 'column',

    height: '480px',

    overflowY: 'auto',

    width: '100%'
  }
  const styleMoreBtn: CSSProperties = {
    backgroundColor: '#CCCCCC88',
    cursor: 'pointer',

    paddingBottom: '4px',
    paddingTop: '4px',

    textAlign: 'center',
    userSelect: 'none'
  }

  const onClickLoadMore = useCallback(
    (chatArr: ChatType[]) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (chatArr.length > 0) {
        getChatArr(chatArr[0].chatRoomOId, setChatArr, null, chatArr[0].chatIndex)
      }
    },
    [getChatArr, setChatArr]
  )

  // 이전 메시지 불러오기버튼 활성화/비활성화
  useEffect(() => {
    if (chatArr.length > 0) {
      const isFirstChatNotZero = chatArr[0].chatIndex !== 0

      if (isFirstChatNotZero) {
        setShowLoadMoreBtn(true)
      } // ::
      else {
        setShowLoadMoreBtn(false)
      }
    } // ::
    else {
      setShowLoadMoreBtn(false)
    }
  }, [chatArr])

  return (
    <div className={`ROOM_BODY_OBJECT ${className || ''}`} ref={divRef} style={styleObject} {...props}>
      {/* 1. 버튼: 이전 메시지 불러오기 */}
      {showLoadMoreBtn && (
        <div onClick={onClickLoadMore(chatArr)} style={styleMoreBtn}>
          이전 메시지 불러오기
        </div>
      )}

      {/* 2. 메시지 블록 배열 */}
      {chatArr.map(chat => {
        if (chat.userOId === userOId) {
          return <UserChatBlock chat={chat} key={chat.chatIndex} />
        } // ::
        else {
          return <OtherChatBlock chat={chat} key={chat.chatIndex} />
        } // ::
      })}
    </div>
  )
}
