import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'
import type {ChatRoomRowType} from '@shareType'

// prettier-ignore
type ContextType = {
  chatRoomRowArr: ChatRoomRowType[], setChatRoomRowArr: Setter<ChatRoomRowType[]>
  newAlarmArrLen: number, setNewAlarmArrLen: Setter<number>
}
// prettier-ignore
export const UserStatesContext = createContext<ContextType>({
  chatRoomRowArr: [], setChatRoomRowArr: () => {},
  newAlarmArrLen: 0, setNewAlarmArrLen: () => {}
})

export const useUserStatesContext = () => useContext(UserStatesContext)

/* eslint-disable */
export const UserStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * chatRoomRowArr: 채팅방 "행" 목록. http 로 불러오고, 갱신은 소켓으로도 한다.
   */
  const [chatRoomRowArr, setChatRoomRowArr] = useState<ChatRoomRowType[]>([])
  /**
   * newAlarmArrLen: 새로운 알람의 개수. 소켓으로 갯수를 갱신한다.
   */
  const [newAlarmArrLen, setNewAlarmArrLen] = useState<number>(0)

  // prettier-ignore
  const value: ContextType = {
    chatRoomRowArr, setChatRoomRowArr,
    newAlarmArrLen, setNewAlarmArrLen
  }

  return <UserStatesContext.Provider value={value}>{children}</UserStatesContext.Provider>
}
/* eslint-enable */
