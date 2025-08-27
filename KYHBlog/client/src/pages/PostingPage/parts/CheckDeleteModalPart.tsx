import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type CheckDeleteModalPartProps = DivCommonProps

export const CheckDeleteModalPart: FC<CheckDeleteModalPartProps> = ({className, style, ...props}) => {
  return <div className={`CheckDeleteModal_Part ${className || ''}`} style={style} {...props}></div>
}
