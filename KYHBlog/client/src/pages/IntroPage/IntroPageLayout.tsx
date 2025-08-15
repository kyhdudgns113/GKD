import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type IntroPageLayoutProps = DivCommonProps & {}

export const IntroPageLayout: FC<IntroPageLayoutProps> = ({className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%'
  }

  return (
    <div className={`IntroPageLayout ${className || ''}`} style={stylePage} {...props}>
      <p>IntroPage</p>
    </div>
  )
}
