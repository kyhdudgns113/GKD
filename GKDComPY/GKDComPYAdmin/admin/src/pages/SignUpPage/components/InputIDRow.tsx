import {useCallback, useEffect} from 'react'
import {useSignUpContext} from '../SignUpPage'
import {Input} from '../../../common/components'

export function InputIDRow() {
  const {idVal, idErr, setIdVal, setIdErr} = useSignUpContext()

  const onChangeIdVal = useCallback(
    (newIdVal: string) => {
      setIdVal(newIdVal)
      setIdErr('')
    },
    [setIdVal, setIdErr]
  )

  useEffect(() => {
    if (!idVal) {
      setIdErr('<< ID 가 공란입니다. >>')
    }
  }, [idVal, setIdErr])

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex flex-row items-center ">
        <p className="text-gkd-sakura-text text-3xl font-bold text-center w-24 ">ID</p>
        <Input
          className=" w-96 rounded-xl text-xl pl-2 pr-2 pt-1 pb-1 "
          onChange={e => onChangeIdVal(e.currentTarget.value)}
          tabIndex={1}
          type="text"
          value={idVal}
        />
      </div>
      <div className="flex flex-row items-center ">
        <div className="w-12"></div>
        <p className="text-red-500 font-bold h-4">{idErr}</p>
      </div>
    </div>
  )
}
