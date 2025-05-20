import {FC} from 'react'
import {DivCommonProps} from '../../../common'
import {Text3XL} from '../../../common/components'

type TitleGroupProps = DivCommonProps & {}

export const TitleGroup: FC<TitleGroupProps> = ({className, ...props}) => {
  return (
    <div>
      <Text3XL>전체 멤버</Text3XL>
    </div>
  )
}
