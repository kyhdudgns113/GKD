import {FC} from 'react'
import {TextCommonProps} from '../../props'

export const Text2XL: FC<TextCommonProps> = ({className, ...props}) => {
  return <p className={`text-2xl text-gkd-sakura-text font-bold ${className}`} {...props} />
}
