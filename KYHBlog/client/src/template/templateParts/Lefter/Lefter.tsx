import {useState} from 'react'
import {useAuthStatesContext} from '@context'
import {AUTH_ADMIN} from '@secret'
import {ToggleButton} from './components'
import {AdminBtnRowObject, DirectoryViewObject} from './objects'

import './_styles/Lefter.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type LefterProps = DivCommonProps & {}

export const Lefter: FC<LefterProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()

  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className={`Lefter ${className || ''}`} style={style} {...props}>
      {isOpen && (
        <div className="LefterBody">
          {userAuth === AUTH_ADMIN && <AdminBtnRowObject />}
          <DirectoryViewObject />
        </div>
      )}
      <ToggleButton setIsOpen={setIsOpen} />
    </div>
  )
}
