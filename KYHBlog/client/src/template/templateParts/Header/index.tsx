import {HeaderLayout} from './HeaderLayout'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderProps = DivCommonProps & {height: string}

export const Header: FC<HeaderProps> = ({height, className, style, ...props}) => {
  return <HeaderLayout height={height} className={className} style={style} {...props} />
}
