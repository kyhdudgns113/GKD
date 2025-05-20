import {FC} from 'react'
import {TextCommonProps} from '../../props'

export const TextBase: FC<TextCommonProps> = ({className: _className, ...props}) => {
  return <p className={'text-base text-gkd-sakura-text font-bold ' + _className} {...props} />
}
