import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import '../_styles/TitleAreaPart.scss'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type TitleAreaPartProps = DivCommonProps & {}

export const TitleAreaPart: FC<TitleAreaPartProps> = ({className, style, ...props}) => {
  const navigate = useNavigate()

  const stylePart: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '60px',

    userSelect: 'none',
    width: '100%'
  }
  const styleTitle: CSSProperties = {
    cursor: 'pointer'
  }

  const onClickTitle = useCallback(() => {
    navigate('/main')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`TitleArea_Part ${className || ''}`} style={stylePart} {...props}>
      <p className="_Title" onClick={onClickTitle} style={styleTitle}>
        강영훈의 블로그
      </p>
    </div>
  )
}
