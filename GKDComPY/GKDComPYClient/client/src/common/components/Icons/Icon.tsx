import {FC} from 'react'
import {SpanCommonProps} from '../../props'

export type IconProps = SpanCommonProps & {
  iconName: string
}

export const Icon: FC<IconProps> = ({iconName, className, ...props}) => {
  return (
    <span
      className={`material-symbols-outlined align-middle text-gkd-sakura-text  ${className}`}
      {...props}>
      {iconName}
    </span>
  )
}
