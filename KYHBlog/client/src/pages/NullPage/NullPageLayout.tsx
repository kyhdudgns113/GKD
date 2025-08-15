import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type NullPageLayoutProps = DivCommonProps & {}

export const NullPageLayout: FC<NullPageLayoutProps> = ({className, style, ...props}) => {
  const styleNullPageLayout: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  }

  return (
    <div className={`NullPageLayout ${className || ''}`} style={styleNullPageLayout} {...props}>
      <p>존재하지 않는 페이지입니다.</p>
    </div>
  )
}
