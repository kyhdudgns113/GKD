import {DivCommonProps} from '../../../common'
import {CSSProperties, FC} from 'react'
import {Board, Empty} from '../addons'

type BoardRightGroupProps = DivCommonProps & {}
export const BoardRightGroup: FC<BoardRightGroupProps> = ({className, ...props}) => {
  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 'fit-content'
  }
  return (
    <div className={`BOARD_RIGHT_GROUP ${className || ''}`} style={styleDiv} {...props}>
      <Board hereSeatIdx={0} isRight="4px" isTop="4px" />
      <Board hereSeatIdx={1} isRight="4px" isTop="4px" />
      <Board hereSeatIdx={2} isRight="4px" isTop="4px" isBottom="4px" />
      <Empty height={40} width={80} />
    </div>
  )
}
