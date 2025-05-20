import {useEffect, type FC} from 'react'
import type {DivCommonProps} from '../../../common'
import {useLocation, useNavigate} from 'react-router-dom'
import {useAuthCallbacksContext} from '../../../contexts/auth/_callbacks'

type RedirectGoogleLayoutProps = DivCommonProps & {}

export const RedirectGoogleLayout: FC<RedirectGoogleLayoutProps> = ({className, ...props}) => {
  const {getUserGoogleInfo} = useAuthCallbacksContext()
  const navigate = useNavigate()

  const location = useLocation()

  // 토큰을 받았으면 토큰을 써서 유저 정보를 가져오고 그 후에 홈으로 보낸다
  useEffect(() => {
    const jwtFromServer = location.pathname.split('/google/')[1]
    if (jwtFromServer) {
      getUserGoogleInfo(jwtFromServer).then(ret => {
        if (!ret) {
          alert('결과가 이상하게 전달되었어요')
        }
      })
      navigate('/')
    } // BLANK LINE COMMENT:
    else {
      alert('구글 토큰이 전달되지 않았어요')
    }
  }, [location, getUserGoogleInfo, navigate])
  return (
    <div className={`REDIRECT_GOOGLE_LAYOUT ${className || ''}`} {...props}>
      <p>RedirectGoogleLayout...</p>
    </div>
  )
}
