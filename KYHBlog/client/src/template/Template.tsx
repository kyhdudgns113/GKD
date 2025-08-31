import {useCallback} from 'react'
import {Outlet} from 'react-router-dom'
import {Header, Lefter, Righter} from './templateParts'

import type {CSSProperties, DragEvent, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as CT from '@context'
import * as M from './templateModals'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {modalName} = CT.useModalStatesContext()
  const {unselectMoveDirFile} = CT.useDirectoryCallbacksContext()
  const {unselectFileUser, unselectDeleteComment} = CT.useFileCallbacksContext()

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

  const onClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()

      unselectDeleteComment()
      // unselectEditComment() // 댓글 수정중일때 다른곳 클릭해도 유지한다.
      unselectFileUser()
      unselectMoveDirFile()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()

      unselectDeleteComment()
      // unselectEditComment() // 댓글 수정중일때 다른곳 클릭해도 유지한다.
      unselectFileUser()
      unselectMoveDirFile()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`Template ${className || ''}`} onDragStart={onDragStart} onClick={onClick} style={styleTemplate} {...props}>
      {/* 1. Header Area */}
      <Header height="100px" />

      {/* 2. Body Area */}
      <div className="Body" style={styleBody}>
        <Lefter />
        <div className="Page" style={stylePage}>
          <Outlet />
        </div>
        <Righter />
      </div>

      {/* 3. Footer Area */}

      {/* 4. Modal Area */}
      {modalName === 'logIn' && <M.ModalLogIn />}
      {modalName === 'setDir' && <M.ModalSetDir />}
      {modalName === 'setFile' && <M.ModalSetFile />}
      {modalName === 'signUp' && <M.ModalSignUp />}
    </div>
  )
}
