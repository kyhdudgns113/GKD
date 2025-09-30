import {createContext, useCallback, useContext, useRef, useState} from 'react'

import type {FC, PropsWithChildren, RefObject} from 'react'
import type {AlarmType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  alarmArr: AlarmType[], setAlarmArr: Setter<AlarmType[]>
  isAlarmOpen: boolean, setIsAlarmOpen: Setter<boolean>
  
  alarmArrRef: RefObject<AlarmType[]>
}
// prettier-ignore
export const UserStatesContext = createContext<ContextType>({
  alarmArr: [], setAlarmArr: () => {},
  isAlarmOpen: false, setIsAlarmOpen: () => {},

  alarmArrRef: {current: []}
})

export const useUserStatesContext = () => useContext(UserStatesContext)

export const UserStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [alarmArr, setAlarmArr] = useState<AlarmType[]>([])
  const [isAlarmOpen, setIsAlarmOpen] = useState<boolean>(false)

  const alarmArrRef = useRef<AlarmType[]>([])

  const _setAlarmArr: Setter<AlarmType[]> = useCallback((newAlarmArrOrFn: AlarmType[] | ((prev: AlarmType[]) => AlarmType[])) => {
    setAlarmArr(prev => {
      const newAlarmArr = typeof newAlarmArrOrFn === 'function' ? (newAlarmArrOrFn as (prev: AlarmType[]) => AlarmType[])(prev) : newAlarmArrOrFn

      alarmArrRef.current = newAlarmArr
      return newAlarmArr
    })
  }, [])

  // prettier-ignore
  const value: ContextType = {
    alarmArr, setAlarmArr: _setAlarmArr,
    isAlarmOpen, setIsAlarmOpen,

    alarmArrRef,
  }

  return <UserStatesContext.Provider value={value}>{children}</UserStatesContext.Provider>
}
