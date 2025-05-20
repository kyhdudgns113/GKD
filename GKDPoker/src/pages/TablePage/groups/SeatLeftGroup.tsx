import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {Seat} from '../addons'

type SeatLeftGroupProps = DivCommonProps & {}
export const SeatLeftGroup: FC<SeatLeftGroupProps> = ({className, ...props}) => {
  const styleGroup: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: 'fit-content'
  }
  return (
    <div className={`SEAT_LEFT_GROUP ${className || ''}`} style={styleGroup} {...props}>
      <Seat hereSeatIdx={8} isLeft="4px" isTop="4px" />
      <Seat hereSeatIdx={7} isLeft="4px" isTop="4px" />
      <Seat hereSeatIdx={6} isLeft="4px" isTop="4px" isBottom="4px" />
    </div>
  )
}
