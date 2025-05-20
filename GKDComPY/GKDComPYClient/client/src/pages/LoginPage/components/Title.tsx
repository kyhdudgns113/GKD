import {FC} from 'react'
import {ParagraphCommonProps} from '../../../common'

export type TitleProps = ParagraphCommonProps & {
  //
}

export const Title: FC<TitleProps> = ({className, ...props}) => {
  return <p className="mt-4 mb-4 text-gkd-sakura-text text-5xl font-bold">컴프야 클럽 매니저</p>
}
