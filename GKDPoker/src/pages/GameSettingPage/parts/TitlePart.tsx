import {CSSProperties, FC} from 'react'
import {TextCommonProps} from '../../../common'

type TitlePartProps = TextCommonProps & {}
export const TitlePart: FC<TitlePartProps> = ({className, ...props}) => {
  const styleTitle: CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    marginTop: '16px'
  }
  return (
    <p className={`TITLE ${className || ''}`} style={styleTitle} {...props}>
      게임 설정
    </p>
  )
}
