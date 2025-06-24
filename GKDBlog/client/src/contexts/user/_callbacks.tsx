import {createContext, useCallback, useContext} from 'react'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useUserStatesContext} from './__states'
import {delWithJwt, getWithJwt} from '@server/getAndDel'
import {alertErrors} from '@utils/alertErrors'
import {writeJwtFromServer} from '@utils/writeJwtFromServer'

import type {FC, PropsWithChildren} from 'react'
import type {AlarmType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  listenerSetAlarmLen: (numNewAlarm: number) => void

  deleteAlarm: (alarm: AlarmType) => void
  getNewAlarmArrLen: () => void
  refreshAlarmArr: (setAlarmArr: Setter<AlarmType[]>, setIsLoading: Setter<boolean>) => void
}
// prettier-ignore
export const UserCallbacksContext = createContext<ContextType>({
  listenerSetAlarmLen: () => {},

  deleteAlarm: () => {},
  getNewAlarmArrLen: () => {},  
  refreshAlarmArr: () => {},
})

export const useUserCallbacksContext = () => useContext(UserCallbacksContext)

export const UserCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId} = useAuthStatesContext()

  const {setNewAlarmArrLen} = useUserStatesContext()

  // AREA1: mainSocket 이벤트 리스너 영역
  /**
   * mainSocket 의 setAlarmLen 이벤트 리스너
   * - 알람의 갯수를 설정한다
   */
  const listenerSetAlarmLen = useCallback(
    (newAlarmArrLen: number) => {
      setNewAlarmArrLen(newAlarmArrLen)
    },
    [setNewAlarmArrLen]
  )

  // AREA2: HTTP 함수 영역
  const deleteAlarm = useCallback((alarm: AlarmType) => {
    const url = `/client/userInfo/deleteAlarm/${alarm.alarmOId}`
    delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, errObj, jwtFromServer} = res
        if (ok) {
          writeJwtFromServer(jwtFromServer)
        } // ::
        else {
          alertErrors(url + ` ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(url + ` CATCH`, errObj))
  }, [])

  const refreshAlarmArr = useCallback(
    (setAlarmArr: Setter<AlarmType[]>, setIsLoading: Setter<boolean>) => {
      /**
       * 읽지 않은 알람들을 가져오며 수신처리를 한다
       * - Header 의 알람 목록창에서 사용
       * - 수신 확인 안한 알람 갯수는 서버에서 소켓통신으로 전달한다
       */
      if (userOId) {
        const url = `/client/userInfo/refreshAlarmArr/${userOId}`

        getWithJwt(url)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              setAlarmArr(body.alarmArr)
              setIsLoading(false)
              writeJwtFromServer(jwtFromServer)
            } // ::
            else {
              alertErrors(url + ` ELSE`, errObj)
            }
          })
          .catch(errObj => alertErrors(url + ` CATCH`, errObj))
      }
    },
    [userOId]
  )

  const getNewAlarmArrLen = useCallback(() => {
    /**
     * 수신 확인 안 한 알람 갯수 가져오는 함수
     * - Header 에서 쓰임
     */
    if (userOId) {
      const url = `/client/userInfo/getNewAlarmArrLen/${userOId}`

      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setNewAlarmArrLen(body.newAlarmArrLen)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ` ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(url + ` CATCH`, errObj))
    }
  }, [userOId, setNewAlarmArrLen])

  // prettier-ignore
  const value: ContextType = {
    listenerSetAlarmLen,

    deleteAlarm,
    getNewAlarmArrLen,
    refreshAlarmArr,
  }
  return <UserCallbacksContext.Provider value={value}>{children}</UserCallbacksContext.Provider>
}
