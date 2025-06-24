import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  newAlarmArrLen: number, setNewAlarmArrLen: Setter<number>
}
// prettier-ignore
export const UserStatesContext = createContext<ContextType>({
  newAlarmArrLen: 0, setNewAlarmArrLen: () => {}
})

export const useUserStatesContext = () => useContext(UserStatesContext)

export const UserStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * newAlarmArrLen: 새로운 알람의 개수. 소켓으로 갯수를 갱신한다.
   */
  const [newAlarmArrLen, setNewAlarmArrLen] = useState<number>(0)

  // prettier-ignore
  const value: ContextType = {
    newAlarmArrLen, setNewAlarmArrLen
  }

  return <UserStatesContext.Provider value={value}>{children}</UserStatesContext.Provider>
}
