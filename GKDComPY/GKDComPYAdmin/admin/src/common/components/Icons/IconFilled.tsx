import {FC} from 'react'
import {SpanCommonProps} from '../../props'

export type IconFilledProps = SpanCommonProps & {
  iconName: string
}

export const IconFilled: FC<IconFilledProps> = ({iconName, className, ...props}) => {
  return (
    <span className={`material-symbols-outlined fill text-gkd-sakura-text ${className}`} {...props}>
      {iconName}
    </span>
  )
}
