import {FC, MouseEvent, useCallback} from 'react'
import {SpanCommonProps} from '../../../common'
import {Icon} from '../../../common/components'
import {useAuthContext} from '../../../contexts'

export type RefreshProps = SpanCommonProps & {
  //
}
export const Refresh: FC<RefreshProps> = ({className, ...props}) => {
  const {refreshToken} = useAuthContext()

  const onClickRefresh = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      refreshToken()
    },
    [refreshToken]
  )
  return (
    <Icon
      className={`cursor-pointer select-none text-3xl ${className}`}
      iconName={'refresh'}
      onClick={onClickRefresh}
      {...props}
    />
  )
}
