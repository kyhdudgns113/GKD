import {CSSProperties, FC, useCallback, useEffect, useRef} from 'react'
import {DivCommonProps, STATE_FINISH, STATE_INIT} from '../../common'
import {ActionPart, ResultPart, SeatSelectPart, TablePart} from './parts'
import {useTablePageCallbacksKeyDownContext, useTablePageStatesContext} from './_context'
import {StartButton} from './addons'

type TablePageLayoutProps = DivCommonProps & {}
export const TablePageLayout: FC<TablePageLayoutProps> = ({className, ...props}) => {
  const {gameState, numSeatUsers, seatIdx, setSeatIdx} = useTablePageStatesContext()
  const {onKeyDown} = useTablePageCallbacksKeyDownContext()
  const divRef = useRef<HTMLDivElement>(null)

  const styleDiv: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',

    userSelect: 'none',
    width: '100%'
  }

  const onClickPage = useCallback(() => {
    if (gameState === STATE_INIT) {
      setSeatIdx(-1)
    }
  }, [gameState, setSeatIdx])

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus()
    }
  }, [divRef, seatIdx])

  return (
    <div
      ref={divRef}
      autoFocus
      className={`TABLE_PAGE_LAYOUT ${className || ''}`}
      onClick={onClickPage}
      onKeyDown={onKeyDown}
      style={styleDiv}
      tabIndex={0}
      {...props} // BLANK LINE COMMENT:
    >
      <TablePart />
      {gameState === STATE_INIT && seatIdx === -1 && numSeatUsers >= 2 && <StartButton />}
      {gameState === STATE_INIT && seatIdx !== -1 && <SeatSelectPart />}
      {STATE_INIT < gameState && gameState < STATE_FINISH && <ActionPart />}
      {gameState === STATE_FINISH && <ResultPart />}
    </div>
  )
}
