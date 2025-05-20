import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, Setter} from '../../common'
import {ClubInfoType} from '../../common/typesAndValues/shareTypes'
import {Icon, IconFilled, TextXL} from '../../common/components'
import {useNavigate} from 'react-router-dom'
import {useTemplateStatesContext} from '../_contexts'

type ClubPageRowProps = DivCommonProps & {
  arg: {
    club: ClubInfoType
    clubIdx: number
    clickedClubRow: number | null
    setClickedClubRow: Setter<number | null>
  }
}
export const ClubPageRow: FC<ClubPageRowProps> = ({arg, className, ...props}) => {
  const {selectedClubIdx, whichList} = useTemplateStatesContext()
  const {club, clubIdx, clickedClubRow, setClickedClubRow} = arg

  const navigate = useNavigate()

  const cnSubRow = 'cursor-pointer flex flex-row items-center hover:bg-gkd-sakura-bg-70 py-1'

  const onClickClubName = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setClickedClubRow(prev => (prev === clubIdx ? 0 : clubIdx))
    },
    [clubIdx, setClickedClubRow]
  )
  const onClickDocument = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate(`/client/club/document/${clubIdx}`)
    },
    [clubIdx, navigate]
  )
  const onClickMemberAndLineUp = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate(`/client/club/member/${clubIdx}`)
    },
    [clubIdx, navigate]
  )
  const onClickClubRecord = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate(`/client/club/record/${clubIdx}`)
    },
    [clubIdx, navigate]
  )

  if (clubIdx === 0) {
    return (
      <div
        className="flex flex-row items-center select-none cursor-pointer hover:bg-gkd-sakura-bg-70 py-1"
        onClick={onClickMemberAndLineUp} // BLANK LINE COMMENT:
      >
        <TextXL className="ml-4">- 후보군</TextXL>
        {selectedClubIdx === 0 && <IconFilled className="ml-auto mr-2" iconName={'verified'} />}
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      {/* 클럽: 클럽명 */}
      <div
        className={`cursor-pointer flex flex-row items-center hover:bg-gkd-sakura-bg-70 ${className}`}
        onClick={onClickClubName}
        {...props} // BLANK LINE COMMENT:
      >
        <TextXL className="ml-4">- 클럽: {club.name}</TextXL>
        {clubIdx === clickedClubRow ? (
          <Icon className="text-4xl ml-auto mr-1" iconName="arrow_drop_down" />
        ) : (
          <Icon className="text-4xl ml-auto mr-1" iconName="arrow_right" />
        )}
      </div>

      {/* 선택 옵션 */}
      {clubIdx === clickedClubRow && (
        <div className="flex flex-col">
          <div className={cnSubRow} onClick={onClickDocument}>
            <TextXL className="ml-8">- 회의록</TextXL>
            {whichList === 'document' && clubIdx === selectedClubIdx && (
              <IconFilled className="ml-auto mr-2" iconName={'verified'} />
            )}
          </div>
          <div className={cnSubRow} onClick={onClickMemberAndLineUp}>
            <TextXL className="ml-8">- 멤버 & 라인업</TextXL>
            {whichList === 'member' && clubIdx === selectedClubIdx && (
              <IconFilled className="ml-auto mr-2" iconName={'verified'} />
            )}
          </div>
          <div className={cnSubRow} onClick={onClickClubRecord}>
            <TextXL className="ml-8">- 대전기록</TextXL>
            {whichList === 'record' && clubIdx === selectedClubIdx && (
              <IconFilled className="ml-auto mr-2" iconName={'verified'} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
