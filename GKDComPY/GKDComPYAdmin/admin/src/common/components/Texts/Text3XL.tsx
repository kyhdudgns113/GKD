import {FC} from 'react'
import {TextCommonProps} from '../../props'

export const Text3XL: FC<TextCommonProps> = ({className, ...props}) => {
  return <p className={`text-3xl text-gkd-sakura-text font-bold ${className}`} {...props} />
}
