import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'

type EmptyProps = DivCommonProps & {
  height: number
  width: number
}
export const Empty: FC<EmptyProps> = ({className, height, width, ...props}) => {
  const styleEmpty: CSSProperties = {
    backgroundColor: '#FFFFFF',
    height,
    width
  }
  return <div className={`EMPTY ${className || ''}`} style={styleEmpty} {...props} />
}
