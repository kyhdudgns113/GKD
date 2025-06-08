import {SignAreaPart, TitlePart} from './parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderProps = DivCommonProps & {height?: string}
export const Header: FC<HeaderProps> = ({height, className, ...props}) => {
  const styleHeader: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: height || 'fit-content',
    width: '100%'
  }

  return (
    <div className={`HEADER ${className || ''}`} style={styleHeader} {...props}>
      <SignAreaPart height="30px" />
      <TitlePart height="60px" />
    </div>
  )
}
