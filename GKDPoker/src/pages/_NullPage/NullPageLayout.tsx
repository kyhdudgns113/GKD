import {FC} from 'react'
import {DivCommonProps} from '../../common'

type NullPageLayoutProps = DivCommonProps & {}
export const NullPageLayout: FC<NullPageLayoutProps> = ({className, ...props}) => {
  return (
    <div className={`NULL_PAGE_LAYOUT ${className || ''}`} {...props}>
      <p>Null Page</p>
    </div>
  )
}
