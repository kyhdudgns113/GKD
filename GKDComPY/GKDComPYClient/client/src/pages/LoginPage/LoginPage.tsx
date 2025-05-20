import {KeyboardEvent, MouseEvent, useCallback, useEffect, useState} from 'react'
import {InputRow, Title} from './components'
import {useNavigate} from 'react-router-dom'
import {Button} from '../../common/components'
import {useAuthContext} from '../../contexts'

export function LoginPage() {
  const {checkLoggedIn, logIn} = useAuthContext()

  const [idVal, setIdVal] = useState<string>('')
  const [idErr, setIdErr] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')
  const [pwErr, setPwErr] = useState<string>('')

  const navigate = useNavigate()

  const onChangeIdVal = useCallback((newIdVal: string) => {
    setIdVal(newIdVal)
    setIdErr('')
  }, [])
  const onChangePwVal = useCallback((newPwVal: string) => {
    setPwVal(newPwVal)
    setPwErr('')
  }, [])

  const onClickLogin = useCallback(
    (idOrEmailVal: string, pwVal: string) => (e: MouseEvent<HTMLButtonElement>) => {
      logIn(idOrEmailVal, pwVal)
    },
    [logIn]
  )
  const onClickSignUp = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      navigate('/signUp')
    },
    [navigate]
  )

  const onKeyDownDiv = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === 'enter') {
        logIn(idVal, pwVal)
      }
    },
    [idVal, pwVal, logIn]
  )

  useEffect(() => {
    checkLoggedIn()
  }, [checkLoggedIn])

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gkd-sakura-bg">
      <div
        className="select-none flex flex-col items-center bg-white border-4 border-gkd-sakura-border rounded-2xl"
        onKeyDown={onKeyDownDiv}
        style={{width: '550px', height: '400px'}} //
      >
        <Title />
        <InputRow
          errorMessage={idErr}
          onChange={e => onChangeIdVal(e.currentTarget.value)}
          type="text"
          value={idVal}>
          ID
        </InputRow>
        <InputRow
          errorMessage={pwErr}
          onChange={e => onChangePwVal(e.currentTarget.value)}
          type="password"
          value={pwVal}>
          PW
        </InputRow>
        <div className="flex flex-row items-center justify-between mt-8 w-2/3 ">
          <Button onClick={onClickLogin(idVal, pwVal)}>Log In</Button>
          <Button onClick={onClickSignUp}>Sign Up</Button>
        </div>
      </div>
    </div>
  )
}
