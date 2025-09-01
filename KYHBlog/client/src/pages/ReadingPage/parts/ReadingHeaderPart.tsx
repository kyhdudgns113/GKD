import {HeaderNameObject, HeaderUserObject} from '../objects'

import '../_styles/ReadingPage.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingHeaderPartProps = DivCommonProps

export const ReadingHeaderPart: FC<ReadingHeaderPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`ReadingHeader_Part ${className || ''}`} style={style} {...props}>
      <HeaderNameObject />
      <HeaderUserObject />
      <div className="_bottomLine" />
    </div>
  )
}
