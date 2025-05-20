import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, Setter} from '../../common'
import {useTemplateStatesContext} from '../_contexts'
import {useNavigate} from 'react-router-dom'
import {Text2XL} from '../../common/components'
import {IconFilled} from '../../common/components'
import {ClubInfoType} from '../../common/typesAndValues/shareTypes'
type BannedPageRowProps = DivCommonProps & {
  arg: {
    club: ClubInfoType
    clubIdx: number
    clickedClubRow: number | null
    setClickedClubRow: Setter<number | null>
  }
}
export const BannedPageRow: FC<BannedPageRowProps> = ({arg, className, ...props}) => {
  const {comm, selectedClubIdx, whichList} = useTemplateStatesContext()
  const {setClickedClubRow} = arg

  const navigate = useNavigate()

  const onClickNavigate = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate(`/client/club/member/${-1}`)
      setClickedClubRow(null)
    },
    [navigate, setClickedClubRow]
  )

  if (!comm.banClubOId) return null
  return (
    <div
      className={`cursor-pointer flex flex-row  hover:bg-gkd-sakura-bg-70 pt-1 pb-2 ${className}`}
      onClick={onClickNavigate}
      {...props} // BLANK LINE COMMENT:
    >
      <Text2XL className="ml-4">탈퇴 멤버</Text2XL>
      {whichList === 'member' && selectedClubIdx === -1 && (
        <IconFilled className="text-2xl ml-auto mr-2" iconName="verified" />
      )}
    </div>
  )
}
