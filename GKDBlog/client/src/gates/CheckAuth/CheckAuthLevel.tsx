import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuthCallbacksContext} from '@contexts/auth/_callbacks'

import type {FC, PropsWithChildren} from 'react'

type CheckAuthLevelProps = {
  requiredLevel: number
}

export const CheckAuthLevel: FC<PropsWithChildren<CheckAuthLevelProps>> = ({
  children,
  requiredLevel
}) => {
  const {refreshToken} = useAuthCallbacksContext()

  const navigate = useNavigate()

  const errCallback = useCallback(() => {
    if (requiredLevel === 1) {
      alert('로그인이 필요합니다.')
    } // BLANK LINE COMMENT:
    else {
      alert(`페이지 접근 권한이 부족합니다.`)
    }
    navigate('/')
  }, [requiredLevel, navigate])

  refreshToken(requiredLevel, errCallback)

  return children
}
