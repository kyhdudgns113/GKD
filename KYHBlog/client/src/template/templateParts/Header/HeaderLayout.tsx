import {SignAreaPart, TitleAreaPart} from './parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderLayoutProps = DivCommonProps & {height: string}

export const HeaderLayout: FC<HeaderLayoutProps> = ({height, className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    height: height || '90px',
    width: '100%'
  }

  return (
    <div className={`HeaderLayout ${className || ''}`} style={stylePage} {...props}>
      <SignAreaPart height="30px" />
      <TitleAreaPart height="60px" />
    </div>
  )
}
