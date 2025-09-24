import {createContext, useContext, useEffect} from 'react'
import {useAdminStatesContext} from './__states'
import {useAdminCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const AdminEffectsContext = createContext<ContextType>({})

export const useAdminEffectsContext = () => useContext(AdminEffectsContext)

export const AdminEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {setIsLoadingUserArr} = useAdminStatesContext()
  const {loadUserArr} = useAdminCallbacksContext()

  /**
   * 페이지 로딩시
   *
   * 1. userArr 불러오기
   */
  useEffect(() => {
    // 1. userArr 불러오기
    loadUserArr(false) // ::
      .then(ok => {
        if (ok) {
          setIsLoadingUserArr(false)
        } // ::
        else {
          setIsLoadingUserArr(null)
        }
      })

    return () => {
      setIsLoadingUserArr(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <AdminEffectsContext.Provider value={{}}>{children}</AdminEffectsContext.Provider>
}
