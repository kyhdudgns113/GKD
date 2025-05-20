import {useCallback, useState, type CSSProperties, type KeyboardEvent} from 'react'
import {Modal, SAKURA_TEXT, SAKURA_BORDER, SAKURA_BG, SAKURA_BG_70} from '../../common'
import {Input} from '../../common/components'
import {useModalCallbacksContext} from '../../contexts/modal/_callbacks'
import {serverUrl} from '../../common/secret'
import {useAuthCallbacksContext} from '../../contexts/auth/_callbacks'

export function ModalLogIn() {
  const {closeModal} = useModalCallbacksContext()
  const {logIn} = useAuthCallbacksContext()

  /* eslint-disable */
  const [userId, setUserId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  /* eslint-enable */

  const styleModal: CSSProperties = {
    alignItems: 'center',
    color: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'column',
    height: '400px',
    width: '400px'
  }
  const styleTitle: CSSProperties = {
    color: SAKURA_TEXT,
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '16px',
    marginTop: '8px'
  }
  const styleInputRow: CSSProperties = {
    alignContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 'fit-content',
    justifyContent: 'center',

    marginTop: '16px',
    textAlign: 'center',
    width: '100%'
  }
  const styleCategory: CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    width: '100px'
  }
  const styleInput: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '8px',
    borderWidth: '1px',
    fontSize: '18px',
    height: '40px',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: '240px'
  }
  const styleBtnRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '50px',
    justifyContent: 'center',

    marginTop: 'auto',
    marginBottom: '16px'
  }
  const styleBtn: CSSProperties = {
    margin: '8px',
    padding: '8px',

    borderRadius: '12px',
    borderWidth: '4px',
    borderColor: SAKURA_BORDER,

    fontSize: '20px',
    fontWeight: 700,

    width: '100px'
  }

  const onClickGoogle = useCallback(() => {
    const url = `${serverUrl}/client/auth/signUpGoogle`
    if (userId !== '일단아무거나입력하고봅니다ㅎㅎ') {
      alert('Google Console 을 아직 적용 안했어요')
      return
    }
    window.location.href = url
  }, [userId])

  const onClickLogIn = useCallback(() => {
    logIn(userId, password).then(result => {
      if (result) {
        closeModal()
      }
    })
  }, [userId, password, logIn, closeModal])

  const onKeyDownModal = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Enter':
          onClickLogIn()
          break
        case 'Escape':
          closeModal()
          break
      }
    },
    [onClickLogIn, closeModal]
  )

  return (
    <Modal onClose={() => {}}>
      <style>
        {`
          button {
            background-color: ${SAKURA_BG};
          }
          button:hover {
            background-color: ${SAKURA_BG_70};
          }
          `}
      </style>
      <div onKeyDown={onKeyDownModal} style={styleModal} tabIndex={0}>
        {/* Title */}
        <p style={styleTitle}>회원 가입</p>

        {/* 아이디 입력 */}
        <div style={styleInputRow}>
          <p style={styleCategory}>아이디</p>
          <Input
            value={userId}
            onChange={e => setUserId(e.currentTarget.value)}
            style={styleInput}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div style={styleInputRow}>
          <p style={styleCategory}>비밀번호</p>
          <Input
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            style={styleInput}
            type="password"
          />
        </div>

        {/* Google 로그인 버튼 */}
        <div style={{marginTop: '16px'}} onClick={onClickGoogle}>
          구글 로그인(미구현)
        </div>

        {/* 액션 버튼 */}
        <div style={styleBtnRow}>
          <button style={styleBtn} onClick={onClickLogIn}>
            확인
          </button>
          <button style={styleBtn} onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
