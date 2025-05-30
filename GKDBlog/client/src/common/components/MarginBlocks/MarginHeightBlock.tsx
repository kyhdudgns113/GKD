import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../typesAndValues/props'

type MarginHeightBlockProps = DivCommonProps & {
  height: string
}

export const MarginHeightBlock: FC<MarginHeightBlockProps> = ({
  height,
  className,
  style,
  ...props
}) => {
  const styleBlock: CSSProperties = {
    ...style,
    height,
    width: '100%'
  }

  return <div className={`MARGIN_HEIGHT_BLOCK ${className || ''}`} style={styleBlock} {...props} />
}
