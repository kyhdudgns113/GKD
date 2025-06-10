import {useModalStatesContext} from '@contexts/modal/__states'
import {Outlet} from 'react-router-dom'
import {Header} from './Header'
import {Lefter} from './Lefter'
import {Footer} from './Footer'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as M from './Modals'
import {MarginWidthBlock} from '@components/MarginBlocks'

type TemplateProps = DivCommonProps & {}
export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {modalName} = useModalStatesContext()

  const styleTemplate: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw'
  }
  const styleMiddle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    width: '100%'
  }
  const styleLefter: CSSProperties = {
    width: '200px'
  }
  const styleOutlet: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: '1600px' // Lefter의 margin 도 고려해야함.
  }

  return (
    <div className={`TEMPLATE ${className || ''}`} style={styleTemplate} {...props}>
      {/* 헤더 영역 */}
      <Header height="90px" />

      {/* 가운데 영역: Lefter + Outlet */}
      <div className="LEFTER_AND_OUTLET " style={styleMiddle}>
        <MarginWidthBlock width="20px" />
        <Lefter style={styleLefter} />

        <div className="OUTLET_DIV " style={styleOutlet}>
          <Outlet />
        </div>
      </div>

      {/* 푸터 영역 */}
      <Footer height="100px" />

      {/* 모달 영역 */}
      {modalName === 'deleteFile' && <M.ModalDelFile />}
      {modalName === 'fixDir' && <M.ModalFixDir />}
      {modalName === 'logIn' && <M.ModalLogIn />}
      {modalName === 'signUp' && <M.ModalSignUp />}
    </div>
  )
}
