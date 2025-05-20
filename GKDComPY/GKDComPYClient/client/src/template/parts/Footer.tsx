import {CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BG, SAKURA_TEXT} from '../../common'

type FooterProps = DivCommonProps & {}
export const Footer: FC<FooterProps> = ({className, style, ...props}) => {
  const styleDiv: CSSProperties = {
    ...style,
    alignItems: 'center',
    backgroundColor: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: '16px',
    paddingBottom: '16px',
    color: SAKURA_BG
  }
  return (
    <div className={`FOOTER ${className || ''}`} style={styleDiv} {...props}>
      <p>Copyright by dudgns113@gmail.com</p>
    </div>
  )
}
