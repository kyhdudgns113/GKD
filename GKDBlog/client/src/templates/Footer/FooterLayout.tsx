import {SAKURA_BG_70, SAKURA_BORDER} from '@commons/typesAndValues'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type FooterLayoutProps = DivCommonProps & {height?: string}

export const FooterLayout: FC<FooterLayoutProps> = ({height, className, style, ...props}) => {
  const styleFooter: CSSProperties = {
    ...style,

    alignItems: 'center',

    backgroundColor: SAKURA_BG_70,

    borderColor: SAKURA_BORDER,
    borderTopWidth: '2px',

    display: 'flex',
    flexDirection: 'column',

    height: height || '100px',

    justifyContent: 'center',

    marginTop: 'auto',

    width: '100%'
  }

  return (
    <div className={`FOOTER_LAYOUT ${className || ''}`} style={styleFooter} {...props}>
      <p>Footer</p>
    </div>
  )
}
