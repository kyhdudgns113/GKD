import {createContext, useCallback, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

import * as C from '@context'

// prettier-ignore
type ContextType = {
  lockLogIn: () => void,
  lockSignUp: () => void,

  releaseLogIn: () => void,
  releaseSignUp: () => void,
}
// prettier-ignore
export const LockCallbacksContext = createContext<ContextType>({
  lockLogIn: () => {},
  lockSignUp: () => {},

  releaseLogIn: () => {},
  releaseSignUp: () => {},
})

export const useLockCallbacksContext = () => useContext(LockCallbacksContext)

export const LockCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {isLogInLocked, isSignUpLocked} = C.useLockStatesContext()

  /**
   * 로그인 모달을 잠그는 함수
   * - 현재 요청에서 3초가 지나면 잠금이 해제된다
   * - mutex lock 을 의도한건 아니다
   *   - 잠겼는지 확인하는건 외부에서 한다.
   */
  const lockLogIn = useCallback(() => {
    isLogInLocked.current.isLock = true
    isLogInLocked.current.cnt += 1

    const currentCnt = isLogInLocked.current.cnt

    setTimeout(() => {
      if (currentCnt === isLogInLocked.current.cnt) {
        isLogInLocked.current.isLock = false
      }
    }, 3000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 회원가입 모달을 잠그는 함수
   * - 현재 요청에서 3초가 지나면 잠금이 해제된다
   * - mutex lock 을 의도한건 아니다
   *   - 잠겼는지 확인하는건 외부에서 한다.
   */
  const lockSignUp = useCallback(() => {
    isSignUpLocked.current.isLock = true
    isSignUpLocked.current.cnt += 1

    const currentCnt = isSignUpLocked.current.cnt

    setTimeout(() => {
      if (currentCnt === isSignUpLocked.current.cnt) {
        isSignUpLocked.current.isLock = false
      }
    }, 3000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 로그인 모달을 잠금 해제하는 함수
   */
  const releaseLogIn = useCallback(() => {
    isLogInLocked.current.isLock = false
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 회원가입 모달을 잠금 해제하는 함수
   */
  const releaseSignUp = useCallback(() => {
    isSignUpLocked.current.isLock = false
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    lockLogIn,
    lockSignUp,

    releaseLogIn,
    releaseSignUp,
  }
  return <LockCallbacksContext.Provider value={value}>{children}</LockCallbacksContext.Provider>
}
