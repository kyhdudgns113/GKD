import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type TitlePartProps = DivCommonProps & {height?: string}

export const TitlePart: FC<TitlePartProps> = ({height, className, ...props}) => {
  const navigate = useNavigate()

  const stylePart: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: height || '80px',
    justifyContent: 'center',
    width: '100%'
  }
  const styleTitle: CSSProperties = {
    alignContent: 'center',
    cursor: 'pointer',
    fontSize: '32px',
    fontWeight: 700,
    height: '100%',
    textAlign: 'center',
    userSelect: 'none',
    width: 'fit-content'
  }

  const onClickTitle = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <div className={`TITLE_PART ${className || ''}`} style={stylePart} {...props}>
      <p onClick={onClickTitle} style={styleTitle}>
        강영훈의 개발 블로그
      </p>
    </div>
  )
}
