import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type RedirectMainPageProps = DivCommonProps & {}

export const RedirectMainPage: FC<RedirectMainPageProps> = ({className, style, ...props}) => {
  const navigate = useNavigate()

  const stylePage: CSSProperties = {
    ...style,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',

    height: '100vh',
    justifyContent: 'center',
    width: '100%'
  }
  const styleText: CSSProperties = {
    fontSize: '32px',
    fontWeight: '700'
  }

  // 1000ms 후에 /main 페이지로 이동
  useEffect(() => {
    setTimeout(() => {
      navigate('/main')
    }, 1000)
  }, [navigate])

  return (
    <div className={`RedirectMainPage ${className || ''}`} style={stylePage} {...props}>
      <p style={styleText}>잠시만 기다려주세요~~</p>
    </div>
  )
}
