import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
type MainPageProps = DivCommonProps & {}

export const MainPage: FC<MainPageProps> = ({className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%'
  }

  return (
    <div className={`MainPage ${className || ''}`} style={stylePage} {...props}>
      <p>MainPage</p>
    </div>
  )
}
