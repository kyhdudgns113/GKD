import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type FooterProps = DivCommonProps & {height?: string}

export const Footer: FC<FooterProps> = ({height, className, ...props}) => {
  const styleFooter: CSSProperties = {
    height: height || '100px'
  }
  return (
    <div className={`FOOTER ${className || ''}`} style={styleFooter} {...props}>
      &nbsp;
    </div>
  )
}
