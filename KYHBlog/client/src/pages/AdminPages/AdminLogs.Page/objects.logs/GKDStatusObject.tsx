import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type GKDStatusObjectProps = DivCommonProps & {}

export const GKDStatusObject: FC<GKDStatusObjectProps> = ({className, style, ...props}) => {
  return (
    <div className={`GKDStatus_Object ${className || ''}`} style={style} {...props}>
      <div className="_object_title">상태</div>
    </div>
  )
}
