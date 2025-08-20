import {Outlet} from 'react-router-dom'
import {useModalStatesContext} from '@context'
import {Header, Lefter} from './templateParts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as M from './templateModals'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {modalName} = useModalStatesContext()

  const styleTemplate: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%'
  }
  const styleBody: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    position: 'relative',
    width: '100%'
  }
  const stylePage: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    minHeight: '800px',
    width: '100%'
  }

  return (
    <div className={`Template ${className || ''}`} style={styleTemplate} {...props}>
      {/* 1. Header Area */}
      <Header height="100px" />

      {/* 2. Body Area */}
      <div className="Body" style={styleBody}>
        <Lefter />
        <div className="Page" style={stylePage}>
          <Outlet />
        </div>
      </div>

      {/* 3. Footer Area */}

      {/* 4. Modal Area */}
      {modalName === 'logIn' && <M.ModalLogIn />}
      {modalName === 'signUp' && <M.ModalSignUp />}
    </div>
  )
}
