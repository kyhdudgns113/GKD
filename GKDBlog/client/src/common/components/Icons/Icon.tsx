import type {CSSProperties, FC} from 'react'
import type {SpanCommonProps} from '../../typesAndValues'

export type IconProps = SpanCommonProps & {
  iconName: string
  style?: CSSProperties
}

export const Icon: FC<IconProps> = ({iconName, className, style, ...props}) => {
  return (
    <span
      className={`material-symbols-outlined align-middle  ${className}`}
      style={style}
      {...props}>
      {iconName}
    </span>
  )
}
