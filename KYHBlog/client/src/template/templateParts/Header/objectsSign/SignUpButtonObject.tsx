import {useCallback} from 'react'
import {useModalCallbacksContext} from '@context'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type SignUpButtonObjectProps = DivCommonProps & {}

export const SignUpButtonObject: FC<SignUpButtonObjectProps> = ({className, style, ...props}) => {
  const {openModal} = useModalCallbacksContext()

  const styleObject: CSSProperties = {
    ...style,

    cursor: 'pointer'
  }

  const onClickSignUp = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      openModal('signUp')
    },
    [openModal]
  )

  return (
    <div
      className={`SignUpButton_Object _buttonObject ${className || ''}`}
      onClick={onClickSignUp}
      style={styleObject}
      {...props} // ::
    >
      <p>SignUp</p>
    </div>
  )
}
