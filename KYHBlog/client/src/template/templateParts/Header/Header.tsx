import {SignAreaPart, TitleAreaPart} from './parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderProps = DivCommonProps & {}

export const Header: FC<HeaderProps> = ({className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: '100%'
  }

  return (
    <div className={`Header ${className || ''}`} style={stylePage} {...props}>
      <SignAreaPart />
      <TitleAreaPart />
    </div>
  )
}
