import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  lockLogIn: boolean, setLockLogIn: Setter<boolean>,
  lockSignUp: boolean, setLockSignUp: Setter<boolean>,
}
// prettier-ignore
export const LockStatesContext = createContext<ContextType>({
  lockLogIn: false, setLockLogIn: () => {},
  lockSignUp: false, setLockSignUp: () => {},
})

export const useLockStatesContext = () => useContext(LockStatesContext)

export const LockStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * lockLogIn: 로그인 모달 확인 버튼 잠금 여부
   * lockSignUp: 회원가입 모달 확인 버튼 잠금 여부
   */
  const [lockLogIn, setLockLogIn] = useState<boolean>(false)
  const [lockSignUp, setLockSignUp] = useState<boolean>(false)

  // prettier-ignore
  const value: ContextType = {
    lockLogIn, setLockLogIn,
    lockSignUp, setLockSignUp,
  }

  return <LockStatesContext.Provider value={value}>{children}</LockStatesContext.Provider>
}
