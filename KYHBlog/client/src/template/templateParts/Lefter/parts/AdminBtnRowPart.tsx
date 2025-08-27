import {PostButton, SettingButton} from '../components'

import '../_styles/AdminBtnRowPart.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type AdminBtnRowPartProps = DivCommonProps & {}

export const AdminBtnRowPart: FC<AdminBtnRowPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`AdminBtnRow_Part ${className || ''}`} style={style} {...props}>
      <SettingButton />
      <PostButton />
    </div>
  )
}
