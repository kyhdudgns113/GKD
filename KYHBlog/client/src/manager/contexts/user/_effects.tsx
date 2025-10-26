import {createContext, useContext, useEffect} from 'react'
import {useAuthStatesContext} from '../auth'
import {useUserCallbacksContext} from './_callbacks'
import {useSocketStatesContext} from '../socket'
import {useSocketCallbacksContext} from '../socket'
import {useUserStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'
import type {NewAlarmType, UserAlarmRemovedType} from '@socketType'
import type {AlarmType} from '@commons/typesAndValues'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const UserEffectsContext = createContext<ContextType>({})

export const useUserEffectsContext = () => useContext(UserEffectsContext)

export const UserEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {socket} = useSocketStatesContext()
  const {onSocket} = useSocketCallbacksContext()
  const {userOId} = useAuthStatesContext()
  const {setAlarmArr} = useUserStatesContext()
  const {loadAlarmArr} = useUserCallbacksContext()

  // 초기화: alarmArr 불러오기
  useEffect(() => {
    if (userOId) {
      loadAlarmArr(userOId)
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 소켓 수신: 새 알람 올 때
  useEffect(() => {
    if (socket) {
      onSocket(socket, 'new alarm', (payload: NewAlarmType) => {
        const {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, senderUserName, senderUserOId, userOId} = payload
        const newAlarm: AlarmType = {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, senderUserName, senderUserOId, userOId}
        setAlarmArr(prev => [newAlarm, ...prev])
      })

      onSocket(socket, 'remove alarm', (payload: UserAlarmRemovedType) => {
        const {alarmOId} = payload
        setAlarmArr(prev => prev.filter(alarm => alarm.alarmOId !== alarmOId))
      })
    }
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps

  return <UserEffectsContext.Provider value={{}}>{children}</UserEffectsContext.Provider>
}
