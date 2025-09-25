import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {UserType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  isLoadingUserArr: boolean | null, setIsLoadingUserArr: Setter<boolean | null>,
  userArr: UserType[], setUserArr: Setter<UserType[]>,
  userArrFiltered: UserType[], setUserArrFiltered: Setter<UserType[]>,
  userArrSortType: string, setUserArrSortType: Setter<string>,
}
// prettier-ignore
export const AdminStatesContext = createContext<ContextType>({
  isLoadingUserArr: true, setIsLoadingUserArr: () => {},
  userArr: [], setUserArr: () => {},
  userArrFiltered: [], setUserArrFiltered: () => {},
  userArrSortType: '', setUserArrSortType: () => {},
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
  /**
   * userArr
   *   - 전체 유저 목록
   *
   * userArrFiltered
   *   - 실제 테이블에 표시되는 유저 목록
   *   - 다양한 검색조건에 의해 필터링 될 수 있다.
   *
   * userArrSortType
   *   - 현재 적용된 유저 목록 정렬 타입
   *
   *   - 종류
   *     1. userId_ASC, userId_DESC
   *     2. userName_ASC, userName_DESC
   *     3. userMail_ASC, userMail_DESC
   *     4. createdAt_ASC, createdAt_DESC
   *
   *   - 기본값: userId_ASC
   *
   */
  const [userArr, setUserArr] = useState<UserType[]>([])
  const [userArrFiltered, setUserArrFiltered] = useState<UserType[]>([])
  const [userArrSortType, setUserArrSortType] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    isLoadingUserArr, setIsLoadingUserArr,  
    userArr, setUserArr,
    userArrFiltered, setUserArrFiltered,
    userArrSortType, setUserArrSortType,
  }

  return <AdminStatesContext.Provider value={value}>{children}</AdminStatesContext.Provider>
}
