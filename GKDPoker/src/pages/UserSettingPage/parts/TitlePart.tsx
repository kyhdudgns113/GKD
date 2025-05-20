import {CSSProperties, FC} from 'react'
import {TextCommonProps} from '../../../common'

type TitleProps = TextCommonProps & {}
export const TitlePart: FC<TitleProps> = ({className, style, ...props}) => {
  const styleTitle: CSSProperties = {
    ...style,
    fontSize: '32px',
    fontWeight: 700,
    marginTop: '16px'
  }
  return (
    <p className={`TITLE ${className || ''}`} style={styleTitle} {...props}>
      유저 설정
    </p>
  )
}
