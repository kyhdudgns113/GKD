import {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RedirectErrMsgLayoutProps = DivCommonProps & {}

export const RedirectErrMsgLayout: FC<RedirectErrMsgLayoutProps> = ({className, ...props}) => {
  const navigate = useNavigate()

  const location = useLocation()

  // 토큰을 받았으면 토큰을 써서 유저 정보를 가져오고 그 후에 홈으로 보낸다
  useEffect(() => {
    const errMsg = location.pathname.split('/errMsg/')[1]
    if (errMsg) {
      alert(errMsg)
    }
  }, [location, navigate])
  return (
    <div className={`REDIRECT_ERR_MSG_LAYOUT ${className || ''}`} {...props}>
      <p>RedirectErrMsgLayout...</p>
    </div>
  )
}
