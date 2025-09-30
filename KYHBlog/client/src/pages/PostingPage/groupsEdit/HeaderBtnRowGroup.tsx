import {DeleteFileButton, EditFileButton, NoticeFileButton, HideFileButton} from '../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderBtnRowGroupProps = DivCommonProps

export const HeaderBtnRowGroup: FC<HeaderBtnRowGroupProps> = ({className, style, ...props}) => {
  return (
    <div className={`HeaderBtnRow_Group ${className || ''}`} style={style} {...props}>
      <NoticeFileButton />
      <HideFileButton />
      <EditFileButton />
      <DeleteFileButton />
    </div>
  )
}
