import {FC} from 'react'
import {SpanCommonProps} from '../../props'

export type IconLegacyProps = SpanCommonProps & {
  iconName: string
}

export const IconLegacy: FC<IconLegacyProps> = ({iconName, className: _className, ...props}) => {
  return (
    <span className={'material-icons text-gkd-sakura-text ' + _className} {...props}>
      {iconName}
    </span>
  )
}
