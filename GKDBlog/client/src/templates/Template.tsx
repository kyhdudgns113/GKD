import {useCallback} from 'react'
import {Outlet} from 'react-router-dom'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useModalStatesContext} from '@contexts/modal/__states'

import {Footer} from './Footer'
import {Header} from './Header'
import {Lefter} from './Lefter'
import {Righter} from './Righter'

import {widthPage} from '@value'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as M from './Modals'

type TemplateProps = DivCommonProps & {}
export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {
    modalName,
    setDelCommentOId,
    setDelReplyCommentOId,
    setDelReplyDateString,
    setEditCommentOId,
    setEditReplyCommentOId,
    setEditReplyDateString,
    setIsOpenAlarm,
    setSelReadTargetOId
  } = useModalStatesContext()

  const styleTemplate: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%'
  }
  const styleBody: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    position: 'relative',
    width: '100%'
  }

  const styleOutlet: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: widthPage // Lefter의 margin 도 고려해야함.
  }

  const onClickTemplate = useCallback(() => {
    /**
     * 닫아야 할 extraModal 들을 닫는다
     * - extraModal: 각 페이지등마다 별도로 선언한 모달들
     */
    setDelCommentOId('')
    setDelReplyCommentOId('')
    setDelReplyDateString('')
    setEditCommentOId('')
    setEditReplyCommentOId('')
    setEditReplyDateString('')
    setIsOpenAlarm(false)
    setSelReadTargetOId('')
  }, [
    setDelCommentOId,
    setDelReplyCommentOId,
    setDelReplyDateString,
    setEditCommentOId,
    setEditReplyCommentOId,
    setEditReplyDateString,
    setIsOpenAlarm,
    setSelReadTargetOId
  ])

  return (
    <div
      className={`TEMPLATE ${className || ''}`}
      onClick={onClickTemplate}
      style={styleTemplate}
      {...props} // ::
    >
      {/* 1. 헤더 영역 */}
      <Header height="90px" />

      {/* 2. 바디 영역: Lefter + Outlet + Righter */}
      <div className="BODY " style={styleBody}>
        <Lefter />
        <div className="OUTLET_DIV " style={styleOutlet}>
          <Outlet />
        </div>
        {userOId && <Righter />}
      </div>

      {/* 3. 푸터 영역 */}
      <Footer height="100px" />

      {/* 4. 모달 영역 */}
      {modalName === 'deleteFile' && <M.ModalDelFile />}
      {modalName === 'fixDir' && <M.ModalFixDir />}
      {modalName === 'logIn' && <M.ModalLogIn />}
      {modalName === 'signUp' && <M.ModalSignUp />}
    </div>
  )
}
