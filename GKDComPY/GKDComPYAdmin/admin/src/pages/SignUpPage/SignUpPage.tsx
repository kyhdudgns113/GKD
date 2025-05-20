import {createContext, MouseEvent, useCallback, useContext, useEffect, useState} from 'react'
import {Setter} from '../../common'
import {ButtonRow, InputIDRow, InputPW2Row, InputPWRow, Title} from './components'
import {useNavigate} from 'react-router-dom'
import {SignUpDataType} from '../../common/httpDataTypes'
import {post} from '../../common/server'
import {alertErrors} from '../../common/utils'
import {useAuthContext} from '../../contexts'

// prettier-ignore
type ContextType = {
  idErr: string, setIdErr: Setter<string>,
  idVal: string, setIdVal: Setter<string>,
  pwErr: string, setPwErr: Setter<string>,
  pwVal: string, setPwVal: Setter<string>,
  pw2Err: string, setPw2Err: Setter<string>,
  pw2Val: string, setPw2Val: Setter<string>,
}

// prettier-ignore
export const SignUpContext = createContext<ContextType>({
  idErr: '', setIdErr: () => {},
  idVal: '', setIdVal: () => {},
  pwErr: '', setPwErr: () => {},
  pwVal: '', setPwVal: () => {},
  pw2Err: '', setPw2Err: () => {},
  pw2Val: '', setPw2Val: () => {},
})
export const useSignUpContext = () => {
  return useContext(SignUpContext)
}

export default function SignUpPage() {
  const {checkLoggedIn} = useAuthContext()

  const [idErr, setIdErr] = useState<string>('')
  const [idVal, setIdVal] = useState<string>('')
  const [pwErr, setPwErr] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')
  const [pw2Err, setPw2Err] = useState<string>('')
  const [pw2Val, setPw2Val] = useState<string>('')

  const navigate = useNavigate()

  const signUp = useCallback(
    (idVal: string, pwVal: string) => (e: MouseEvent<HTMLButtonElement>) => {
      if (idErr || pwErr || pw2Err) {
        return
      }

      const signUpData: SignUpDataType = {
        id: idVal,
        password: pwVal
      }

      post('/admin/signUp', signUpData, null)
        .then(res => res.json())
        .then(res => {
          const {ok, errObj} = res
          if (ok) {
            navigate('/')
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/admin/signUp ELSE`, errObj)
            setIdErr(errObj['id'])
          }
        })
        .catch(err => alertErrors('/admin/signUp CATCH', err))
        .finally(() => {})
    },
    [idErr, pwErr, pw2Err, navigate]
  )

  useEffect(() => {
    checkLoggedIn()
  }, [checkLoggedIn])

  // prettier-ignore
  const value = {
    idErr, setIdErr,
    idVal, setIdVal,
    pwErr, setPwErr,
    pwVal, setPwVal,
    pw2Err, setPw2Err,
    pw2Val, setPw2Val,
  }
  return (
    <SignUpContext.Provider
      value={value}
      children={
        <div className="flex items-center justify-center w-screen h-screen bg-gkd-sakura-bg">
          <div
            className="select-none flex flex-col items-center bg-white border-4 border-gkd-sakura-border rounded-2xl"
            style={{width: '550px', height: '600px'}}>
            <Title />
            <InputIDRow />
            <InputPWRow />
            <InputPW2Row />
            <ButtonRow signUp={signUp(idVal, pwVal)} />
          </div>
        </div>
      }
    />
  )
}
