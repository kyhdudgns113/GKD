import {SignAreaPart, TitleAreaPart} from './parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderProps = DivCommonProps & {height: string}

export const Header: FC<HeaderProps> = ({height, className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    height: height || '90px',
    width: '100%'
  }

  return (
    <div className={`Header ${className || ''}`} style={stylePage} {...props}>
      <SignAreaPart height="30px" />
      <TitleAreaPart height="60px" />
    </div>
  )
}
