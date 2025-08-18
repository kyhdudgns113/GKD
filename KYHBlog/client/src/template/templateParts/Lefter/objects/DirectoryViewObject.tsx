import '../_styles/DirectoryViewObject.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type DirectoryViewObjectProps = DivCommonProps & {}

export const DirectoryViewObject: FC<DirectoryViewObjectProps> = ({className, style, ...props}) => {
  return (
    <div className={`DirectoryView_Object ${className || ''}`} style={style} {...props}>
      <p>DirectoryViewObject</p>
    </div>
  )
}
