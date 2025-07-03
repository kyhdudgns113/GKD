import {useEffect, useRef, useState} from 'react'
import {RoomBodyObject, RoomFooterObject, RoomHeaderObject} from '../objects'

import {useModalStatesContext} from '@contexts/modal/__states'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useSocketStatesContext} from '@contexts/socket/__states'
import {useSocketCallbacksContext} from '@contexts/socket/_callbacks'
import {useUserCallbacksContext} from '@contexts/user/_callbacks'

import {NULL_CHAT_ROOM} from '@nullValue'

import type {ChatRoomType, ChatType} from '@shareType'
import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type ChatRoomPartProps = DivCommonProps & {}

/**
 * 채팅방 + 닫기 버튼으로 구성되어있다.
 */
export const ChatRoomPart: FC<ChatRoomPartProps> = ({className, style, ...props}) => {
  const {openChatRoomOId} = useModalStatesContext()
  const {userOId} = useAuthStatesContext()
  const {chatSocket} = useSocketStatesContext()
  const {connectChatSocket, disconnectChatSocket, onChatSocket} = useSocketCallbacksContext()
  const {getChatArr, getChatRoom} = useUserCallbacksContext()

  const [chatArr, setChatArr] = useState<ChatType[]>([])
  const [chatQueue, setChatQueue] = useState<ChatType[]>([])
  const [chatRoom, setChatRoom] = useState<ChatRoomType>(NULL_CHAT_ROOM)

  const bodyDivRef = useRef<HTMLDivElement>(null)
  /**
   * isConnected: 소켓이 연결되었는지 여부
   *   - 소켓이 연결되고 DB 연결을 시도한다.
   * isDBLoaded: DB 에서 로딩 되었는지 여부
   *   - DB 연결이 된 이후부터 Queue 에 있는게 arr 로 넘어가기 시작한다.
   */
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isDBLoaded, setIsDBLoaded] = useState<boolean>(false)
  const [goToBot, setGoToBot] = useState<boolean>(true)

  const stylePart: CSSProperties = {
    ...style,

    backgroundColor: '#F0F0F0',

    borderColor: '#888888',
    borderRadius: '8px',
    borderWidth: '4px',

    boxShadow: '0px 0px 8px 0 rgba(0, 0, 0, 0.2)',

    height: 'fit-content',

    marginRight: '16px',
    marginTop: '60px',

    width: '320px'
  }

  /**
   * chatRoom 데이터 가져오기
   * - 채팅 목록은 여기서 안 가져온다.
   */
  useEffect(() => {
    if (openChatRoomOId) {
      getChatRoom(openChatRoomOId, setChatRoom)
    }
  }, [openChatRoomOId, getChatRoom])

  /**
   * 채팅 소켓을 연결 혹은 해제한다.
   */
  useEffect(() => {
    if (userOId && openChatRoomOId) {
      connectChatSocket(openChatRoomOId)
      setIsConnected(true)
    } // ::
    else {
      disconnectChatSocket()
      setIsConnected(false)
    }
  }, [openChatRoomOId, userOId, connectChatSocket, disconnectChatSocket])

  /**
   * 채팅 소켓에 이벤트 리스너를 부착한다.
   * - 메시지 수신
   */
  useEffect(() => {
    if (chatSocket) {
      onChatSocket('chatMessage', (chat: ChatType) => {
        setChatQueue(prev => [...prev, chat])
      })
    }
  }, [chatSocket, onChatSocket])

  /**
   * DB 에서 채팅 목록을 가져온다.
   */
  useEffect(() => {
    if (openChatRoomOId && isConnected && !isDBLoaded) {
      getChatArr(openChatRoomOId, setChatArr, setIsDBLoaded, setGoToBot)
    }
  }, [isConnected, isDBLoaded, openChatRoomOId, getChatArr])

  /**
   * chatQueue 에 있는걸 chatArr 로 넘긴다.
   */
  useEffect(() => {
    /**
     * 1. chatQueue 맨 앞에 있는 채팅을 빼낸다.
     * 2. chatArr 의 맨 마지막 채팅과 비교한다.
     *   2-1. chatArr 것의 인덱스가 더 작으면 chatArr 에 추가한다.
     *   2-2. 그게 아니면 추가하지 않는다.
     */
    if (chatQueue.length > 0) {
      const newChatQueue = [...chatQueue]
      const newChatArr = [...chatArr]
      const frontChat = newChatQueue.shift()

      if (!frontChat) return

      if (newChatArr.length > 0) {
        const lastChat = newChatArr[newChatArr.length - 1]

        if (lastChat.chatIndex < frontChat.chatIndex) {
          /**
           * queue 에 있는 채팅이 더 나중에 입력된 채팅이면 배열에 넣는다.
           * - 인덱스 차이가 2 이상인건 무시한다
           * - 나중에 새로고침으로 해결해도 된다.
           */
          newChatArr.push(frontChat)
          setChatArr(newChatArr)
          setChatQueue(newChatQueue)
        } // ::
        else {
          /**
           * queue 에 있던 채팅이 더 이전에 입력된 채팅이면 그냥 날린다.
           */
          setChatQueue(newChatQueue)
        }
      } // ::
      else {
        // chatArr 가 비어있으면 그냥 넣으면 된다.
        newChatArr.push(frontChat)
        setChatArr(newChatArr)
        setChatQueue(newChatQueue)
      }

      // 스크롤이 맨 아래에 있는 경우, 스크롤을 맨 아래로 내린다.
      if (bodyDivRef.current) {
        const scrollHeight = bodyDivRef.current.scrollHeight
        const clientHeight = bodyDivRef.current.clientHeight
        const scrollTop = bodyDivRef.current.scrollTop

        if (scrollHeight <= scrollTop + clientHeight) {
          setGoToBot(true)
        }
      }
    }
  }, [bodyDivRef, chatArr, chatQueue])

  /**
   * 스크롤을 맨 아래로 내린다
   */
  useEffect(() => {
    if (bodyDivRef.current && goToBot) {
      const {clientHeight, scrollHeight, scrollTop} = bodyDivRef.current
      if (scrollTop + clientHeight < scrollHeight) {
        bodyDivRef.current.scrollTop = scrollHeight
        setGoToBot(false)
      }
    }
  }, [bodyDivRef, chatArr, goToBot])

  return (
    <div className={`CHAT_ROOM_PART ${className || ''}`} style={stylePart} {...props}>
      {/* 1. 헤더: 이름, 닫기 버튼 */}
      <RoomHeaderObject chatRoom={chatRoom} />

      {/* 2. 몸통: 채팅 블록들 */}
      <RoomBodyObject chatArr={chatArr} divRef={bodyDivRef} setChatArr={setChatArr} />

      {/* 3. 푸터: 채팅 입력창 */}
      <RoomFooterObject />
    </div>
  )
}
