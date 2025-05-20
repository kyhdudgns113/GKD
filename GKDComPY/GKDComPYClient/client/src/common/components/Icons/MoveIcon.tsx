import {FC} from 'react'
import {SpanCommonProps} from '../../props'

type MoveIconProps = SpanCommonProps & {
  //
}
export const MoveIcon: FC<MoveIconProps> = ({className, ...props}) => {
  return (
    <span
      className={`select-none cursor-pointer material-symbols-outlined text-blue-600  ${className}`}
      {...props}>
      change_circle
    </span>
  )
}
