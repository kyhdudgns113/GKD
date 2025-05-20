import {FC, useCallback} from 'react'
import {DivCommonProps} from '../common'
import {Text3XL} from '../common/components'
import {getWithJwt} from '../common/server'
import {alertErrors} from '../common/utils'

type NullPageProps = DivCommonProps & {
  //
}
export const NullPage: FC<NullPageProps> = ({className, ...props}) => {
  return (
    <div className={`flex flex-col items-center ${className}`} {...props}>
      <Text3XL>NULL PAGE</Text3XL>
    </div>
  )
}
