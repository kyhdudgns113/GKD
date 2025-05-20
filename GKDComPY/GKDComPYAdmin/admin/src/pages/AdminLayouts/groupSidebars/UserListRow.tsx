import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useNavigate} from 'react-router-dom'
import {useAdminContext} from '../AdminLayout'
import {IconFilled, Text3XL} from '../../../common/components'

export type UserListRowProps = DivCommonProps & {
  //
}
export const UserListRow: FC<UserListRowProps> = ({className, ...props}) => {
  const {whichList} = useAdminContext()

  const navigate = useNavigate()

  const onClickNavigate = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate('/admin/userList')
    },
    [navigate]
  )

  return (
    <div
      className={`cursor-pointer flex flex-row  hover:bg-gkd-sakura-bg-70 pt-1 pb-2 ${className}`}
      onClick={onClickNavigate}
      {...props}>
      <Text3XL className="ml-4">User List</Text3XL>
      {whichList === 'user' && <IconFilled className="text-3xl ml-auto mr-2" iconName="verified" />}
    </div>
  )
}
