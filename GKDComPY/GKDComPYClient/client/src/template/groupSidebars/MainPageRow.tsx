import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, Setter} from '../../common'
import {useNavigate} from 'react-router-dom'
import {IconFilled, Text2XL} from '../../common/components'
import {useTemplateStatesContext} from '../_contexts'

export type MainPageRowProps = DivCommonProps & {
  arg: {setClickedClubRow: Setter<number | null>}
}
export const MainPageRow: FC<MainPageRowProps> = ({arg, className, ...props}) => {
  const {whichList, setSelectedClubIdx} = useTemplateStatesContext()
  const {setClickedClubRow} = arg

  const navigate = useNavigate()

  const onClickNavigate = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate('/client/mainPage')
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
      <Text2XL className="ml-4">메인 페이지</Text2XL>
      {whichList === 'mainPage' && (
        <IconFilled className="text-2xl ml-auto mr-2" iconName="verified" />
      )}
    </div>
  )
}
