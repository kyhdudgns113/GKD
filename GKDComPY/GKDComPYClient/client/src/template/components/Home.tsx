import {FC, MouseEvent, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {SpanCommonProps} from '../../common'
import {IconFilled} from '../../common/components'

type HomeProps = SpanCommonProps & {}
export const Home: FC<HomeProps> = ({className, ...props}) => {
  const navigate = useNavigate()

  const onClickHome = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      navigate('/')
    },
    [navigate]
  )
  return (
    <IconFilled
      className={`cursor-pointer select-none text-3xl ${className}`}
      iconName={'home'}
      onClick={onClickHome}
      {...props}
    />
  )
}
