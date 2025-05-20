import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {SeatLeftGroup, SeatRightGroup, SeatCenterGroup} from '../groups'
import {BoardObject} from '../objects'

type TablePartProps = DivCommonProps & {}
export const TablePart: FC<TablePartProps> = ({className, ...props}) => {
  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    marginTop: '32px',
    width: 'fit-content'
  }
  const styleCenterDiv: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: 'fit-content'
  }

  return (
    <div className={`TABLE_PART ${className || ''}`} style={styleDiv} {...props}>
      <SeatLeftGroup />
      <div className={`TABLE_PART_CENTER`} style={styleCenterDiv}>
        <BoardObject />
        <SeatCenterGroup />
      </div>
      <SeatRightGroup />
    </div>
  )
}
