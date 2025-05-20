import {useCallback, useEffect} from 'react'
import {useSignUpContext} from '../SignUpPage'
import {Input} from '../../../common/components'

export function InputPWRow() {
  const {pwVal, pwErr, setPwVal, setPwErr} = useSignUpContext()

  const onChangePwVal = useCallback(
    (newIdVal: string) => {
      setPwVal(newIdVal)
      setPwErr('')
    },
    [setPwErr, setPwVal]
  )

  useEffect(() => {
    if (!pwVal) {
      setPwErr('<< 비밀번호가 공란입니다. >>')
    } // BLANK LINE COMMENT:
  }, [pwVal, setPwErr])

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex flex-row items-center ">
        <p className="text-gkd-sakura-text text-3xl font-bold text-center w-24 ">PW</p>
        <Input
          className=" w-96 rounded-xl text-xl pl-2 pr-2 pt-1 pb-1 "
          onChange={e => onChangePwVal(e.currentTarget.value)}
          tabIndex={3}
          type="password"
          value={pwVal}
        />
      </div>
      <div className="flex flex-row items-center ">
        <div className="w-12"></div>
        <p className="text-red-500 font-bold h-4">{pwErr}</p>
      </div>
    </div>
  )
}
