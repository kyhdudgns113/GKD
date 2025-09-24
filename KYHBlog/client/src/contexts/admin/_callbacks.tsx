import {createContext, useCallback, useContext} from 'react'
import {useAdminStatesContext} from './__states'

import * as S from '@server'
import * as U from '@util'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  loadUserArr: (isAlert: boolean) => Promise<boolean>
}
// prettier-ignore
export const AdminCallbacksContext = createContext<ContextType>({
  loadUserArr: () => Promise.resolve(false),
})

export const useAdminCallbacksContext = () => useContext(AdminCallbacksContext)

export const AdminCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setUserArr} = useAdminStatesContext()

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

  // prettier-ignore
  const value: ContextType = {
    loadUserArr,
  }
  return <AdminCallbacksContext.Provider value={value}>{children}</AdminCallbacksContext.Provider>
}
