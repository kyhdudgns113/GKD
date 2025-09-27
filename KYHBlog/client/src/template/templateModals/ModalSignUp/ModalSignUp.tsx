import {useCallback, useState, type KeyboardEvent} from 'react'
import {Input, Modal} from '@component'
import * as C from '@context'
import {USER_NAME_LENGTH_MAX} from '@shareValue'

import './_style.scss'

/**
 * Sign Up Modal
 *
 * 1. Title
 * 2. Input: ID
 * 3. Input: Name
 * 4. Input: Email
 * 5. Input: Password
 * 6. Input: Password Confirm
 * 7. Button Row
 */
export function ModalSignUp() {
  const {isSignUpLocked} = C.useLockStatesContext()
  const {closeModal} = C.useModalCallbacksContext()
  const {signUp} = C.useAuthCallbacksContext()

  const [userId, setUserId] = useState<string>('')
  const [userMail, setUserMail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')

  const onClickSubmit = useCallback(() => {
    if (isSignUpLocked.current.isLock) {
      alert(`회원가입 진행중입니다.`)
      return
    }

    // 1. 아이디 검증
    if (!userId || userId.length < 6 || userId.length > 16) {
      alert('아이디는 6 ~ 16자 이어야 합니다.')
      return
    }

    // 2. 이메일 검증
    if (!userMail || !userMail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
      alert('이메일 형식이 올바르지 않습니다.')
      return
    }

    // 3. 이름 검증
    if (!userName || userName.length < 2 || userName.length > USER_NAME_LENGTH_MAX) {
      alert('이름은 2 ~ 10자 이어야 합니다.')
      return
    }
    // 4. 비밀번호 형식 검증
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/.test(password)) {
      alert('비밀번호는 영문,숫자,특수문자 8~20자 이어야 합니다.')
      return
    }

    // 5. 비밀번호 확인
    if (password !== password2) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    // 6. 회원 가입
    signUp(userId, userMail, userName, password) // ::
      .then(result => {
        if (result) {
          closeModal()
        }
      })
  }, [password, password2, userId, userMail, userName, closeModal, signUp]) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDownModal = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        onClickSubmit()
      } // ::
      else if (e.key === 'Escape') {
        closeModal()
      }
    },
    [closeModal, onClickSubmit]
  )

  return (
    <Modal onClose={() => {}} onKeyDown={onKeyDownModal}>
      <div className="ModalSignUp_Main" tabIndex={0}>
        {/* 1. Title */}
        <p className="_Title">회원 가입</p>

        {/* 2. Input: ID */}
        <div className="_InputRow">
          <p className="__Label">아이디</p>
          <Input
            className="__Input"
            onChange={e => setUserId(e.currentTarget.value)}
            placeholder="로그인 아이디 (6 ~ 16자)"
            value={userId} // ::
          />
        </div>

        {/* 3. Input: Name */}
        <div className="_InputRow">
          <p className="__Label">이름</p>
          <Input
            className="__Input"
            onChange={e => setUserName(e.currentTarget.value)}
            placeholder="이름 (2 ~ 10자)"
            value={userName} // ::
          />
        </div>

        {/* 4. Input: Email */}
        <div className="_InputRow">
          <p className="__Label">이메일</p>
          <Input
            className="__Input"
            onChange={e => setUserMail(e.currentTarget.value)}
            placeholder="이메일"
            value={userMail} // ::
          />
        </div>

        {/* 5. Input: Password */}
        <div className="_InputRow">
          <p className="__Label">비밀번호</p>
          <Input
            className="__Input"
            onChange={e => setPassword(e.currentTarget.value)}
            placeholder="영문,숫자,특수문자 8~20자"
            type="password"
            value={password} // ::
          />
        </div>

        {/* 6. Input: Password Confirm */}
        <div className="_InputRow">
          <p className="__Label">비번확인</p>
          <Input
            className="__Input"
            onChange={e => setPassword2(e.currentTarget.value)}
            placeholder="비밀번호 확인"
            type="password"
            value={password2} // ::
          />
        </div>

        {/* 7. Button Row */}
        <div className="_ButtonRow">
          <button className="AppButton_Sakura" onClick={onClickSubmit}>
            가입
          </button>
          <button className="AppButton_Sakura" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
