import {useCallback, useEffect} from 'react'
import {useSignUpContext} from '../SignUpPage'
import {Input} from '../../../common/components'

export function InputPW2Row() {
  const {pwVal, pw2Val, pw2Err, setPw2Val, setPw2Err} = useSignUpContext()

  const onChangePw2Val = useCallback(
    (newIdVal: string) => {
      setPw2Val(newIdVal)
      setPw2Err('')
    },
    [setPw2Err, setPw2Val]
  )

  useEffect(() => {
    if (!pw2Val) {
      setPw2Err('<< 비밀번호 확인란이 공란입니다. >>')
    } // BLANK LINE COMMENT:
    else if (pwVal !== pw2Val) {
      setPw2Err('<< 비밀번호가 다릅니다. >>')
    } // BLANK LINE COMMENT:
    else {
      setPw2Err('')
    }
  }, [pwVal, pw2Val, setPw2Err])

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex flex-row items-center ">
        <p className="text-gkd-sakura-text text-3xl font-bold text-center w-24 ">PW2</p>
        <Input
          className=" w-96 rounded-xl text-xl pl-2 pr-2 pt-1 pb-1 "
          onChange={e => onChangePw2Val(e.currentTarget.value)}
          tabIndex={4}
          type="password"
          value={pw2Val}
        />
      </div>
      <div className="flex flex-row items-center ">
        <div className="w-12"></div>
        <p className="text-red-500 font-bold h-4">{pw2Err}</p>
      </div>
    </div>
  )
}
