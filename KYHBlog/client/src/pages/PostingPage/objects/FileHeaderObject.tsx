import {HeaderBtnRowGroup, HeaderTitleGroup} from '../groupsEdit'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type FileHeaderObjectProps = DivCommonProps

export const FileHeaderObject: FC<FileHeaderObjectProps> = ({className, style, ...props}) => {
  return (
    <div className={`FileHeader_Object ${className || ''}`} style={style} {...props}>
      <HeaderBtnRowGroup />
      <HeaderTitleGroup />
    </div>
  )
}
