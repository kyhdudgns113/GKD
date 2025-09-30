import {createContext, useCallback, useContext, useRef, useState} from 'react'
import {NULL_CHAT_ROOM} from '@nullValue'

import type {FC, PropsWithChildren, RefObject} from 'react'
import type {ChatRoomType, ChatType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  chatArr: ChatType[], setChatArr: Setter<ChatType[]>
  chatQueue: ChatType[], setChatQueue: Setter<ChatType[]>
  chatRoom: ChatRoomType, setChatRoom: Setter<ChatRoomType>
  chatRoomArr: ChatRoomType[], setChatRoomArr: Setter<ChatRoomType[]>
  chatRoomOId: string, setChatRoomOId: Setter<string>

  goToBottom: boolean, setGoToBottom: Setter<boolean>

  loadedChatRoomOId: string, setLoadedChatRoomOId: Setter<string>

  chatAreaRef: RefObject<HTMLDivElement | null>
  chatRoomArrRef: RefObject<ChatRoomType[]>
}
// prettier-ignore
export const ChatStatesContext = createContext<ContextType>({
  chatArr: [], setChatArr: () => {},
  chatQueue: [], setChatQueue: () => {},
  chatRoom: NULL_CHAT_ROOM, setChatRoom: () => {},
  chatRoomArr: [], setChatRoomArr: () => {},
  chatRoomOId: '', setChatRoomOId: () => {},

  goToBottom: false, setGoToBottom: () => {},

  loadedChatRoomOId: '', setLoadedChatRoomOId: () => {},

  chatAreaRef: {current: null},
  chatRoomArrRef: {current: []}
})

export const useChatStatesContext = () => useContext(ChatStatesContext)

export const ChatStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * chatArr: 채팅 목록. 채팅창에 띄워지는 채팅들이다.
   * chatQueue: 채팅 수신 대기 목록. 채팅방 로드가 완료되면 chatArr 로 이동한다.
   */
  const [chatArr, setChatArr] = useState<ChatType[]>([])
  const [chatQueue, setChatQueue] = useState<ChatType[]>([])
  /**
   * chatRoom: 현재 열린 채팅방의 정보
   * chatRoomArr: 채팅방 목록, Righter 에 띄워주는 용도이다
   * chatRoomOId: 현재 열린 채팅방의 OId
   */
  const [chatRoom, setChatRoom] = useState<ChatRoomType>(NULL_CHAT_ROOM)
  const [chatRoomArr, setChatRoomArr] = useState<ChatRoomType[]>([])
  const [chatRoomOId, setChatRoomOId] = useState<string>('')
  /**
   * goToBottom: 채팅방 스크롤을 맨 밑으로 내릴지 결정한다.
   */
  const [goToBottom, setGoToBottom] = useState<boolean>(false)
  /**
   * loadedChatRoomOId: 로드된 채팅방의 OId, 현재 채팅방이 로드되었나 확인용이다.
   */
  const [loadedChatRoomOId, setLoadedChatRoomOId] = useState<string>('')

  const chatAreaRef = useRef<HTMLDivElement | null>(null)
  const chatRoomArrRef = useRef<ChatRoomType[]>([])

  const _setChatRoomArr: Setter<ChatRoomType[]> = useCallback((newChatRoomArrOrFn: ChatRoomType[] | ((prev: ChatRoomType[]) => ChatRoomType[])) => {
    setChatRoomArr(prev => {
      const newChatRoomArr =
        typeof newChatRoomArrOrFn === 'function' ? (newChatRoomArrOrFn as (prev: ChatRoomType[]) => ChatRoomType[])(prev) : newChatRoomArrOrFn

      chatRoomArrRef.current = newChatRoomArr
      return newChatRoomArr
    })
  }, [])

  // prettier-ignore
  const value: ContextType = {
    chatArr, setChatArr,
    chatQueue, setChatQueue,
    chatRoom, setChatRoom,
    chatRoomArr, setChatRoomArr: _setChatRoomArr,
    chatRoomOId, setChatRoomOId,

    goToBottom, setGoToBottom,

    loadedChatRoomOId, setLoadedChatRoomOId,

    chatAreaRef,
    chatRoomArrRef,
  }

  return <ChatStatesContext.Provider value={value}>{children}</ChatStatesContext.Provider>
}
