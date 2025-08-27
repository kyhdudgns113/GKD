import {useCallback} from 'react'
import {useModalCallbacksContext} from '@context'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type LogInButtonObjectProps = DivCommonProps & {}

export const LogInButtonObject: FC<LogInButtonObjectProps> = ({className, style, ...props}) => {
  const {openModal} = useModalCallbacksContext()

  const styleObject: CSSProperties = {
    ...style,

    cursor: 'pointer'
  }

  const onClickLogIn = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      openModal('logIn')
    },
    [openModal]
  )

  return (
    <div
      className={`LogInButton_Object _buttonObject ${className || ''}`}
      onClick={onClickLogIn}
      style={styleObject}
      {...props} // ::
    >
      <p>LogIn</p>
    </div>
  )
}
