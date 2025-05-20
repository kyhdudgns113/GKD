import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {Seat} from '../addons'

type SeatCenterGroupProps = DivCommonProps & {}
export const SeatCenterGroup: FC<SeatCenterGroupProps> = ({className, ...props}) => {
  const styleGroup: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    width: 'fit-content'
  }
  return (
    <div className={`CENTER_SEAT_GROUP ${className || ''}`} style={styleGroup} {...props}>
      <Seat hereSeatIdx={5} isLeft="4px" isBottom="4px" />
      <Seat hereSeatIdx={4} isLeft="4px" isBottom="4px" />
      <Seat hereSeatIdx={3} isLeft="4px" isBottom="4px" isRight="4px" />
    </div>
  )
}
