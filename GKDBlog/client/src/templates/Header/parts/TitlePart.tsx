import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'

type TitlePartProps = DivCommonProps & {height?: string}
export const TitlePart: FC<TitlePartProps> = ({height, className, ...props}) => {
  const stylePart: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: height || '80px',
    justifyContent: 'center',
    width: '100%'
  }
  const styleTitle: CSSProperties = {
    alignContent: 'center',
    cursor: 'pointer',
    fontSize: '32px',
    fontWeight: 700,
    height: '100%',
    textAlign: 'center',
    userSelect: 'none',
    width: 'fit-content'
  }

  return (
    <div className={`TITLE_PART ${className || ''}`} style={stylePart} {...props}>
      <p style={styleTitle}>강영훈의 개발 블로그</p>
    </div>
  )
}
