import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../../../common'
import {Button, Modal, Text5XL} from '../../../../../common/components'
import {useCommunityListContext} from '../CommunityListPage'

type ModalDelClubFromCommProps = DivCommonProps & {
  //
}
export const ModalDelClubFromComm: FC<ModalDelClubFromCommProps> = ({className, ...props}) => {
  const {
    clubsArr,
    commOId,
    isModalDelClub: clubIdx,
    deleteClub,
    setIsModalDelClub
  } = useCommunityListContext()

  const styleBlock: CSSProperties = {
    width: '500px',
    height: 'auto',

    paddingTop: '20px',
    paddingBottom: '20px'
  }

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsModalDelClub(-1)
    },
    [setIsModalDelClub]
  )
  const onClickDelete = useCallback(
    (commOId: string, clubOId: string) => async (e: MouseEvent<HTMLButtonElement>) => {
      deleteClub(commOId, clubOId)
      setIsModalDelClub(-1)
    },
    [deleteClub, setIsModalDelClub]
  )

  return (
    <Modal
      className={` ${className}`}
      onClose={() => {}}
      style={styleBlock}
      {...props} //
    >
      <Text5XL className="select-none">클럽 삭제: {clubsArr[clubIdx].name}</Text5XL>

      <div className="flex flex-row w-2/3 justify-between mt-8">
        <Button onClick={onClickDelete(commOId, clubsArr[clubIdx].clubOId)}>Delete</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
