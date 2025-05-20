import {FC, MouseEvent, useCallback} from 'react'
import {SpanCommonProps} from '../../../common'
import {Icon} from '../../../common/components'
import {useAuthContext} from '../../../contexts'

export type LogoutProps = SpanCommonProps & {
  //
}
export const Logout: FC<LogoutProps> = ({className, ...props}) => {
  const {logOut} = useAuthContext()

  const onClickLogout = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      logOut()
    },
    [logOut]
  )
  return (
    <Icon
      className={`cursor-pointer select-none text-3xl ${className}`}
      iconName={'logout'}
      onClick={onClickLogout}
      {...props}
    />
  )
}
