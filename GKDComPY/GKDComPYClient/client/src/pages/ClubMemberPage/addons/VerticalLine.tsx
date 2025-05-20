import {FC} from 'react'
import {DivCommonProps} from '../../../common'

type VerticalLineProps = DivCommonProps & {
  heightPx: number
}
export const VerticalLine: FC<VerticalLineProps> = ({heightPx, className, ...props}) => {
  return (
    <div
      className={`border-2 border-gkd-sakura-border ${className}`}
      style={{height: `${heightPx}px`}}
      {...props}
    />
  )
}
