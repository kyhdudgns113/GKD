import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, Setter} from '../../../common'
import {DeleteIcon, MoveIcon, Text3XL} from '../../../common/components'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {MemberComment, MoveClubs} from '../addons'
import {useClubMemberStatesContext} from '../_contexts'

type MemberInfoBlockProps = DivCommonProps & {
  member: MemberInfoType
  moveClicked: boolean
  setMoveClicked: Setter<boolean>
}
export const MemberInfoBlock: FC<MemberInfoBlockProps> = ({
  member,
  moveClicked,
  setMoveClicked,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {memOId, setDelMemOId} = useClubMemberStatesContext()

  const onClickDelMem = useCallback(
    (memOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      setDelMemOId(memOId)
    },
    [setDelMemOId]
  )
  const onClickMoveIcon = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setMoveClicked(prev => !prev)
    },
    [setMoveClicked]
  )
  const onClose = useCallback(() => {
    setMoveClicked(false)
  }, [setMoveClicked])

  return (
    <div className="flex flex-col">
      <div className={`flex flex-row relative items-center ${className}`} {...props}>
        <Text3XL>{member.name}</Text3XL>
        <DeleteIcon className="ml-4 text-3xl" onClick={onClickDelMem(memOId)} />
        <MoveIcon className="ml-4 text-3xl relative" onClick={onClickMoveIcon} />
        {moveClicked && <MoveClubs className="ml-4" member={member} onClose={onClose} />}
      </div>
      <MemberComment member={member} />
    </div>
  )
}
