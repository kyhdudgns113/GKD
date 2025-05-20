import {ChangeEvent, CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../common'
import {InputCell, Text2XL} from '../../../common/components'

type InputRowBlockProps = DivCommonProps & {
  maxLength?: number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  title: string
  type: string
  value: string | number | null
}
export const InputRowBlock: FC<InputRowBlockProps> = ({
  maxLength,
  onChange,
  title,
  type,
  value,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const styleDiv: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderTopWidth: '4px',
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    overflow: 'hidden',
    width: 'fit'
  }
  const styleInput: CSSProperties = {
    backgroundColor: '#FFFFFF',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingTop: '4px',
    width: '12rem'
  }
  const styleText: CSSProperties = {
    alignContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: SAKURA_BORDER,
    borderRightWidth: '4px',
    textAlign: 'center',
    width: '5rem'
  }

  return (
    <div className={`${className}`} style={styleDiv} {...props}>
      <Text2XL style={styleText}>{title}</Text2XL>
      <InputCell
        maxLength={maxLength}
        onChange={onChange}
        type={type}
        style={styleInput}
        value={value || 0}
      />
    </div>
  )
}
