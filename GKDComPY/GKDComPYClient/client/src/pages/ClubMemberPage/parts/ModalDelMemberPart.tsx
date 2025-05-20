import {CSSProperties, FC, MouseEvent, useCallback, useEffect} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Modal, Text3XL} from '../../../common/components'
import {useClubContext} from '../../../contexts'
import {useClubMemberCallbacksContext, useClubMemberStatesContext} from '../_contexts'

type ModalDelMemberPartProps = DivCommonProps & {}
export const ModalDelMemberPart: FC<ModalDelMemberPartProps> = ({className, ...props}) => {
  const {members} = useClubContext()
  const {delMemOId: memOId, setDelMemOId} = useClubMemberStatesContext()
  const {keyDownESC, setKeyDownESC} = useClubMemberStatesContext()
  const {deleteMember} = useClubMemberCallbacksContext()

  const member = members[memOId]

  const styleBlock: CSSProperties = {
    width: '400px',
    height: '250px'
  }

  const onClickNo = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setDelMemOId('')
    },
    [setDelMemOId]
  )
  const onClickYes = useCallback(
    (memOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      deleteMember(memOId)
      setDelMemOId('')
    },
    [deleteMember, setDelMemOId]
  )

  // Key Down : ESC
  useEffect(() => {
    if (keyDownESC) {
      setDelMemOId('')
      setKeyDownESC(false)
    }
  }, [keyDownESC, setDelMemOId, setKeyDownESC])

  if (!member) return null
  return (
    <Modal
      className={`${className}`}
      onClose={() => setDelMemOId('')}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      <Text3XL className="mt-4">"{member.name}"</Text3XL>
      <Text3XL className="mt-4">삭제 하시겠습니까?</Text3XL>
      <div className="flex flex-row justify-between w-3/4 mt-12">
        <Button onClick={onClickYes(memOId)}>Yes</Button>
        <Button onClick={onClickNo}>No</Button>
      </div>
    </Modal>
  )
}
