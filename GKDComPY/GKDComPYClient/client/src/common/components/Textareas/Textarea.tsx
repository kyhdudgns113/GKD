import {FC} from 'react'
import {TextareaCommonProps} from '../../props'

type TextareaProps = TextareaCommonProps & {
  maxLength?: number
  value?: string
}

export const Textarea: FC<TextareaProps> = ({
  maxLength,
  value,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  return (
    <textarea
      className={`outline-none resize-none p-1 bg-white border-2 text-gkd-sakura-text border-gkd-sakura-border ${className}`}
      maxLength={maxLength}
      value={value}
      {...props}
    />
  )
}
