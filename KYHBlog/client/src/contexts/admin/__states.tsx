import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {LogType, UserType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  isLoadingLogArr: boolean | null, setIsLoadingLogArr: Setter<boolean | null>,
  isLoadingUserArr: boolean | null, setIsLoadingUserArr: Setter<boolean | null>,
  logArr: LogType[], setLogArr: Setter<LogType[]>,
  logOId_showStatus: string, setLogOId_showStatus: Setter<string>,
  userArr: UserType[], setUserArr: Setter<UserType[]>,
  userArrFiltered: UserType[], setUserArrFiltered: Setter<UserType[]>,
  userArrSortType: string, setUserArrSortType: Setter<string>,
}
// prettier-ignore
export const AdminStatesContext = createContext<ContextType>({
  isLoadingLogArr: true, setIsLoadingLogArr: () => {},
  isLoadingUserArr: true, setIsLoadingUserArr: () => {},
  logArr: [], setLogArr: () => {},
  logOId_showStatus: '', setLogOId_showStatus: () => {},
  userArr: [], setUserArr: () => {},
  userArrFiltered: [], setUserArrFiltered: () => {},
  userArrSortType: '', setUserArrSortType: () => {},
})

export const useAdminStatesContext = () => useContext(AdminStatesContext)

export const AdminStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * isLoadingLogArr
   * isLoadingUserArr
   *   - true: 로딩중
   *   - false: 로딩완료
   *   - null: 로딩실패
   */
  const [isLoadingLogArr, setIsLoadingLogArr] = useState<boolean | null>(true)
  const [isLoadingUserArr, setIsLoadingUserArr] = useState<boolean | null>(true)
  /**
   * logArr
   *   - 전체 로그 목록
   */
  const [logArr, setLogArr] = useState<LogType[]>([])
  /**
   * logOId_showStatus
   *   - gkdStatus 를 표시할 로그의 OId
   */
  const [logOId_showStatus, setLogOId_showStatus] = useState<string>('')
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
    isLoadingLogArr, setIsLoadingLogArr,
    isLoadingUserArr, setIsLoadingUserArr,  
    logArr, setLogArr,
    logOId_showStatus, setLogOId_showStatus,
    userArr, setUserArr,
    userArrFiltered, setUserArrFiltered,
    userArrSortType, setUserArrSortType,
  }

  return <AdminStatesContext.Provider value={value}>{children}</AdminStatesContext.Provider>
}
