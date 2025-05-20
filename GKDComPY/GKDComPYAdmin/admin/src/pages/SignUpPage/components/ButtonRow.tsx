import {useNavigate} from 'react-router-dom'
import {FC, MouseEvent, useCallback} from 'react'
import {Button} from '../../../common/components'

type ButtonRowProps = {
  signUp: (e: MouseEvent<HTMLButtonElement>) => void
}

export const ButtonRow: FC<ButtonRowProps> = ({signUp}) => {
  const navigate = useNavigate()

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      navigate('/')
    },
    [navigate]
  )

  return (
    <div className="flex flex-row mt-8 w-2/3 justify-between">
      <Button onClick={signUp}>Sign Up</Button>
      <Button onClick={onClickCancel}>Cancel</Button>
    </div>
  )
}
