import type {FC} from 'react'
import type {ButtonCommonProps} from '@prop'

type EditFileButtonProps = ButtonCommonProps & {}

export const EditFileButton: FC<EditFileButtonProps> = ({className, style, ...props}) => {
  return (
    <button className={`EditFileButton ${className || ''}`} style={style} {...props}>
      수정
    </button>
  )
}
