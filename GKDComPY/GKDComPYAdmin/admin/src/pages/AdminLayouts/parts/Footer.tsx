import {FC} from 'react'
import {DivCommonProps} from '../../../common'

export type FooterProps = DivCommonProps & {
  //
}
export const Footer: FC<FooterProps> = ({className, ...props}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center mt-auto pt-4 pb-4 bg-gkd-sakura-text text-gkd-sakura-bg ${className}`}
      {...props}>
      <p>Copyright by dudgns113@gmail.com</p>
    </div>
  )
}
