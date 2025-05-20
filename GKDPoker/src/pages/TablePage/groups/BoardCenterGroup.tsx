import {DivCommonProps} from '../../../common'
import {CSSProperties, FC} from 'react'
import {Board} from '../addons'

type BoardCenterGroupProps = DivCommonProps & {}
export const BoardCenterGroup: FC<BoardCenterGroupProps> = ({className, ...props}) => {
  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    width: 'fit-content'
  }
  return (
    <div className={`BOARD_CENTER_GROUP ${className || ''}`} style={styleDiv} {...props}>
      <Board hereSeatIdx={5} isLeft="4px" isBottom="4px" />
      <Board hereSeatIdx={4} isLeft="4px" isBottom="4px" />
      <Board hereSeatIdx={3} isLeft="4px" isBottom="4px" isRight="4px" />
    </div>
  )
}
