import {useCallback, useState, type KeyboardEvent} from 'react'
import {Input, Modal} from '@component'
import * as C from '@context'

import './_style.scss'

/**
 * Sign Up Modal
 *
 * 1. Title
 * 2. Input: ID
 * 3. Input: Password
 * 4. Button Row
 */
export function ModalLogIn() {
  const {isLogInLocked} = C.useLockStatesContext()
  const {closeModal} = C.useModalCallbacksContext()
  const {logIn} = C.useAuthCallbacksContext()

  const [userId, setUserId] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onClickSubmit = useCallback(() => {
    if (isLogInLocked.current.isLock) {
      alert(`로그인 진행중입니다.`)
      return
    }

    // 1. 아이디 검증
    if (!userId || userId.length < 6 || userId.length > 16) {
      alert('아이디는 6 ~ 16자 이어야 합니다.')
      return
    }

    // 2. 비밀번호 형식 검증
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/.test(password)) {
      alert('비밀번호는 영문,숫자,특수문자 8~20자 이어야 합니다.')
      return
    }

    // 3. 로그인
    logIn(userId, password) // ::
      .then(result => {
        if (result) {
          closeModal()
        }
      })
  }, [password, userId, closeModal, logIn]) // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="ModalLogIn_Main" tabIndex={0}>
        {/* 1. Title */}
        <p className="_Title">로그인</p>

        {/* 2. Input: ID */}
        <div className="_InputRow">
          <p className="__Label">아이디</p>
          <Input
            autoFocus
            className="__Input"
            onChange={e => setUserId(e.currentTarget.value)}
            placeholder="로그인 아이디 (6 ~ 16자)"
            value={userId} // ::
          />
        </div>

        {/* 3. Input: Password */}
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

        {/* 4. Button Row */}
        <div className="_ButtonRow">
          <button className="AppButton_Sakura" onClick={onClickSubmit}>
            로그인
          </button>
          <button className="AppButton_Sakura" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
