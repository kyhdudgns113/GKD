import {DivCommonProps} from '../../../common'
import {CSSProperties, FC} from 'react'
import {Board, Empty} from '../addons'

type BoardLeftGroupProps = DivCommonProps & {}
export const BoardLeftGroup: FC<BoardLeftGroupProps> = ({className, ...props}) => {
  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 'fit-content'
  }
  return (
    <div className={`BOARD_LEFT_GROUP ${className || ''}`} style={styleDiv} {...props}>
      <Board hereSeatIdx={8} isLeft="4px" isTop="4px" />
      <Board hereSeatIdx={7} isLeft="4px" isTop="4px" />
      <Board hereSeatIdx={6} isLeft="4px" isTop="4px" isBottom="4px" />
      <Empty height={40} width={80} />
    </div>
  )
}
