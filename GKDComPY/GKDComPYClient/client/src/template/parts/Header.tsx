import {FC} from 'react'
import {DivCommonProps} from '../../common'
import {Home, Logout, Refresh} from '../components'

type HeaderProps = DivCommonProps & {}
export const Header: FC<HeaderProps> = ({className, ...props}) => {
  return (
    <div className={`flex flex-row ${className}`} {...props}>
      <Home />
      <Refresh className="ml-4" />
      <Logout className="ml-auto mr-4" />
    </div>
  )
}
