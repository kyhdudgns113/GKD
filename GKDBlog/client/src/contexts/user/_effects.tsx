import {createContext, useContext, useEffect} from 'react'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useSocketStatesContext} from '@contexts/socket/__states'
import {useSocketCallbacksContext} from '@contexts/socket/_callbacks'

import {useUserCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'
import {useUserStatesContext} from './__states'
import type {SetUnreadChatPayloadType} from '@socketType'

// prettier-ignore
type ContextType = {}
export const UserEffectsContext = createContext<ContextType>({})

export const useUserEffectsContext = () => useContext(UserEffectsContext)

export const UserEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId} = useAuthStatesContext()

  const {mainSocket} = useSocketStatesContext()
  const {onMainSocket} = useSocketCallbacksContext()

  const {setNewAlarmArrLen, setChatRoomRowArr} = useUserStatesContext()
  const {getNewAlarmArrLen, getChatRoomRow, getChatRoomRowArr} = useUserCallbacksContext()

  /**
   * 안 읽은 알람갯수 불러오기
   */
  useEffect(() => {
    if (userOId) {
      getNewAlarmArrLen()
    }
  }, [userOId, getNewAlarmArrLen])

  /**
   * 채팅방 행 배열 불러오기
   */
  useEffect(() => {
    if (userOId) {
      getChatRoomRowArr(userOId)
    }
  }, [userOId, getChatRoomRowArr])

  /**
   * mainSocket 이벤트 리스너 등록 1
   * - setAlarmLen: 알람의 갯수를 설정하는 이벤트
   */
  useEffect(() => {
    if (mainSocket) {
      onMainSocket(`setAlarmLen`, (newAlarmArrLen: number) => {
        setNewAlarmArrLen(newAlarmArrLen)
      })
    }
  }, [mainSocket, onMainSocket, setNewAlarmArrLen])

  /**
   * mainSocket 이벤트 리스너 등록 2
   * - setUnreadChat: 읽지 않은 채팅의 갯수를 설정하는 이벤트
   */
  useEffect(() => {
    if (mainSocket) {
      onMainSocket(`setUnreadChatLen`, (payload: SetUnreadChatPayloadType) => {
        alert('setUnreadChatLen')
        const {chatRoomOId, isActiveChanged, unreadCount} = payload

        if (isActiveChanged) {
          /**
           * 비활성화 상태에서 메시지가 수신되어 활성화 상태로 변경되었을때
           * - 해당 채팅방 행만 따로 불러와서 배열을 갱신한다.
           */
          getChatRoomRow(chatRoomOId)
        } // ::
        else {
          setChatRoomRowArr(prev => {
            const newPrev = [...prev]
            const targetIndex = newPrev.findIndex(item => item.chatRoomOId === chatRoomOId)
            if (targetIndex !== -1) {
              newPrev[targetIndex].unreadCount = unreadCount
            }
            return newPrev
          })
        }
      })
    }
  }, [mainSocket, getChatRoomRow, onMainSocket, setChatRoomRowArr])

  return <UserEffectsContext.Provider value={{}}>{children}</UserEffectsContext.Provider>
}
