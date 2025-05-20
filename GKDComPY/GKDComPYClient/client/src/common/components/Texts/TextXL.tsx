import {FC} from 'react'
import {TextCommonProps} from '../../props'

export const TextXL: FC<TextCommonProps> = ({className: _className, ...props}) => {
  return <p className={'text-xl text-gkd-sakura-text font-bold ' + _className} {...props} />
}
