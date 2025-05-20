import {FC} from 'react'
import {ImageCommonProps} from '../../props'

type CrownProps = ImageCommonProps & {}
export const Crown: FC<CrownProps> = ({className, ...props}) => {
  return <i className={`fa-solid fa-crown ${className}`} {...props} />
}
