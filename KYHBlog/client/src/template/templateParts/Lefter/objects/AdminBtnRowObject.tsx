import {PostButton, SettingButton} from '../components'

import '../_styles/AdminBtnRowObject.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type AdminBtnRowObjectProps = DivCommonProps & {}

export const AdminBtnRowObject: FC<AdminBtnRowObjectProps> = ({className, style, ...props}) => {
  return (
    <div className={`AdminBtnRow_Object ${className || ''}`} style={style} {...props}>
      <SettingButton />
      <PostButton />
    </div>
  )
}
