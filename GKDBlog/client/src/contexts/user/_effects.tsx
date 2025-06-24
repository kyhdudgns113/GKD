import {createContext, useContext, useEffect} from 'react'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useSocketStatesContext} from '@contexts/socket/__states'
import {useSocketCallbacksContext} from '@contexts/socket/_callbacks'

import {useUserCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
export const UserEffectsContext = createContext<ContextType>({})

export const useUserEffectsContext = () => useContext(UserEffectsContext)

export const UserEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId} = useAuthStatesContext()
  const {mainSocket} = useSocketStatesContext()
  const {onMainSocket} = useSocketCallbacksContext()
  const {listenerSetAlarmLen, getNewAlarmArrLen} = useUserCallbacksContext()

  /**
   * 안 읽은 알람갯수 불러오기
   */
  useEffect(() => {
    if (userOId) {
      getNewAlarmArrLen()
    }
  }, [userOId, getNewAlarmArrLen])

  /**
   * mainSocket 이벤트 리스너 등록
   * - setAlarmLen: 알람의 갯수를 설정하는 이벤트
   */
  useEffect(() => {
    if (mainSocket) {
      onMainSocket(`setAlarmLen`, listenerSetAlarmLen)
    }
  }, [mainSocket, onMainSocket, listenerSetAlarmLen])

  return <UserEffectsContext.Provider value={{}}>{children}</UserEffectsContext.Provider>
}
