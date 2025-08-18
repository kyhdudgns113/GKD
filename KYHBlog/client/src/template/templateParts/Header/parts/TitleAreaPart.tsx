import '../_styles/TitleAreaPart.scss'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type TitleAreaPartProps = DivCommonProps & {height: string}

export const TitleAreaPart: FC<TitleAreaPartProps> = ({height, className, style, ...props}) => {
  const stylePart: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: height || '60px',

    userSelect: 'none',
    width: '100%'
  }

  return (
    <div className={`TitleArea_Part ${className || ''}`} style={stylePart} {...props}>
      <p className="_Title">강영훈의 블로그</p>
    </div>
  )
}
