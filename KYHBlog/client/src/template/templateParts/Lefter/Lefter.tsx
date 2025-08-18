import {useAuthStatesContext} from '@context'
import {AUTH_ADMIN} from '@secret'
import {AdminBtnRowObject, DirectoryViewObject} from './objects'

import './_styles/Lefter.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type LefterProps = DivCommonProps & {}

export const Lefter: FC<LefterProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()

  return (
    <div className={`Lefter ${className || ''}`} style={style} {...props}>
      {userAuth === AUTH_ADMIN && <AdminBtnRowObject />}
      <DirectoryViewObject />
    </div>
  )
}
