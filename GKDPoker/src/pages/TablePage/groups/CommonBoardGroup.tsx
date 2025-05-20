import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, STATE_FLOP, STATE_RIVER, STATE_TURN} from '../../../common'
import {Card} from '../addons/Card'
import {useTablePageStatesContext} from '../_context/__states'

type CommonBoardGroupProps = DivCommonProps & {}
export const CommonBoardGroup: FC<CommonBoardGroupProps> = ({className, ...props}) => {
  const {gameState, potSize} = useTablePageStatesContext()

  const styleDiv: CSSProperties = {
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: '4px',
    display: 'flex',
    flexDirection: 'column',
    height: '200px',
    paddingTop: '16px',
    width: '240px'
  }
  const styleShareCard: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'space-between',
    marginTop: '32px',
    width: '210px'
  }

  const onClickBoard = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className={`COMMON_BOARD_GROUP ${className || ''}`}
      onClick={onClickBoard}
      style={styleDiv}
      {...props} // BLANK LINE COMMENT:
    >
      <p>Pot Size: {potSize}</p>
      <div className="SHARE_CARDS " style={styleShareCard}>
        <Card cardIdx={47} isShow={gameState >= STATE_FLOP} />
        <Card cardIdx={48} isShow={gameState >= STATE_FLOP} />
        <Card cardIdx={49} isShow={gameState >= STATE_FLOP} />
        <Card cardIdx={50} isShow={gameState >= STATE_TURN} />
        <Card cardIdx={51} isShow={gameState >= STATE_RIVER} />
      </div>
    </div>
  )
}
