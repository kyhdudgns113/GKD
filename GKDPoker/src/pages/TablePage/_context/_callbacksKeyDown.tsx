import {createContext, FC, KeyboardEvent, PropsWithChildren, useCallback, useContext} from 'react'
import {useTablePageCallbacksContext} from './_callbacks'
import {useTablePageStatesContext} from './__states'
import {STATE_FINISH, STATE_INIT} from '../../../common'

// prettier-ignore
type ContextType = {
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}
// prettier-ignore
export const TablePageCallbacksKeyDownContext = createContext<ContextType>({
  onKeyDown: () => {}
})

export const useTablePageCallbacksKeyDownContext = () =>
  useContext(TablePageCallbacksKeyDownContext)

export const TablePageCallbacksKeyDown: FC<PropsWithChildren> = ({children}) => {
  const {betSize, gameState, resultBtnText, seatIdx} = useTablePageStatesContext()
  const {setActionIdx} = useTablePageStatesContext()
  const {onClickAction, onClickFold, onClickShowResult, startGame} = useTablePageCallbacksContext()

  const _clickA = useCallback(() => {
    if (gameState === STATE_INIT) {
      startGame()
    } // BLANK LINE COMMENT:
    else if (STATE_INIT < gameState && gameState < STATE_FINISH) {
      onClickAction(seatIdx, betSize)()
    } // BLANK LINE COMMENT:
    else if (gameState === STATE_FINISH) {
      onClickShowResult(resultBtnText)()
    }
  }, [betSize, gameState, resultBtnText, seatIdx, onClickAction, onClickShowResult, startGame])
  const _clickF = useCallback(() => {
    console.log(`Chekck state: ${gameState}, seatIdx: ${seatIdx}`)
    if (STATE_INIT < gameState && gameState < STATE_FINISH) {
      onClickFold(seatIdx)()
    }
  }, [gameState, seatIdx, onClickFold])
  const _clickQ = useCallback(() => {
    if (STATE_INIT < gameState && gameState < STATE_FINISH) {
      setActionIdx(prev => (prev + 2) % 3)
    }
  }, [gameState, setActionIdx])
  const _clickR = useCallback(() => {
    if (STATE_INIT < gameState && gameState < STATE_FINISH) {
      setActionIdx(prev => (prev + 1) % 3)
    }
  }, [gameState, setActionIdx])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      console.log('onKeyDown', e.key)
      switch (e.key) {
        case 'a':
          _clickA()
          break
        case 'f':
          _clickF()
          break
        case 'q':
          _clickQ()
          break
        case 'r':
          _clickR()
          break
      }
    },
    [_clickA, _clickF, _clickQ, _clickR]
  )

  // prettier-ignore
  const value = {
    onKeyDown
  }
  return (
    <TablePageCallbacksKeyDownContext.Provider value={value}>
      {children}
    </TablePageCallbacksKeyDownContext.Provider>
  )
}
