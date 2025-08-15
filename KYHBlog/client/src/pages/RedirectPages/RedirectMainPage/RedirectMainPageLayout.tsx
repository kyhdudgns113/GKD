import {useNavigate} from 'react-router-dom'

import {useEffect, type CSSProperties, type FC} from 'react'
import type {DivCommonProps} from '@commons/typesAndValues'

type RedirectMainPageLayoutProps = DivCommonProps & {}

export const RedirectMainPageLayout: FC<RedirectMainPageLayoutProps> = ({className, style, ...props}) => {
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

  useEffect(() => {
    setTimeout(() => {
      navigate('/main')
    }, 1000)
  }, [navigate])

  return (
    <div className={`RedirectMainPageLayout ${className || ''}`} style={stylePage} {...props}>
      <p style={styleText}>잠시만 기다려주세요~~</p>
    </div>
  )
}
