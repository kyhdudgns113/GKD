import {useCallback, useEffect, useState} from 'react'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useAuthCallbacksContext} from '@contexts/auth/_callbacks'
import {useModalCallbacksContext} from '@contexts/modal/_callbacks'
import {useModalStatesContext} from '@contexts/modal/__states'
import {useUserStatesContext} from '@contexts/user/__states'

import {SAKURA_TEXT} from '@value'
import {Icon} from '@components/Icons'
import {AlarmCntObject, AlarmModalObject} from '../objects'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type SignAreaPartProps = DivCommonProps & {height?: string}

export const SignAreaPart: FC<SignAreaPartProps> = ({height, className, ...props}) => {
  const {userId, userName} = useAuthStatesContext()
  const {logOut} = useAuthCallbacksContext()
  const {openModal} = useModalCallbacksContext()
  const {isOpenAlarm, setIsOpenAlarm} = useModalStatesContext()
  const {newAlarmArrLen} = useUserStatesContext()

  const [isLogIn, setIsLogIn] = useState<boolean>(false)

  // AREA1: 스타일 영역역
  const stylePart: CSSProperties = {
    alignItems: 'center',
    color: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'row',
    height: height || 'fit-content',

    userSelect: 'none',
    width: '100%'
  }
  const styleBtnRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    marginLeft: 'auto',
    width: 'fit-content'
  }
  const styleAlarmWrapper: CSSProperties = {
    height: 'fit-content',

    overflow: 'visible',
    position: 'relative',
    width: 'auto'
  }
  const styleAlarm: CSSProperties = {
    cursor: 'pointer',
    fontSize: '24px',
    marginLeft: 'auto',
    marginRight: '16px'
  }
  const styleUserName: CSSProperties = {
    fontSize: '16px',
    fontWeight: 900,
    marginRight: '16px'
  }
  const styleLogOutBtn: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 900,
    marginRight: '24px'
  }
  const styleLogInBtn: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 900,
    marginLeft: 'auto',
    marginRight: '24px'
  }
  const styleSignBtn: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 900,
    marginRight: '16px'
  }
  // const styleAlarmList: CSSProperties = {
  //   backgroundColor: 'white',
  //   borderColor: SAKURA_BORDER,
  //   borderRadius: '16px',
  //   borderWidth: '2px',
  //   boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',

  //   padding: '16px',
  //   position: 'absolute',
  //   top: '8px',
  //   left: '-250px',

  //   width: '250px',
  //   zIndex: 10
  // }
  // AREA2: 이벤트 핸들러 영역

  const onClickAlarm = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsOpenAlarm(prev => !prev)
    },
    [setIsOpenAlarm]
  )

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
    } // ::
    else {
      setIsLogIn(false)
    }
  }, [userId])

  // AREA4: 렌더링
  return (
    <div className={`SIGN_AREA_PART ${className || ''}`} style={stylePart} {...props}>
      <div className="SIGN_AREA_BTN_ROW " style={styleBtnRow}>
        {/* 1. (로그인) 알람 아이콘 */}
        {isLogIn && (
          <div className="ALARM_WRAPPER " style={styleAlarmWrapper}>
            {/* 1-1. 알람 아이콘 */}
            <Icon
              iconName="notifications"
              onClick={onClickAlarm}
              style={styleAlarm} // ::
            />

            {/* 1-2. 알람 리스트 */}
            {isOpenAlarm && <AlarmModalObject />}
            {newAlarmArrLen > 0 && <AlarmCntObject />}
          </div>
        )}

        {/* 2. (로그인) 유저 이름 */}
        {isLogIn && <p style={styleUserName}>{userName}</p>}

        {/* 3. (로그인) 로그아웃 버튼 */}
        {isLogIn && (
          <p onClick={onClickLogOut} style={styleLogOutBtn}>
            Log Out
          </p>
        )}

        {/* 4. (로그인 안됨) 로그인 버튼 */}
        {!isLogIn && (
          <p onClick={onClickLogIn} style={styleLogInBtn}>
            Log In
          </p>
        )}

        {/* 5. (로그인 안됨) 회원가입 버튼 */}
        {!isLogIn && (
          <p onClick={onClickSignUp} style={styleSignBtn}>
            Sign Up
          </p>
        )}
      </div>
    </div>
  )
}
