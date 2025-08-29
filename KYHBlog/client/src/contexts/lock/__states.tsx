import {createContext, useContext, useRef} from 'react'

import type {FC, PropsWithChildren, RefObject} from 'react'
import type {LockType} from '@type'

// prettier-ignore
type ContextType = {
  isLogInLocked: RefObject<LockType>,
  isSignUpLocked: RefObject<LockType>,
}
// prettier-ignore
export const LockStatesContext = createContext<ContextType>({
  isLogInLocked: {current: {isLock: false, cnt: 0}},
  isSignUpLocked: {current: {isLock: false, cnt: 0}},
})

export const useLockStatesContext = () => useContext(LockStatesContext)

export const LockStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * isLogInLocked: 로그인 모달 확인 버튼 잠금 여부
   * isSignUpLocked: 회원가입 모달 확인 버튼 잠금 여부
   */
  const isLogInLocked = useRef<LockType>({isLock: false, cnt: 0})
  const isSignUpLocked = useRef<LockType>({isLock: false, cnt: 0})

  // prettier-ignore
  const value: ContextType = {
    isLogInLocked,
    isSignUpLocked,
  }

  return <LockStatesContext.Provider value={value}>{children}</LockStatesContext.Provider>
}
