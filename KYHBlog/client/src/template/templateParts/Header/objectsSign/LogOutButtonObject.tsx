import {useCallback} from 'react'
import {useAuthCallbacksContext} from '@context'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type LogOutButtonObjectProps = DivCommonProps & {}

export const LogOutButtonObject: FC<LogOutButtonObjectProps> = ({className, style, ...props}) => {
  const {logOut} = useAuthCallbacksContext()

  const styleObject: CSSProperties = {
    ...style,

    cursor: 'pointer'
  }

  const onClickLogOut = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      logOut()
    },
    [logOut]
  )

  return (
    <div className={`LogOutButton_Object _buttonObject ${className || ''}`} onClick={onClickLogOut} style={styleObject} {...props}>
      <p>LogOut</p>
    </div>
  )
}
