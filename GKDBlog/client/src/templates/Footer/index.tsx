import {FooterLayout} from './FooterLayout'

import type {DivCommonProps} from '@prop'
import type {FC} from 'react'

type FooterProps = DivCommonProps & {height?: string}

export const Footer: FC<FooterProps> = ({height, className, style, ...props}) => {
  return <FooterLayout className={className} height={height} style={style} {...props} />
}
