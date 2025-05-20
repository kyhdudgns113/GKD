import {FC} from 'react'
import {TextCommonProps} from '../../props'

export const TextSM: FC<TextCommonProps> = ({className, ...props}) => {
  return <p className={`text-sm text-gkd-sakura-text font-bold ${className}`} {...props} />
}
