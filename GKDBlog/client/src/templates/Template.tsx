import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../common'
import {Header} from './Header'
import {Lefter} from './Lefter'
import {Outlet} from 'react-router-dom'
import {useModalStatesContext} from '../contexts/modal/__states'

import * as M from './Modals'

type TemplateProps = DivCommonProps & {}
export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {modalName} = useModalStatesContext()

  const styleTemplate: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw'
  }
  const styleMiddle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    width: '100%'
  }
  const styleLefter: CSSProperties = {
    marginLeft: '20px',
    width: '200px'
  }
  const styleOutlet: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: '1700px' // Lefter의 margin 도 고려해야함.
  }

  return (
    <div className={`TEMPLATE ${className || ''}`} style={styleTemplate} {...props}>
      {/* 헤더 영역 */}
      <Header height="90px" />

      {/* 가운데 영역: Lefter + Outlet */}
      <div style={styleMiddle}>
        <Lefter style={styleLefter} />

        <div style={styleOutlet}>
          <Outlet />
        </div>
      </div>

      {/* 모달 영역 */}
      {modalName === 'deleteFile' && <M.ModalDelFile />}
      {modalName === 'fixDir' && <M.ModalFixDir />}
      {modalName === 'logIn' && <M.ModalLogIn />}
      {modalName === 'signUp' && <M.ModalSignUp />}
    </div>
  )
}
