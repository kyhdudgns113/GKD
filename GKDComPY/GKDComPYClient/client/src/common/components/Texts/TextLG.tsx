import {FC} from 'react'
import {TextCommonProps} from '../../props'

export const TextLG: FC<TextCommonProps> = ({className, ...props}) => {
  return <p className={`text-lg text-gkd-sakura-text font-bold ${className}`} {...props} />
}
