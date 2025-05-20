import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {Seat} from '../addons'
type SeatRightGroupProps = DivCommonProps & {}
export const SeatRightGroup: FC<SeatRightGroupProps> = ({className, ...props}) => {
  const styleGroup: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: 'fit-content'
  }
  return (
    <div className={`SEAT_RIGHT_GROUP ${className || ''}`} style={styleGroup} {...props}>
      <Seat hereSeatIdx={0} isRight="4px" isTop="4px" />
      <Seat hereSeatIdx={1} isRight="4px" isTop="4px" />
      <Seat hereSeatIdx={2} isRight="4px" isTop="4px" isBottom="4px" />
    </div>
  )
}
