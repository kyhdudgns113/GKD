import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {BoardCenterGroup, BoardLeftGroup, BoardRightGroup, CommonBoardGroup} from '../groups'

type BoardObjectProps = DivCommonProps & {}
export const BoardObject: FC<BoardObjectProps> = ({className, ...props}) => {
  const styleBoard: CSSProperties = {
    backgroundColor: '#00BB00',
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    width: 'fit-content'
  }
  const styleCenterDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: 'fit-content'
  }
  return (
    <div className={`BOARD_OBJECT ${className || ''}`} style={styleBoard} {...props}>
      <BoardLeftGroup />
      <div className="BOARD_CENTER_DIV " style={styleCenterDiv}>
        <CommonBoardGroup />
        <BoardCenterGroup />
      </div>
      <BoardRightGroup />
    </div>
  )
}
