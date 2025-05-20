import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {useClubRecordStatesContext} from '../_contexts'
import {RecordTableGroup, TitleAndDeleteGroup} from '../groups'

type RecordTablePartProps = DivCommonProps & {}
export const RecordTablePart: FC<RecordTablePartProps> = ({className, ...props}) => {
  const {weeklyRecord} = useClubRecordStatesContext()

  const stylePart: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    maxHeight: '100%',
    overflowX: 'auto',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '16px',
    paddingRight: '16px',
    width: '1490px'
  }

  if (!weeklyRecord) return null
  return (
    <div className={`${className}`} style={stylePart} {...props}>
      <TitleAndDeleteGroup />
      <RecordTableGroup />
    </div>
  )
}
