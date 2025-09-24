import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {UserType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  isLoadingUserArr: boolean | null, setIsLoadingUserArr: Setter<boolean | null>,
  userArr: UserType[], setUserArr: Setter<UserType[]>,

}
// prettier-ignore
export const AdminStatesContext = createContext<ContextType>({
  isLoadingUserArr: true, setIsLoadingUserArr: () => {},
  userArr: [], setUserArr: () => {},

})

export const useAdminStatesContext = () => useContext(AdminStatesContext)

export const AdminStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * isLoadingUserArr
   *   - true: 로딩중
   *   - false: 로딩완료
   *   - null: 로딩실패
   */
  const [isLoadingUserArr, setIsLoadingUserArr] = useState<boolean | null>(true)
  const [userArr, setUserArr] = useState<UserType[]>([])

  // prettier-ignore
  const value: ContextType = {
    isLoadingUserArr, setIsLoadingUserArr,  
    userArr, setUserArr,

  }

  return <AdminStatesContext.Provider value={value}>{children}</AdminStatesContext.Provider>
}
