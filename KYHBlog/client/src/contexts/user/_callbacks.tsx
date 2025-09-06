import {createContext, useCallback, useContext} from 'react'
import {useUserStatesContext} from './__states'
import {getWithJwt, putWithJwt} from '@commons/server'

import * as HTTP from '@httpType'
import * as U from '@util'

import type {FC, PropsWithChildren} from 'react'
import {ALARM_STATUS_NEW} from '@commons/typesAndValues'

// prettier-ignore
type ContextType = {
  checkNewAlarm: () => void
  loadAlarmArr: (userOId: string) => void

  closeAlarm: () => void
  toggleAlarm: () => void
}
// prettier-ignore
export const UserCallbacksContext = createContext<ContextType>({
  checkNewAlarm: () => {},
  loadAlarmArr: () => {},

  closeAlarm: () => {},
  toggleAlarm: () => {}
})

export const useUserCallbacksContext = () => useContext(UserCallbacksContext)

export const UserCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {alarmArrRef, setAlarmArr, setIsAlarmOpen} = useUserStatesContext()

  // AREA1: 외부에서 사용할 함수 (http 요청)
  const checkNewAlarm = useCallback(() => {
    const alarmArr = alarmArrRef.current
    const checkedAlarmArr = alarmArr.filter(alarm => alarm.alarmStatus === ALARM_STATUS_NEW)

    if (checkedAlarmArr.length === 0) return

    const url = `/client/user/checkNewAlarm`
    const data: HTTP.CheckNewAlarmType = {checkedAlarmArr}

    putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          if (body.alarmArr) {
            setAlarmArr(body.alarmArr)
          }
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

  const loadAlarmArr = useCallback((userOId: string) => {
    const url = `/client/user/loadAlarmArr/${userOId}`

    getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setAlarmArr(body.alarmArr)
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

  // AREA2: 외부에서 사용할 함수 (http 아님)

  const closeAlarm = useCallback(() => {
    setIsAlarmOpen(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAlarm = useCallback(() => {
    setIsAlarmOpen(prev => !prev)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    checkNewAlarm,
    loadAlarmArr,
    
    closeAlarm,
    toggleAlarm
  }
  return <UserCallbacksContext.Provider value={value}>{children}</UserCallbacksContext.Provider>
}
