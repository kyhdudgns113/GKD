import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type TitleAreaPartProps = DivCommonProps & {height: string}

export const TitleAreaPart: FC<TitleAreaPartProps> = ({height, className, style, ...props}) => {
  const stylePart: CSSProperties = {
    ...style,

    height: height || '60px'
  }

  return (
    <div className={`Title_Area_Part ${className || ''}`} style={stylePart} {...props}>
      <p>TitleAreaPart</p>
    </div>
  )
}
