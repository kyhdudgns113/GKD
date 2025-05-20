import {useCallback, useEffect, useState} from 'react'
import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'
import {useAuthStatesContext} from '../../../contexts/auth/__states'
import {SAKURA_TEXT} from '../../../common/typesAndValues/values'
import {useModalCallbacksContext} from '../../../contexts/modal/_callbacks'
import {useAuthCallbacksContext} from '../../../contexts/auth/_callbacks'

type SignAreaPartProps = DivCommonProps & {height?: string}
export const SignAreaPart: FC<SignAreaPartProps> = ({height, className, ...props}) => {
  const {userId, userName} = useAuthStatesContext()
  const {logOut} = useAuthCallbacksContext()
  const {openModal} = useModalCallbacksContext()

  const [isLogIn, setIsLogIn] = useState<boolean>(false)

  // AREA1: 스타일 영역역
  const stylePart: CSSProperties = {
    alignItems: 'center',
    color: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'row',
    height: height || 'fit-content',
    justifyContent: 'center',
    width: '100%'
  }
  const styleUserName: CSSProperties = {
    fontSize: '16px',
    fontWeight: 900,
    marginLeft: 'auto',
    marginRight: '16px',
    userSelect: 'none'
  }
  const styleLogOutBtn: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 900,
    marginRight: '24px',
    userSelect: 'none'
  }
  const styleLogInBtn: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 900,
    marginLeft: 'auto',
    marginRight: '24px',
    userSelect: 'none'
  }
  const styleSignBtn: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 900,
    marginRight: '16px',
    userSelect: 'none'
  }

  // AREA2: 이벤트 핸들러 영역
  const onClickLogOut = useCallback(() => {
    logOut()
  }, [logOut])

  const onClickLogIn = useCallback(() => {
    openModal('logIn')
  }, [openModal])

  const onClickSignUp = useCallback(() => {
    openModal('signUp')
  }, [openModal])

  // AREA3: useEffect
  // Set login state
  useEffect(() => {
    if (userId) {
      setIsLogIn(true)
    } // BLANK LINE COMMENT:
    else {
      setIsLogIn(false)
    }
  }, [userId])

  // AREA4: 렌더링
  return (
    <div className={`SIGN_AREA_PART ${className || ''}`} style={stylePart} {...props}>
      {isLogIn && <p style={styleUserName}>{userName}</p>}
      {isLogIn && (
        <p onClick={onClickLogOut} style={styleLogOutBtn}>
          Log Out
        </p>
      )}
      {!isLogIn && (
        <p onClick={onClickLogIn} style={styleLogInBtn}>
          Log In
        </p>
      )}
      {!isLogIn && (
        <p onClick={onClickSignUp} style={styleSignBtn}>
          Sign Up
        </p>
      )}
    </div>
  )
}
