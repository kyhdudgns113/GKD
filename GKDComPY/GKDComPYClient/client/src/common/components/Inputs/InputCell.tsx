import {FC} from 'react'
import {InputCommonProps} from '../../props'

type InputCellProps = InputCommonProps & {
  maxLength?: number
  placeholder?: string
  type?: string
  value: string | number
}

export const InputCell: FC<InputCellProps> = ({
  maxLength,
  placeholder,
  type,
  value,
  //
  className,
  ...props
}) => {
  return (
    <>
      <style>
        {`
            /* Chrome, Safari, Edge, Opera */
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }

            /* Firefox */
            input[type="number"] {
              -moz-appearance: textfield;
            }
          `}
      </style>
      <input
        className={
          'outline-none ' +
          'border-gkd-sakura-border ' +
          'text-gkd-sakura-text ' +
          `placeholder-gkd-sakura-placeholder ${className}`
        }
        maxLength={maxLength}
        placeholder={placeholder || ''}
        style={{
          ...props.style,
          appearance: 'textfield',
          MozAppearance: 'textfield',
          WebkitAppearance: 'none'
        }}
        type={type || 'text'}
        value={value}
        {...props}
      />
    </>
  )
}
