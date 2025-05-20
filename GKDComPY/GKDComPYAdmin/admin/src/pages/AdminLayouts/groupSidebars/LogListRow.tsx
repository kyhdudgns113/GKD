import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useAdminContext} from '../AdminLayout'
import {useNavigate} from 'react-router-dom'
import {IconFilled, Text3XL} from '../../../common/components'

type LogListRowProps = DivCommonProps & {}
export const LogListRow: FC<LogListRowProps> = ({className, ...props}) => {
  const {whichList} = useAdminContext()

  const navigate = useNavigate()

  const onClickNavigate = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate('/admin/logList')
    },
    [navigate]
  )

  return (
    <div
      className={`cursor-pointer flex flex-row  hover:bg-gkd-sakura-bg-70 pt-1 pb-2 ${className}`}
      onClick={onClickNavigate}
      {...props} // BLANK LINE COMMENT:
    >
      <Text3XL className="ml-4">Log List</Text3XL>
      {whichList === 'log' && <IconFilled className="text-3xl ml-auto mr-2" iconName="verified" />}
    </div>
  )
}
