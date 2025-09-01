import {useState} from 'react'
import {MarginHeightBlock} from '@component'
import {useAuthStatesContext} from '@context'
import {AUTH_ADMIN} from '@secret'
import {ToggleButton} from './components'
import {AdminBtnRowPart, DirectoryViewPart} from './parts'

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
        <div className="_LefterBody">
          {userAuth === AUTH_ADMIN && <AdminBtnRowPart />}
          {userAuth !== AUTH_ADMIN && <MarginHeightBlock height="40px" />}
          <DirectoryViewPart />
        </div>
      )}
      <ToggleButton setIsOpen={setIsOpen} />
    </div>
  )
}
