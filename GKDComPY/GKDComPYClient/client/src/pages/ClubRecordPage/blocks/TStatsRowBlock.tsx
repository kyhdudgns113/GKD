import {FC} from 'react'
import {TableRowCommonProps} from '../../../common'
import {RecordMemberInfoType} from '../../../common/typesAndValues/shareTypes'

type TStatsRowBlockProps = TableRowCommonProps & {
  memInfo: RecordMemberInfoType
}
export const TStatsRowBlock: FC<TStatsRowBlockProps> = ({memInfo, className, ...props}) => {
  return (
    <tr className={`text-sm ${className}`}>
      <td colSpan={5}>{memInfo.name}</td>
    </tr>
  )
}
