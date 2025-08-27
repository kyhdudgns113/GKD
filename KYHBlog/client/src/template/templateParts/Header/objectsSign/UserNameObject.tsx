import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as C from '@context'

type UserNameObjectProps = DivCommonProps & {}

export const UserNameObject: FC<UserNameObjectProps> = ({className, style, ...props}) => {
  const {userName} = C.useAuthStatesContext()
  const styleObject: CSSProperties = {
    ...style
  }

  return (
    <div className={`UserName_Object ${className || ''}`} style={styleObject} {...props}>
      <p>{userName}</p>
    </div>
  )
}
