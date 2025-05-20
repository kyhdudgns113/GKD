import {FC} from 'react'
import {SpanCommonProps} from '../../props'

type IconBlueProps = SpanCommonProps & {
  iconName: string
}

export const IconBlue: FC<IconBlueProps> = ({iconName, className, ...props}) => {
  return (
    <span
      className={`material-symbols-outlined text-blue-500 align-middle  ${className}`}
      {...props}>
      {iconName}
    </span>
  )
}
