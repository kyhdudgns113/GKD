import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type NullPageProps = DivCommonProps & {}

export const NullPage: FC<NullPageProps> = ({className, style, ...props}) => {
  const styleNullPage: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  }

  return (
    <div className={`NullPage ${className || ''}`} style={styleNullPage} {...props}>
      <p>존재하지 않는 페이지입니다.</p>
    </div>
  )
}
