import {createContext, useCallback, useContext} from 'react'
import {useAdminStatesContext} from './__states'

import * as S from '@server'
import * as U from '@util'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  loadLogArr: (isAlert: boolean) => Promise<boolean>,
  loadUserArr: (isAlert: boolean) => Promise<boolean>,

  closeLogGKDStatus: () => void,
  openLogGKDStatus: (logOId: string) => void,
  sortUserArrFiltered: (oldSortType: string, sortType: string) => void,
}
// prettier-ignore
export const AdminCallbacksContext = createContext<ContextType>({
  loadLogArr: () => Promise.resolve(false),
  loadUserArr: () => Promise.resolve(false),

  closeLogGKDStatus: () => {},
  openLogGKDStatus: () => {},
  sortUserArrFiltered: () => {},
})

export const useAdminCallbacksContext = () => useContext(AdminCallbacksContext)

export const AdminCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setLogArr, setLogOId_showStatus, setUserArr, setUserArrFiltered, setUserArrSortType} = useAdminStatesContext()

  // AREA1: 외부에서 사용할 함수 (http 요청)

  const loadLogArr = useCallback(async (isAlert: boolean) => {
    const url = '/client/admin/loadLogArr'
    return S.getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        if (ok) {
          setLogArr(body.logArr)
          return true
        } // ::
        else {
          if (isAlert) {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
          return false
        }
      })
      .catch(errObj => {
        if (isAlert) {
          U.alertErrors(url, errObj)
        }
        return false
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserArr = useCallback(async (isAlert: boolean) => {
    const url = '/client/admin/loadUserArr'

    return S.getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        if (ok) {
          setUserArr(body.userArr)
          return true
        } // ::
        else {
          if (isAlert) {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
          return false
        }
      })
      .catch(errObj => {
        if (isAlert) {
          U.alertErrors(url, errObj)
        }
        return false
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // AREA2: 외부에서 사용할 함수 (http 아님)

  const closeLogGKDStatus = useCallback(() => {
    setLogOId_showStatus('')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openLogGKDStatus = useCallback((logOId: string) => {
    setLogOId_showStatus(logOId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sortUserArrFiltered = useCallback((oldSortType: string, sortType: string) => {
    const preOldSortType = oldSortType.split('_')[0]
    const postOldSortType = oldSortType.split('_')[1]

    if (preOldSortType === sortType) {
      setUserArrFiltered(prev => {
        const newPrev = [...prev]
        newPrev.sort((a, b) => {
          if (preOldSortType === 'userId') {
            return postOldSortType === 'ASC' ? b.userId.localeCompare(a.userId) : a.userId.localeCompare(b.userId)
          } // ::
          else if (preOldSortType === 'userName') {
            return postOldSortType === 'ASC' ? b.userName.localeCompare(a.userName) : a.userName.localeCompare(b.userName)
          } // ::
          else if (preOldSortType === 'userMail') {
            return postOldSortType === 'ASC' ? b.userMail.localeCompare(a.userMail) : a.userMail.localeCompare(b.userMail)
          } // ::
          else if (preOldSortType === 'createdAt') {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return postOldSortType === 'ASC' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
          } // ::
          else {
            return 0
          }
        })
        return newPrev
      })
      setUserArrSortType(`${sortType}_${postOldSortType === 'ASC' ? 'DESC' : 'ASC'}`)
    } // ::
    else {
      setUserArrFiltered(prev => {
        const newPrev = [...prev]
        newPrev.sort((a, b) => {
          if (sortType === 'userId') {
            return a.userId.localeCompare(b.userId)
          } // ::
          else if (sortType === 'userName') {
            return a.userName.localeCompare(b.userName)
          } // ::
          else if (sortType === 'userMail') {
            return a.userMail.localeCompare(b.userMail)
          } // ::
          else if (sortType === 'createdAt') {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return dateA.getTime() - dateB.getTime()
          } // ::
          else {
            return 0
          }
        })
        return newPrev
      })
      setUserArrSortType(`${sortType}_ASC`)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    loadLogArr,
    loadUserArr,

    closeLogGKDStatus,
    openLogGKDStatus,
    sortUserArrFiltered,
  }
  return <AdminCallbacksContext.Provider value={value}>{children}</AdminCallbacksContext.Provider>
}
