import {useCallback} from 'react'
import {Outlet} from 'react-router-dom'

import {useModalStatesContext} from '@contexts/modal/__states'

import {Header} from './Header'
import {Lefter} from './Lefter'
import {Footer} from './Footer'

import {widthPage} from '@value'
import {MarginWidthBlock} from '@component'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as M from './Modals'

type TemplateProps = DivCommonProps & {}
export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {
    modalName,
    setDelCommentOId,
    setDelReplyCommentOId,
    setDelReplyDateString,
    setEditCommentOId,
    setEditReplyCommentOId,
    setEditReplyDateString,
    setIsOpenAlarm
  } = useModalStatesContext()

  const styleTemplate: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%'
  }
  const styleLefterOutlet: CSSProperties = {
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
  }, [
    setDelCommentOId,
    setDelReplyCommentOId,
    setDelReplyDateString,
    setEditCommentOId,
    setEditReplyCommentOId,
    setEditReplyDateString,
    setIsOpenAlarm
  ])

  return (
    <div
      className={`TEMPLATE ${className || ''}`}
      onClick={onClickTemplate}
      style={styleTemplate}
      {...props} // ::
    >
      {/* 헤더 영역 */}
      <Header height="90px" />

      {/* 가운데 영역: Lefter + Outlet */}
      <div className="LEFTER_AND_OUTLET " style={styleLefterOutlet}>
        <MarginWidthBlock width="40px" />
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
