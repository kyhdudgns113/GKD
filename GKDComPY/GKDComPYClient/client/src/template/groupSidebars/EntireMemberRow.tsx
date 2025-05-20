import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, Setter} from '../../common'
import {useNavigate} from 'react-router-dom'
import {IconFilled, Text2XL} from '../../common/components'
import {useTemplateStatesContext} from '../_contexts'

export type EntireMemberRowProps = DivCommonProps & {
  arg: {setClickedClubRow: Setter<number | null>}
}
export const EntireMemberRow: FC<EntireMemberRowProps> = ({arg, className, ...props}) => {
  const {whichList, setSelectedClubIdx} = useTemplateStatesContext()
  const {setClickedClubRow} = arg

  const navigate = useNavigate()

  const onClickNavigate = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate('/client/entireMember')
      setClickedClubRow(null)
      setSelectedClubIdx(null)
    },
    [navigate, setClickedClubRow, setSelectedClubIdx]
  )
  return (
    <div
      className={`cursor-pointer flex flex-row  hover:bg-gkd-sakura-bg-70 pt-1 pb-2 ${className}`}
      onClick={onClickNavigate}
      {...props} // BLANK LINE COMMENT:
    >
      <Text2XL className="ml-4">전체 멤버</Text2XL>
      {whichList === 'entireMember' && (
        <IconFilled className="text-2xl ml-auto mr-2" iconName="verified" />
      )}
    </div>
  )
}
