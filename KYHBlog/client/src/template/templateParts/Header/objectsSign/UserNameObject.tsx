import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type UserNameObjectProps = DivCommonProps & {}

export const UserNameObject: FC<UserNameObjectProps> = ({className, style, ...props}) => {
  const styleObject: CSSProperties = {
    ...style
  }

  return (
    <div className={`User_Name_Object ${className || ''}`} style={styleObject} {...props}>
      <p>UserNameObject</p>
    </div>
  )
}
