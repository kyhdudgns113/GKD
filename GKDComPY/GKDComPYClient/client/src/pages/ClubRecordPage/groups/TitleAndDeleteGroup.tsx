import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useClubRecordStatesContext} from '../_contexts'
import {DeleteIcon, Text3XL} from '../../../common/components'

type TitleAndDeleteGroupProps = DivCommonProps & {}

export const TitleAndDeleteGroup: FC<TitleAndDeleteGroupProps> = ({className, ...props}) => {
  const {weeklyRecord, weekOId, setSelDelWeek} = useClubRecordStatesContext()

  const onClickDeleteWeek = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      if (weekOId) {
        setSelDelWeek(weekOId)
      }
    },
    [weekOId, setSelDelWeek]
  )

  return (
    <div className="flex flex-row items-center mb-2 ">
      <Text3XL className="w-fit">
        {weeklyRecord.title || `${weeklyRecord.start} ~ ${weeklyRecord.end}`}
      </Text3XL>
      <DeleteIcon className="ml-4" onClick={onClickDeleteWeek} />
    </div>
  )
}
