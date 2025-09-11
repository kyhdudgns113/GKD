import {createContext, useCallback, useContext} from 'react'
import {useChatStatesContext} from './__states'
import {getWithJwt} from '@server'

import * as U from '@util'
import * as SCK from '@socketType'

import type {FC, PropsWithChildren} from 'react'
import type {SocketType} from '@type'

// prettier-ignore
type ContextType = {
  loadChatArr: (chatRoomOId: string, firstIdx: number) => void
  loadChatRoomArr: (userOId: string) => void
  loadUserChatRoom: (userOId: string, targetUserOId: string) => void

  selectChatRoom: (chatRoomOId: string) => void
  submitChat: (socket: SocketType, chatRoomOId: string, content: string) => void
  unselectChatRoom: () => void
}
// prettier-ignore
export const ChatCallbacksContext = createContext<ContextType>({
  loadChatArr: () => {},
  loadChatRoomArr: () => {},
  loadUserChatRoom: () => {},

  selectChatRoom: () => {},
  submitChat: () => {},
  unselectChatRoom: () => {}
})

export const useChatCallbacksContext = () => useContext(ChatCallbacksContext)

export const ChatCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setChatArr, setChatRoomOId, setChatRoomArr, setGoToBottom, setLoadedChatRoomOId} = useChatStatesContext()

  // AREA1: 외부 사용 함수(http 요청)

  const loadChatArr = useCallback((chatRoomOId: string, firstIdx: number) => {
    const url = `/client/chat/loadChatArr/${chatRoomOId}/${firstIdx}`

    getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setChatArr(body.chatArr)
          setLoadedChatRoomOId(chatRoomOId)
          setGoToBottom(true)
          U.writeJwtFromServer(jwtFromServer)
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadChatRoomArr = useCallback((userOId: string) => {
    const url = `/client/chat/loadChatRoomArr/${userOId}`

    getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setChatRoomArr(body.chatRoomArr)
          U.writeJwtFromServer(jwtFromServer)
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserChatRoom = useCallback((userOId: string, targetUserOId: string) => {
    /**
     * 채팅방의 정보만 가져온다
     *   - 채팅 리스트는 가져오지 않는다.
     */
    const url = `/client/chat/loadUserChatRoom/${userOId}/${targetUserOId}`

    getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setChatRoomOId(body.chatRoom.chatRoomOId)
          U.writeJwtFromServer(jwtFromServer)
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // AREA2: 외부 사용 함수(http 아님)

  const selectChatRoom = useCallback((chatRoomOId: string) => {
    setChatRoomOId(prev => {
      if (prev === chatRoomOId) {
        return ''
      }
      return chatRoomOId
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const submitChat = useCallback((socket: SocketType, chatRoomOId: string, content: string) => {
    if (socket && chatRoomOId && content.trim().length > 0) {
      const payload: SCK.ChatMessageType = {chatRoomOId, content}
      socket.emit('chat message', payload)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const unselectChatRoom = useCallback(() => {
    setChatRoomOId('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    loadChatArr,
    loadChatRoomArr,
    loadUserChatRoom,
    
    selectChatRoom,
    submitChat,
    unselectChatRoom,
  }
  return <ChatCallbacksContext.Provider value={value}>{children}</ChatCallbacksContext.Provider>
}
