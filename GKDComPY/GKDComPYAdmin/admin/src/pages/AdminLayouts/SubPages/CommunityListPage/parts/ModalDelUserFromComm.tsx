import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../../../common'
import {Button, Modal, Text5XL} from '../../../../../common/components'
import {useCommunityListContext} from '../CommunityListPage'

type ModalDelUserFromCommProps = DivCommonProps & {
  //
}
export const ModalDelUserFromComm: FC<ModalDelUserFromCommProps> = ({className, ...props}) => {
  const {
    commUsersArr,
    commOId,
    isModelDelUser: userIdx,
    deleteUser,
    setIsModalDelUser
  } = useCommunityListContext()

  const styleBlock: CSSProperties = {
    width: '500px',
    height: 'auto',

    paddingTop: '20px',
    paddingBottom: '20px'
  }

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsModalDelUser(-1)
    },
    [setIsModalDelUser]
  )
  const onClickDelete = useCallback(
    (commOId: string, uOId: string) => async (e: MouseEvent<HTMLButtonElement>) => {
      deleteUser(commOId, uOId)
      setIsModalDelUser(-1)
    },
    [deleteUser, setIsModalDelUser]
  )

  return (
    <Modal
      className={` ${className}`}
      onClose={() => {}}
      style={styleBlock}
      {...props} //
    >
      <Text5XL className="select-none">유저 삭제: {commUsersArr[userIdx].id}</Text5XL>

      <div className="flex flex-row w-2/3 justify-between mt-8">
        <Button onClick={onClickDelete(commOId, commUsersArr[userIdx].uOId)}>Delete</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
