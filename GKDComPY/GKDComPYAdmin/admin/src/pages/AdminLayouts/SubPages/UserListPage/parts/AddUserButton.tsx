import {FC, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {useUserListContext} from '../UserListPage'
import {Icon, IconFilled} from '../../../../../common/components'

type AddUserButtonProps = DivCommonProps & {
  //
}
export const AddUserButton: FC<AddUserButtonProps> = ({className, ...props}) => {
  const {setIsModalAddUser} = useUserListContext()

  const [isHovered, setIsHovered] = useState<boolean>(false)

  const onClickAddUserModal = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      setIsModalAddUser(prev => !prev)
    },
    [setIsModalAddUser]
  )

  return (
    <div
      className={
        `flex flex-row w-fit ${className} ` +
        (isHovered
          ? 'bg-gkd-sakura-bg rounded-xl border-2 border-gkd-sakura-border'
          : 'border-2 border-transparent') // 초기 상태에서 transparent border 설정
      }
      {...props}
      onClick={onClickAddUserModal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} //
    >
      {isHovered ? (
        <IconFilled className="m-1 cursor-pointer select-none text-4xl" iconName="person_add" />
      ) : (
        <Icon className="m-1 cursor-pointer select-none text-4xl" iconName="person_add" />
      )}
    </div>
  )
}
