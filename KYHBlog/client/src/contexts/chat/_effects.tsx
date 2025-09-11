import {createContext, useContext, useEffect} from 'react'
import {useAuthStatesContext, useChatCallbacksContext, useChatStatesContext, useSocketCallbacksContext, useSocketStatesContext} from '@context'

import * as SCK from '@socketType'
import * as U from '@util'
import {decodeJwtFromServer, encodeJwtFromClient, jwtHeaderLenBase} from '@secret'

import type {FC, PropsWithChildren} from 'react'
import type {ChatRoomType, ChatType} from '@shareType'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const ChatEffectsContext = createContext<ContextType>({})

export const useChatEffectsContext = () => useContext(ChatEffectsContext)

export const ChatEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {socket} = useSocketStatesContext()
  const {emitSocket, onSocket} = useSocketCallbacksContext()
  const {socketValidated, userOId} = useAuthStatesContext()
  const {chatArr, chatQueue, chatRoomOId, loadedChatRoomOId, chatAreaRef, chatRoomArrRef, goToBottom} = useChatStatesContext()
  const {setChatArr, setChatQueue, setChatRoom, setChatRoomArr, setGoToBottom, setChatRoomOId, setLoadedChatRoomOId} = useChatStatesContext()
  const {loadChatArr, loadChatRoomArr} = useChatCallbacksContext()

  // 초기화: chatRoomArr 불러오기
  useEffect(() => {
    if (userOId) {
      loadChatRoomArr(userOId)
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: chatRoom, chatArr
  useEffect(() => {
    if (chatRoomOId && chatRoomOId !== loadedChatRoomOId) {
      const chatRoom = chatRoomArrRef.current.find(chatRoom => chatRoom.chatRoomOId === chatRoomOId)
      if (chatRoom) {
        setChatRoom(chatRoom)
        loadChatArr(chatRoomOId, -1)
      }
    }
  }, [chatRoomOId, loadedChatRoomOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: 로그아웃시 초기화
  useEffect(() => {
    if (!userOId) {
      setChatArr([])
      setChatQueue([])
      setChatRoomArr([])
      setChatRoomOId('')
      setGoToBottom(false)
      setLoadedChatRoomOId('')
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 소켓 수신(chatRoom opened): 채팅방 어디선가 열렸을때
  useEffect(() => {
    if (socket) {
      onSocket(socket, 'chatRoom opened', (payload: SCK.ChatRoomOpenedType) => {
        const {chatRoomOId} = payload
        const chatRoom = chatRoomArrRef.current.find(chatRoom => chatRoom.chatRoomOId === chatRoomOId)
        if (chatRoom) {
          setChatRoomArr(prev => {
            const newPrev = [...prev]
            const index = newPrev.findIndex(chatRoom => chatRoom.chatRoomOId === chatRoomOId)
            if (index !== -1) {
              newPrev[index].unreadMessageCount = 0
            }
            return newPrev
          })
        } // ::
        else {
          loadChatRoomArr(userOId)
        }
      })
    }
  }, [socket, userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 소켓 수신(new chat room): 새 채팅방 생겼을때
  useEffect(() => {
    if (socket) {
      onSocket(socket, 'new chat room', (payload: SCK.NewChatRoomCreatedType) => {
        const {chatRoomOId, chatRoomName, targetUserId, targetUserMail, targetUserName, targetUserOId, unreadMessageCount, lastChatDate} = payload
        const newChatRoom: ChatRoomType = {
          chatRoomOId,
          chatRoomName,
          targetUserId,
          targetUserMail,
          targetUserName,
          targetUserOId,
          unreadMessageCount,
          lastChatDate
        }
        setChatRoomArr(prev => [newChatRoom, ...prev])
      })
    }
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps

  // 소켓 수신(new chat): 채팅방에 채팅이 올 때
  useEffect(() => {
    if (socket) {
      onSocket(socket, 'new chat', (payload: SCK.NewChatType) => {
        const {chatRoomOId, chatIdx, content, createdAt, userOId, userName} = payload
        const newChat: ChatType = {chatRoomOId, chatIdx, content, createdAt, userOId, userName}
        setChatQueue(prev => [newChat, ...prev])
      })
    }
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps

  // 소켓 수신(refresh chat room): 안 읽은 메시지 갱신될 때
  useEffect(() => {
    if (socket && userOId) {
      onSocket(socket, 'refresh chat room', (payload: SCK.RefreshChatRoomType) => {
        const {chatRoomOId, unreadMessageCount} = payload
        const chatRoom = chatRoomArrRef.current.find(chatRoom => chatRoom.chatRoomOId === chatRoomOId)
        if (chatRoom) {
          setChatRoomArr(prev => {
            const newChatRoomArr = [...prev]
            const index = newChatRoomArr.findIndex(chatRoom => chatRoom.chatRoomOId === chatRoomOId)
            if (index !== -1) {
              newChatRoomArr[index].unreadMessageCount = unreadMessageCount
            }
            return newChatRoomArr
          })
        } // ::
        else {
          loadChatRoomArr(userOId)
        }
      })
    }
  }, [socket, userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 소켓 송신(chatRoom connect, chatRoom disconnect): 채팅방 옮길때: 이전 채팅방 연결 종료 포함
  useEffect(() => {
    // 소켓이 인증이 되어있어야만 채팅소켓에 연결할 수 있다.
    // 누가 먼저 실행될지 모르니 이걸 해준다.
    if (socket && chatRoomOId && userOId && socketValidated) {
      U.readStringP('jwtFromServer').then(jwtFromServer => {
        if (!jwtFromServer) {
          alert('왜 토큰이 없지')
          return
        }

        const {header, jwtBody} = decodeJwtFromServer(jwtFromServer || '', jwtHeaderLenBase)
        const jwtFromClient = encodeJwtFromClient(header, jwtBody)
        const payload: SCK.ChatRoomConnectType = {chatRoomOId, userOId, jwtFromClient}
        emitSocket(socket, 'chatRoom connect', payload)
      })
    }

    return () => {
      if (socket && chatRoomOId && userOId && socketValidated) {
        const payload: SCK.ChatRoomDisconnectType = {chatRoomOId, userOId}
        emitSocket(socket, 'chatRoom disconnect', payload)
      }
    }
  }, [chatRoomOId, socket, socketValidated, userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 채팅 메시지 이동: chatQueue -> chatArr
  useEffect(() => {
    if (chatRoomOId && chatRoomOId === loadedChatRoomOId && chatQueue.length > 0) {
      const chat = chatQueue[0]
      if (chat.chatRoomOId === chatRoomOId) {
        setChatArr(prev => [...prev, chat])

        if (chatAreaRef.current) {
          const {clientHeight, scrollHeight, scrollTop} = chatAreaRef.current
          if (scrollTop + clientHeight >= scrollHeight) {
            setGoToBottom(true)
          }
        }
      }
      setChatQueue(prev => {
        const newPrev = [...prev]
        newPrev.splice(0, 1)
        return newPrev
      })
    }
  }, [chatQueue, chatRoomOId, loadedChatRoomOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 채팅방 스크롤 맨 밑으로 내리기
  useEffect(() => {
    if (chatAreaRef.current && goToBottom) {
      const {clientHeight, scrollHeight, scrollTop} = chatAreaRef.current
      if (scrollTop + clientHeight < scrollHeight) {
        chatAreaRef.current.scrollTo({top: scrollHeight, behavior: 'smooth'})
        setGoToBottom(false)
      }
    }
  }, [chatArr, goToBottom]) // eslint-disable-line react-hooks/exhaustive-deps

  return <ChatEffectsContext.Provider value={{}}>{children}</ChatEffectsContext.Provider>
}
