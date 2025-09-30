import {useAuthStatesContext} from '@context'
import {SAKURA_TEXT} from '@value'

import '../_styles/SignAreaPart.scss'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as O from '../objectsSign'

type SignAreaPartProps = DivCommonProps & {}

export const SignAreaPart: FC<SignAreaPartProps> = ({className, style, ...props}) => {
  const {isLoggedIn} = useAuthStatesContext()

  const stylePart: CSSProperties = {
    ...style,

    alignItems: 'center',
    color: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'row',

    height: 'fit-content',

    width: '100%'
  }
  const styleBtnRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    justifyContent: 'center',

    marginLeft: 'auto',
    paddingRight: '16px',

    userSelect: 'none',
    width: 'fit-content'
  }

  return (
    <div className={`SignArea_Part ${className || ''}`} style={stylePart} {...props}>
      {/*
       *    Part 의 가로를 100% 로 유지하면서
       *    버튼들을 오른쪽으로 몰아넣기 위한 marginLeft, width 조정을 하기위해
       *    div 를 하나 더 만들었다.
       *    이렇게 안하면 로그인시, 비로그인시 marginLeft: auto 를 다르게 설정해야 한다.
       */}
      <div className="_buttonRow " style={styleBtnRow}>
        {isLoggedIn && <O.AlarmInfoObject />}
        {isLoggedIn && <O.UserNameObject />}
        {isLoggedIn && <O.LogOutButtonObject />}

        {!isLoggedIn && <O.LogInButtonObject />}
        {!isLoggedIn && <O.SignUpButtonObject />}
      </div>
    </div>
  )
}
