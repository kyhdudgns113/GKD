import {CheckAuth} from '@guard'
import {AUTH_GUEST} from '@secret'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type MainPageProps = DivCommonProps & {reqAuth?: number}

export const MainPage: FC<MainPageProps> = ({reqAuth, className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%'
  }

  return (
    <CheckAuth reqAuth={reqAuth || AUTH_GUEST}>
      <div className={`MainPage ${className || ''}`} style={stylePage} {...props}>
        <p>MainPage</p>
      </div>
    </CheckAuth>
  )
}
