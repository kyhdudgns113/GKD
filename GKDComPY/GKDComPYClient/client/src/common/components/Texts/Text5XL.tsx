import {FC} from 'react'
import {TextCommonProps} from '../../props'

export const Text5XL: FC<TextCommonProps> = ({className, ...props}) => {
  return <p className={`text-5xl text-gkd-sakura-text font-bold ${className}`} {...props} />
}
