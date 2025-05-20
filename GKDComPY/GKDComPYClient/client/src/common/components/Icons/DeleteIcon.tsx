import {FC} from 'react'
import {SpanCommonProps} from '../../props'

type DeleteIconProps = SpanCommonProps & {
  //
}
export const DeleteIcon: FC<DeleteIconProps> = ({className, ...props}) => {
  return (
    <span
      className={`select-none cursor-pointer material-symbols-outlined text-red-600  ${className}`}
      {...props}>
      cancel
    </span>
  )
}
